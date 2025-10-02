import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
    headers: {
      Cookie: `auth=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) redirect("/");

  const data = await res.json();

  if (data.user.role !== "ADMIN") redirect("/");

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
