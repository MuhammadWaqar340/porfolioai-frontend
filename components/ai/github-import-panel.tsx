"use client";

import { Code2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/hooks/use-projects";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { GitHubRepoDraft } from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import {
  useGetAIStatusQuery,
  useImportGitHubReposMutation,
} from "@/store/api/portfolioApi";

export function GitHubImportPanel() {
  const { data: aiStatus } = useGetAIStatusQuery();
  const [importRepos, { isLoading }] = useImportGitHubReposMutation();
  const { addProject, projects } = useProjects();
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GitHubRepoDraft[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const aiReady = aiStatus?.available ?? false;

  async function handleFetch() {
    setError(null);
    setRepos([]);
    setSelected(new Set());
    try {
      const result = await importRepos({
        github_username: username.trim(),
        max_repos: 12,
      }).unwrap();
      setRepos(result.repos);
      setSelected(new Set(result.repos.map((repo) => repo.source_repo)));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  function toggleRepo(sourceRepo: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(sourceRepo)) next.delete(sourceRepo);
      else next.add(sourceRepo);
      return next;
    });
  }

  async function handleImportSelected() {
    const toImport = repos.filter((repo) => selected.has(repo.source_repo));
    if (toImport.length === 0) return;

    setIsApplying(true);
    setError(null);
    try {
      const existingGithub = new Set(
        projects.map((p) => p.githubUrl.trim().toLowerCase()).filter(Boolean)
      );
      let added = 0;

      for (const repo of toImport) {
        if (existingGithub.has(repo.github_url.toLowerCase())) continue;
        await addProject({
          title: repo.title,
          description: repo.description,
          imageUrl: "",
          imageUrls: [],
          technologies: repo.technologies,
          githubUrl: repo.github_url,
          liveUrl: repo.live_url,
        });
        existingGithub.add(repo.github_url.toLowerCase());
        added += 1;
      }

      notifySuccess(
        added > 0
          ? `Imported ${added} project${added === 1 ? "" : "s"} from GitHub.`
          : "Selected repos were already in your projects."
      );
      setRepos([]);
      setSelected(new Set());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <Card id="github" className="h-full min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Code2 className="h-4 w-4 text-primary" />
          Import from GitHub
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pull your public repositories as project drafts — review before they appear on your portfolio.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="GitHub username or profile URL"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={() => void handleFetch()}
            disabled={isLoading || username.trim().length < 1}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!aiReady && aiStatus ? (
          <p className="text-xs text-muted-foreground">{aiStatus.message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {repos.length > 0 ? (
          <div className="space-y-3">
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {repos.map((repo) => {
                const checked = selected.has(repo.source_repo);
                return (
                  <li key={repo.source_repo}>
                    <button
                      type="button"
                      onClick={() => toggleRepo(repo.source_repo)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        checked ? "border-primary/40 bg-primary/5" : "hover:bg-muted/40"
                      }`}
                    >
                      <p className="font-medium">{repo.title}</p>
                      {repo.description ? (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {repo.description}
                        </p>
                      ) : null}
                      {repo.technologies.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {repo.technologies.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-[10px]">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleImportSelected()}
              disabled={isApplying || selected.size === 0}
            >
              {isApplying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Import {selected.size} selected
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
