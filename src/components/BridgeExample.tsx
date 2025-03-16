"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useBridge } from "@/hooks/useBridge";
import { bridge } from "@/lib/bridge";

export const BridgeExample = () => {
  const [resText, setResText] = useState<string | null>(null);
  const [cameraResult, setCameraResult] = useState<CameraResult | null>(null);
  useBridge();
  // const [bluetoothStatus, setBluetoothStatus] =
  // useState<BluetoothStatus>("off");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    //   // 블루투스 상태 변경 감지
    //   bridge.bluetooth.onStatusChange(({ data }) => {
    //     console.log("블루투스 상태 변경:", data);
    //     setBluetoothStatus(data?.status ?? "off");
    //   });

    //   // 초기 블루투스 상태 확인
    //   bridge.bluetooth.checkStatus().catch(console.error);

    // 사용자 정보 가져오기
    bridge.getUserInfo().then(setUserInfo).catch(console.error);
  }, []);

  const handleAlertClick = async () => {
    try {
      const result = await bridge.alert({
        title: "Alert Title",
        message: "Alert Message....",
        buttons: [
          {
            text: "확인",
            style: "default",
            actionId: "confirm",
          },
          {
            text: "취소",
            style: "cancel",
            actionId: "cancel",
          },
        ],
      });
      console.log("알림 표시 결과:", result.actionId);
      setResText(JSON.stringify(result));
    } catch (error) {
      console.error("알림 표시 실패:", error);
    }
  };

  const handleCameraClick = async () => {
    try {
      const permissionResult = await bridge.camera.requestPermission();
      console.log("카메라 권한 요청 결과:", permissionResult);
      const showCameraResult = await bridge.camera.showModal({
        quality: "2160p",
        flash: "off",
        facing: "back",
      });
      console.log("카메라 표시 결과:", showCameraResult);
      setResText("카메라 표시 결과:" + JSON.stringify(showCameraResult));
      setCameraResult(showCameraResult);
    } catch (error) {
      console.error("카메라 촬영 실패:", error);
    }
  };

  // const handleBluetoothEnableClick = async () => {
  //   try {
  //     const result = await bridge.bluetooth.requestEnable();
  //     console.log("블루투스 활성화 결과:", result);
  //   } catch (error) {
  //     console.error("블루투스 활성화 요청 실패:", error);
  //   }
  // };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">브릿지 테스트</h1>

      <div className="space-y-4">
        {/* <div>
          <h2 className="text-xl font-semibold mb-2">블루투스 상태</h2>
          <p>현재 상태: {bluetoothStatus}</p>
          <button
            onClick={handleBluetoothEnableClick}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            블루투스 활성화
          </button>
        </div> */}

        <div>
          <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
          {userInfo ? (
            <pre className="p-2 rounded">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          ) : (
            <p>사용자 정보를 불러오는 중...</p>
          )}
        </div>

        <div className="space-x-2">
          <button
            onClick={handleAlertClick}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Alert 테스트
          </button>
          <button
            onClick={handleCameraClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            카메라 테스트
          </button>
        </div>

        <div className="mt-4">
          <p>응답 결과: {resText}</p>
        </div>
        {cameraResult && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">카메라 촬영 결과</h2>
            <Image
              src={cameraResult.base64 ?? ""}
              alt="카메라 촬영 결과"
              className="w-full h-full rounded-md aspect-square object-cover"
              width={cameraResult.width}
              height={cameraResult.height}
            />
          </div>
        )}
      </div>
    </div>
  );
};
