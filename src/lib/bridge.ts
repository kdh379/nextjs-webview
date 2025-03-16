// Constants
const ERRORS = {
  REACT_NATIVE_NOT_AVAILABLE: "ReactNativeWebView is not available",
  BRIDGE_PARSE_ERROR: "Bridge parse error:",
  BLUETOOTH_CALLBACK_REGISTER_FAILED: "블루투스 콜백 등록 실패:",
} as const;

// Types
type BridgeCallback<T = unknown> = (response: BridgeResponse<T>) => void;
type BridgeCleanup = () => void;

// Utilities
const generateId = () => Math.random().toString(36).substring(2, 15);
const isReactNative =
  typeof window !== "undefined" && window.ReactNativeWebView;

// Callback Management
class CallbackManager {
  private callbacks = new Map<string, BridgeCallback<any>>();

  set(id: string, callback: BridgeCallback<any>) {
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
export const sendBridgeMessage = <
  T extends MessageTypes[keyof MessageTypes],
  R = unknown,
>(
  type: MessageType,
  payload: T,
): Promise<R> => {
  if (!isReactNative) {
    console.warn(ERRORS.REACT_NATIVE_NOT_AVAILABLE);
    return Promise.reject(new Error(ERRORS.REACT_NATIVE_NOT_AVAILABLE));
  }

  return new Promise((resolve, reject) => {
    const id = generateId();
    const message = { id, type, payload };

    callbackManager.set(id, (response: BridgeResponse) => {
      if (response.success) {
        resolve(response.data as R);
      } else {
        reject(new Error(response.error));
      }
    });

    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  });
};

// Bridge API
export const bridge = {
  alert: ({ title, message, buttons }: AlertPayload) =>
    sendBridgeMessage<AlertPayload, AlertResponse>("ALERT", {
      title,
      message,
      buttons,
    }),

  navigate: (screen: string, params?: Record<string, unknown>) =>
    sendBridgeMessage("NAVIGATE", { screen, params }),

  getUserInfo: () =>
    sendBridgeMessage<undefined, UserInfoResponse>("GET_USER_INFO", undefined),

  setUserInfo: (userInfo: UserInfoResponse) =>
    sendBridgeMessage("SET_USER_INFO", userInfo),

  bluetooth: {
    checkStatus: () =>
      sendBridgeMessage<undefined, BluetoothStatus>(
        "BLUETOOTH_STATUS_CHECK",
        undefined,
      ),

    requestEnable: () =>
      sendBridgeMessage<undefined, BluetoothStatusPayload>(
        "BLUETOOTH_ENABLE_REQUEST",
        undefined,
      ),

    onStatusChange: (
      callback: BridgeCallback<BluetoothStatusPayload>,
    ): BridgeCleanup => {
      if (typeof window === "undefined") return () => {};

      const callbackId = generateId();
      callbackManager.set(callbackId, callback);

      sendBridgeMessage("REGISTER_BLUETOOTH_CALLBACK", { callbackId }).catch(
        (error) => {
          console.error(ERRORS.BLUETOOTH_CALLBACK_REGISTER_FAILED, error);
          callbackManager.delete(callbackId);
        },
      );

      return () => {
        callbackManager.delete(callbackId);
        sendBridgeMessage("UNREGISTER_BLUETOOTH_CALLBACK", {
          callbackId,
        }).catch(console.error);
      };
    },
  },

  camera: {
    showModal: (options: CameraPictureOptions) =>
      sendBridgeMessage<CameraPictureOptions, CameraResult>(
        "CAMERA_SHOW",
        options,
      ),

    hideCamera: () =>
      sendBridgeMessage<undefined, undefined>("CAMERA_HIDE", undefined),

    requestPermission: () =>
      sendBridgeMessage<undefined, CameraPermissionResponse>(
        "CAMERA_REQUEST_PERMISSION",
        undefined,
      ),

    stopRecording: () =>
      sendBridgeMessage<undefined, undefined>(
        "CAMERA_STOP_RECORDING",
        undefined,
      ),

    // saveToLibrary: (uri: string) =>
    //   sendBridgeMessage<undefined, undefined>("CAMERA_SAVE_TO_LIBRARY", {
    //     uri,
    //   }),
  },
};
