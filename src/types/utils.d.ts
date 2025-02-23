interface Window {
  ReactNativeWebView?: {
    postMessage: (message: unknown) => void;
  };
  webkit?: {
    messageHandlers: {
      bluetoothHandler: {
        postMessage: (message: unknown) => void;
      };
    };
  };
  Android?: {
    checkBluetoothStatus: () => void;
    requestBluetoothEnable: () => void;
  };
}
