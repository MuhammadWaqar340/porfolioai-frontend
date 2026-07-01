"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Clock3, Eye, KanbanSquare, Loader2, Quote, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/store/api/portfolioApi";
import { useAppSelector } from "@/store/hooks";
import type { Notification } from "@/types";

function notificationIcon(type: string) {
  switch (type) {
    case "portfolio_view":
      return <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />;
    case "testimonial_submission":
      return <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />;
    case "inactivity_nudge":
      return <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />;
    case "application_follow_up":
      return <KanbanSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />;
    default:
      return <Bell className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />;
  }
}

function formatNotificationTime(time: string) {
  try {
    return formatDistanceToNow(new Date(time), { addSuffix: true });
  } catch {
    return "Recently";
  }
}

export function NotificationsMenu() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data, isLoading, isFetching } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: isAuthenticated ? 30_000 : 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const [clearAll, { isLoading: isClearing }] =
    useClearAllNotificationsMutation();

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const hasItems = items.length > 0;

  async function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      try {
        await markRead(notification.id).unwrap();
      } catch {
        // Still navigate even if marking read fails.
      }
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    try {
      await markAllRead().unwrap();
    } catch {
      // Ignore — menu stays open for retry.
    }
  }

  async function handleClearAll() {
    if (!hasItems) return;
    try {
      await clearAll().unwrap();
    } catch {
      // Ignore — menu stays open for retry.
    }
  }

  async function handleDelete(notificationId: string) {
    try {
      await deleteNotification(notificationId).unwrap();
    } catch {
      // Ignore — user can retry.
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open notifications"
        render={
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-96 overflow-x-hidden p-0"
      >
        <DropdownMenuGroup>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
              Notifications
            </DropdownMenuLabel>
            <div className="flex shrink-0 items-center gap-1">
              {unreadCount > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-7 px-2 text-xs"
                  disabled={isMarkingAllRead || isClearing}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleMarkAllRead();
                  }}
                >
                  {isMarkingAllRead ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <CheckCheck className="mr-1 h-3.5 w-3.5" />
                      Mark all read
                    </>
                  )}
                </Button>
              ) : null}
              {hasItems ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  disabled={isClearing || isMarkingAllRead}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleClearAll();
                  }}
                >
                  {isClearing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Clear all
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuGroup className="max-h-80 overflow-x-hidden overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading notifications…
            </div>
          ) : items.length === 0 ? (
            <DropdownMenuItem
              className="cursor-default p-3 text-sm text-muted-foreground"
              nativeButton={false}
            >
              No notifications yet.
            </DropdownMenuItem>
          ) : (
            items.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "max-w-full cursor-pointer items-start gap-3 overflow-hidden rounded-md p-3 pr-2",
                  !notification.read && "bg-primary/5"
                )}
                onClick={() => void handleNotificationClick(notification)}
              >
                {notificationIcon(notification.type)}
                <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "min-w-0 break-words text-sm leading-snug",
                        notification.read
                          ? "font-medium text-foreground"
                          : "font-semibold text-foreground"
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="line-clamp-4 break-all text-xs leading-relaxed text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    {formatNotificationTime(notification.time)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Delete notification: ${notification.title}`}
                  disabled={isDeleting || isClearing}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleDelete(notification.id);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        {isFetching && !isLoading ? (
          <p className="border-t px-3 py-2 text-center text-[11px] text-muted-foreground">
            Checking for new notifications…
          </p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
