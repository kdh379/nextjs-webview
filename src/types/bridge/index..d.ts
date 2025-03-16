// Bridge Request Message Types
type BridgeMessage = {
  id: string;
  type: string;
  payload: any;
};

// Bridge Response Types
type BridgeResponse<T = any> = {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
};

// Bridge Callback Types
type BridgeCallbackFn<T = unknown> = (response: BridgeResponse<T>) => void;
type BridgeCleanupFn = () => void;

// 브릿지 타입 정의 - API paths와 유사한 구조
type bridges = {
  ALERT: {
    payload: AlertPayload;
    response: AlertResponse;
  };
  NAVIGATE: {
    payload: {
      screen: string;
      params?: Record<string, unknown>;
    };
    response: void;
  };
  GET_USER_INFO: {
    payload: undefined;
    response: UserInfoResponse;
  };
  SET_USER_INFO: {
    payload: UserInfoResponse;
    response: void;
  };
  BLUETOOTH_STATUS_CHECK: {
    payload: undefined;
    response: BluetoothStatus;
  };
  BLUETOOTH_ENABLE_REQUEST: {
    payload: undefined;
    response: BluetoothStatusPayload;
  };
  REGISTER_BLUETOOTH_CALLBACK: {
    payload: {
      callbackId: string;
    };
    response: void;
  };
  UNREGISTER_BLUETOOTH_CALLBACK: {
    payload: {
      callbackId: string;
    };
    response: void;
  };
  CAMERA_SHOW: {
    payload: CameraPictureOptions;
    response: CameraResult;
  };
  CAMERA_HIDE: {
    payload: undefined;
    response: void;
  };
  CAMERA_REQUEST_PERMISSION: {
    payload: undefined;
    response: CameraPermissionResponse;
  };
  CAMERA_STOP_RECORDING: {
    payload: undefined;
    response: void;
  };
  OCR_SCAN_ID_CARD: {
    payload: OCRPayload;
    response: OCRResponse;
  };
};

type BridgeType = keyof bridges;
