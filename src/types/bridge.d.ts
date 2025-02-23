type BridgeEventType =
  | "ALERT"
  | "CONFIRM"
  | "TOAST"
  | "NAVIGATE"
  | "GET_USER_INFO"
  | "SET_USER_INFO"
  | "BLUETOOTH_STATUS_CHECK"
  | "BLUETOOTH_ENABLE_REQUEST"
  | "BLUETOOTH_STATUS"
  | "REGISTER_BLUETOOTH_CALLBACK"
  | "UNREGISTER_BLUETOOTH_CALLBACK";

type BridgePayload<T = unknown> = {
  id: string;
  type: BridgeEventType;
  payload: T;
};

type BridgeResponse<T = unknown> = {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
};

type AlertPayload = {
  title?: string;
  message: string;
};

type ConfirmPayload = {
  title?: string;
  message: string;
};

type ToastPayload = {
  message: string;
  duration?: number;
};

type NavigatePayload = {
  screen: string;
  params?: Record<string, unknown>;
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
};

type BluetoothStatus = "on" | "off" | "unauthorized" | "unsupported";

type BluetoothStatusPayload = {
  status: BluetoothStatus;
  message?: string;
};
