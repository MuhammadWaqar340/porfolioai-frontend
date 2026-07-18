"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PortfolioGalleryCard } from "@/components/discover/portfolio-gallery-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetDiscoverPortfoliosQuery } from "@/store/api/portfolioApi";

export function DiscoverGallery() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError } = useGetDiscoverPortfoliosQuery({
    page,
    limit: 24,
    q: query || undefined,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, title, or username…"
            className="border-border/60 bg-background/70 pl-9 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/55"
            aria-label="Search portfolios"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-10 text-center text-sm text-muted-foreground backdrop-blur-md">
          Could not load portfolios. Please try again later.
        </div>
      ) : !data?.items.length ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-10 text-center backdrop-blur-md">
          <p className="font-medium">No portfolios in the gallery yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {query
              ? "Try a different search term."
              : "Creators can opt in from Settings → Privacy once their portfolio is public."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data.total} portfolio{data.total === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : ""}
            {isFetching ? " · Updating…" : ""}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <PortfolioGalleryCard key={item.username} item={item} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <span className="text-sm tabular-nums text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
