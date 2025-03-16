import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params }: Props) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">제품 상세 페이지</h1>
      <p className="mb-4">제품 ID: {params.id}</p>
      <div className="space-x-4">
        <Link href="/products" className="text-blue-500 hover:underline">
          제품 목록으로
        </Link>
        <Link href="/" className="text-blue-500 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
