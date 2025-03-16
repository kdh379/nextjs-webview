declare global {
  type NavigationPayload = {
    screen: string;
    params?: Record<string, unknown>;
  };
}

export {};

export type RootParamList = {
  Home: undefined;
  // 다른 화면들도 여기에 추가
};
