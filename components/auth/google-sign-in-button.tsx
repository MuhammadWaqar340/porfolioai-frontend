"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { isGoogleAuthConfigured } from "@/components/providers/google-oauth-provider";

interface GoogleSignInButtonProps {
  mode: "signin" | "signup";
  onSuccess: (response: CredentialResponse) => void;
  onError?: () => void;
  disabled?: boolean;
}

export function GoogleSignInButton({
  mode,
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setWidth(element.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!isGoogleAuthConfigured()) {
    return (
      <Button variant="outline" type="button" className="w-full" disabled>
        Google sign-in is not configured
      </Button>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {disabled || width === 0 ? (
        <Button variant="outline" type="button" className="w-full" disabled>
          Continue with Google
        </Button>
      ) : (
        <div className="flex justify-center [&>div]:!w-full">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            theme="outline"
            size="large"
            width={width}
            text={mode === "signup" ? "signup_with" : "signin_with"}
            shape="rectangular"
          />
        </div>
      )}
    </div>
  );
}
