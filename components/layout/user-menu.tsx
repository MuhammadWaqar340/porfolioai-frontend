"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/use-profile";
import { useLogoutMutation } from "@/store/api/portfolioApi";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/session";

export function UserMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const { profile, isLoaded } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await logoutApi().unwrap();
    } catch {
      // Clear local session even if the API call fails.
    } finally {
      signOut(dispatch);
      router.push("/login");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        render={
          <button
            type="button"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ProfileAvatar
              src={mounted && isLoaded ? profile.avatarUrl : null}
              alt={profile.fullName}
              size="sm"
            />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-64 max-w-[calc(100vw-2rem)]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="min-w-0 font-normal">
            <p
              className="truncate text-sm font-medium leading-none"
              title={profile.fullName}
            >
              {profile.fullName}
            </p>
            <p
              className="mt-1 truncate text-xs leading-none text-muted-foreground"
              title={profile.email}
            >
              {profile.email}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/profile" className="w-full cursor-pointer" />}
            nativeButton={false}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/settings" className="w-full cursor-pointer" />}
            nativeButton={false}
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
