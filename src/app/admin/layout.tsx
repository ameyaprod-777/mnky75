import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { AdminNotificationPoller } from "@/components/admin/AdminNotificationPoller";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export const metadata: Metadata = {
  title: `Admin — ${SITE.name}`,
  description: "Interface d’administration Moonkey Paris",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-jungle-page">
      <AdminNotificationPoller />
      <AdminTopNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
