import { ImpersonationBanner } from "@/components/layout/impersonation-banner";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AskAIFab } from "@/components/ai/ask-ai-fab";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/motion/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ImpersonationBanner />
      <div className="md:flex md:h-svh md:max-h-svh md:flex-row md:overflow-hidden">
        <Sidebar />
        <div className="contents md:flex md:min-h-0 md:min-w-0 md:flex-1 md:flex-col md:overflow-hidden">
          <Navbar />
          <main className="relative p-4 pb-32 md:min-h-0 md:flex-1 md:overflow-y-auto md:pb-8 md:p-6 lg:p-8">
            <div
              className="pointer-events-none absolute inset-0 app-mesh"
              aria-hidden
            />
            <div className="relative">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <AskAIFab />
        </div>
      </div>
    </AuthGuard>
  );
}
