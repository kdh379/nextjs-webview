import Link from "next/link";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "제품 1" },
    { id: 2, name: "제품 2" },
    { id: 3, name: "제품 3" },
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">제품 목록</h1>
      <ul className="space-y-4 mb-6">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="text-blue-500 hover:underline"
            >
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-blue-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
