// Constants
const ERRORS = {
  REACT_NATIVE_NOT_AVAILABLE: "ReactNativeWebView is not available",
  BRIDGE_PARSE_ERROR: "Bridge parse error:",
  BLUETOOTH_CALLBACK_REGISTER_FAILED: "블루투스 콜백 등록 실패:",
} as const;

// Utilities
const generateId = () => Math.random().toString(36).substring(2, 15);
const isReactNative =
  typeof window !== "undefined" && window.ReactNativeWebView;

// Callback Management
class CallbackManager {
  private callbacks = new Map<string, BridgeCallbackFn<any>>();

  set(id: string, callback: BridgeCallbackFn<any>) {
    this.callbacks.set(id, callback);
  }

  get(id: string) {
    return this.callbacks.get(id);
  }

  delete(id: string) {
    this.callbacks.delete(id);
  }

  execute(id: string, response: BridgeResponse) {
    const callback = this.get(id);
    if (callback) {
      callback(response);
      this.delete(id);
    }
  }
}

const callbackManager = new CallbackManager();

// Bridge Initialization
export const initBridge = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("message", (event) => {
    try {
      const response = JSON.parse(event.data) as BridgeResponse;
      callbackManager.execute(response.id, response);
    } catch (error) {
      console.error(ERRORS.BRIDGE_PARSE_ERROR, error);
    }
  });
};

// Message Sending
const sendBridgeMessage = <
  BridgeType extends keyof bridges,
  Payload extends bridges[BridgeType]["payload"],
  Response extends bridges[BridgeType]["response"],
>(
  type: BridgeType,
  payload: Payload,
): Promise<Response> => {
  if (!isReactNative) {
    console.warn(ERRORS.REACT_NATIVE_NOT_AVAILABLE);
    return Promise.reject(new Error(ERRORS.REACT_NATIVE_NOT_AVAILABLE));
  }

  return new Promise((resolve, reject) => {
    const id = generateId();
    const message: BridgeMessage = { id, type: type as string, payload };

    callbackManager.set(id, (response: BridgeResponse) => {
      if (response.success) {
        resolve(response.data as Response);
      } else {
        reject(new Error(response.error));
      }
    });

    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  });
};

// API Type Utilities
type BridgeApiResponse<T> = Promise<T>;

type BridgeFromPaths = {
  <BridgeType extends keyof bridges>(
    type: BridgeType,
    payload: bridges[BridgeType]["payload"],
  ): BridgeApiResponse<bridges[BridgeType]["response"]>;
};

// ------------------------------
// Bridge API - 일반 브릿지 호출용 함수
// ------------------------------
export const bridge: BridgeFromPaths = <BridgeType extends keyof bridges>(
  type: BridgeType,
  payload: bridges[BridgeType]["payload"],
): BridgeApiResponse<bridges[BridgeType]["response"]> => {
  return sendBridgeMessage(type, payload);
};

// ------------------------------
// Bridge Listener - 리스너 등록 함수
// ------------------------------
type BridgeListenerConfig = {
  BLUETOOTH_STATUS: {
    registerType: "REGISTER_BLUETOOTH_CALLBACK";
    unregisterType: "UNREGISTER_BLUETOOTH_CALLBACK";
    responseType: bridges["BLUETOOTH_ENABLE_REQUEST"]["response"];
  };
  // 추가적인 리스너 타입이 생기면 여기에 추가
};

export const bridgeListener = <ListenerType extends keyof BridgeListenerConfig>(
  type: ListenerType,
  callback: BridgeCallbackFn<
    BridgeListenerConfig[ListenerType]["responseType"]
  >,
): BridgeCleanupFn => {
  if (typeof window === "undefined") return () => {};

  const callbackId = generateId();
  callbackManager.set(callbackId, callback);

  const config = {
    BLUETOOTH_STATUS: {
      registerType: "REGISTER_BLUETOOTH_CALLBACK",
      unregisterType: "UNREGISTER_BLUETOOTH_CALLBACK",
      errorMessage: ERRORS.BLUETOOTH_CALLBACK_REGISTER_FAILED,
    },
  }[type];

  sendBridgeMessage(config.registerType as any, { callbackId }).catch(
    (error) => {
      console.error(config.errorMessage, error);
      callbackManager.delete(callbackId);
    },
  );

  return () => {
    callbackManager.delete(callbackId);
    sendBridgeMessage(config.unregisterType as any, {
      callbackId,
    }).catch(console.error);
  };
};

// 이벤트 리스너 함수들
export const listenBluetoothStatus = (
  callback: BridgeCallbackFn<bridges["BLUETOOTH_ENABLE_REQUEST"]["response"]>,
): BridgeCleanupFn => {
  return bridgeListener("BLUETOOTH_STATUS", callback);
};
