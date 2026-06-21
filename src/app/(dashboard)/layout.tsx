export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be added later */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}