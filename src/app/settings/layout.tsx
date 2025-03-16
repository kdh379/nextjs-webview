import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">설정</h1>
      <div className="flex gap-8">
        <nav className="w-64">
          <ul className="space-y-2">
            <li>
              <Link href="/settings" className="text-blue-500 hover:underline">
                기본 설정
              </Link>
            </li>
            <li>
              <Link
                href="/settings/profile"
                className="text-blue-500 hover:underline"
              >
                프로필 설정
              </Link>
            </li>
            <li>
              <Link
                href="/settings/notification"
                className="text-blue-500 hover:underline"
              >
                알림 설정
              </Link>
            </li>
            <li>
              <Link href="/" className="text-blue-500 hover:underline">
                홈으로
              </Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
