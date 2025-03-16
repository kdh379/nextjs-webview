/**
 * 웹뷰와 공유해야할 타입 정의 파일입니다.
 * 웹뷰에서 해당 타입에 맞게 payload를 전달하도록 합니다.
 */

/** 메인 타입 정의 */
type MessageTypes = {
  ALERT: AlertPayload;
  NAVIGATE: NavigationPayload;
  GET_USER_INFO: undefined;
  SET_USER_INFO: UserInfoPayload;

  // 블루투스 관련 메시지 타입
  REGISTER_BLUETOOTH_CALLBACK: BluetoothCallbackPayload;
  UNREGISTER_BLUETOOTH_CALLBACK: BluetoothCallbackPayload;
  BLUETOOTH_STATUS_CHECK: undefined;
  BLUETOOTH_ENABLE_REQUEST: undefined;
  BLUETOOTH_SCAN_START: undefined;
  BLUETOOTH_SCAN_STOP: undefined;
  BLUETOOTH_CONNECT: { deviceId: string };
  BLUETOOTH_DISCONNECT: { deviceId: string };
  BLUETOOTH_GET_CONNECTED_DEVICES: undefined;
  BLUETOOTH_STATUS: { status: BluetoothStatus; message?: string };

  // 카메라 관련 메시지 타입
  CAMERA_SHOW: undefined;
  CAMERA_HIDE: undefined;
  CAMERA_REQUEST_PERMISSION: undefined;
  CAMERA_TAKE_PICTURE: CameraPictureOptions;
  CAMERA_RECORD_VIDEO: CameraRecordOptions;
  CAMERA_STOP_RECORDING: undefined;
  CAMERA_SAVE_TO_LIBRARY: { uri: string };
};

type MessageType = keyof MessageTypes;

type BridgePayload<T extends MessageType = MessageType> = {
  id: string;
  type: T;
  payload: MessageTypes[T];
};

type BridgeResponse<T = unknown> = {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
};
