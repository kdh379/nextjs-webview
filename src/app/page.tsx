import Link from "next/link";

import { BridgeExample } from "@/components/BridgeExample";

export default function Home() {
  return (
    <main className="min-h-screen p-8 ">
      <h1 className="text-3xl font-bold mb-6">Next.js 라우팅 테스트</h1>
      <nav className="space-y-4">
        <ul className="space-y-2">
          <li>
            <Link href="/about" className="text-blue-500 hover:underline">
              About 페이지
            </Link>
          </li>
          <li>
            <Link href="/products" className="text-blue-500 hover:underline">
              제품 목록
            </Link>
          </li>
          <li>
            <Link href="/settings" className="text-blue-500 hover:underline">
              설정
            </Link>
          </li>
        </ul>
      </nav>
      <BridgeExample />
    </main>
  );
}
