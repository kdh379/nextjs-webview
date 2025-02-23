import { BridgeExample } from "@/components/BridgeExample";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">블루투스 연결 테스트</h1>
      <BridgeExample />
    </div>
  );
}
