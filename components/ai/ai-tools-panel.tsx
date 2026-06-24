import { AIBuildPathsCard } from "@/components/ai/ai-build-paths-card";
import { ResumeImportPanel } from "@/components/ai/resume-import-panel";

/** @deprecated Use AIAssistancePage sections or AIBuildPathsCard + ResumeImportPanel directly. */
export function AIToolsPanel() {
  return (
    <div className="space-y-6">
      <AIBuildPathsCard />
      <ResumeImportPanel />
    </div>
  );
}
