import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">About 페이지</h1>
      <p className="mb-4">
        이 페이지는 Next.js 라우팅 테스트를 위한 About 페이지입니다.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
