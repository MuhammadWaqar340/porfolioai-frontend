"use client";

import { Copy, Link2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useSubscription } from "@/hooks/use-subscription";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import {
  useCreateShareLinkMutation,
  useDeleteShareLinkMutation,
  useGetPortfolioVariantsQuery,
  useGetShareLinksQuery,
} from "@/store/api/portfolioApi";
import { cn } from "@/lib/utils";

export function ShareLinksPanel() {
  const { isPro } = useSubscription();
  const { data: links = [], isLoading } = useGetShareLinksQuery();
  const { data: variants = [] } = useGetPortfolioVariantsQuery();
  const [createLink, { isLoading: isCreating }] = useCreateShareLinkMutation();
  const [deleteLink] = useDeleteShareLinkMutation();
  const [label, setLabel] = useState("");
  const [variantId, setVariantId] = useState("");
  const [allowFeedback, setAllowFeedback] = useState(true);
  const [expiresInDays, setExpiresInDays] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!label.trim()) return;

    try {
      await createLink({
        label: label.trim(),
        variant_id: variantId || undefined,
        allow_feedback: allowFeedback,
        expires_in_days: expiresInDays ? Number(expiresInDays) : undefined,
      }).unwrap();
      setLabel("");
      setVariantId("");
      setExpiresInDays("");
      notifySuccess("Private share link created.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    notifySuccess("Share link copied.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          Private share links
        </CardTitle>
        <CardDescription>
          Share a preview link with recruiters even when your portfolio is private. Optional feedback
          is delivered to your notifications inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPro ? (
          <ProUpgradeCard
            compact
            title="Private share links are Pro"
            description="Create expiring preview links for recruiters with optional variant targeting and feedback."
          />
        ) : null}
        <form
          onSubmit={(e) => void handleCreate(e)}
          className={cn("space-y-3 rounded-lg border p-4", !isPro && "pointer-events-none opacity-60")}
        >
          <div className="space-y-1.5">
            <Label htmlFor="share-label">Label</Label>
            <Input
              id="share-label"
              placeholder="e.g. Acme Corp application"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          {variants.length > 0 ? (
            <div className="space-y-1.5">
              <Label htmlFor="share-variant">Variant (optional)</Label>
              <select
                id="share-variant"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
              >
                <option value="">Default portfolio</option>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="share-expires">Expires in days (optional)</Label>
              <Input
                id="share-expires"
                type="number"
                min={1}
                max={365}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-between rounded-lg border px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Allow feedback</p>
                <p className="text-xs text-muted-foreground">Viewers can leave section comments</p>
              </div>
              <Switch checked={allowFeedback} onCheckedChange={setAllowFeedback} />
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="sm" disabled={isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create link
          </Button>
        </form>

        {isLoading ? (
          <div className="h-20 animate-pulse rounded-lg bg-muted/40" />
        ) : links.length > 0 ? (
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{link.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {link.allow_feedback ? "Feedback on" : "Feedback off"}
                      {link.expires_at ? ` · expires ${new Date(link.expires_at).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void handleCopy(link.share_url)}
                    >
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Copy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void deleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No share links yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
