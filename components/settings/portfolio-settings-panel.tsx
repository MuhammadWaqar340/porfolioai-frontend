"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  useGetPortfolioSettingsQuery,
  useUpdatePortfolioSettingsMutation,
} from "@/store/api/portfolioApi";
import { notifySuccess } from "@/lib/toast";
import { getPublicPortfolioUrl } from "@/lib/portfolio-url";

export function PortfolioSettingsPanel() {
  const { data: settings, isLoading } = useGetPortfolioSettingsQuery();
  const [updateSettings] = useUpdatePortfolioSettingsMutation();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

  const [isPublic, setIsPublic] = useState(true);
  const [seoIndexing, setSeoIndexing] = useState(true);
  const [notifyViews, setNotifyViews] = useState(true);
  const [notifyEmailUpdates, setNotifyEmailUpdates] = useState(false);
  const [contactFormEnabled, setContactFormEnabled] = useState(true);
  const [listedInGallery, setListedInGallery] = useState(false);
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(false);
  const [testimonialSubmissionsEnabled, setTestimonialSubmissionsEnabled] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setIsPublic(settings.is_public);
    setSeoIndexing(settings.seo_indexing_enabled);
    setNotifyViews(settings.notify_portfolio_views);
    setNotifyEmailUpdates(settings.notify_email_updates);
    setContactFormEnabled(settings.contact_form_enabled ?? true);
    setListedInGallery(settings.listed_in_gallery ?? false);
    setTestimonialsEnabled(settings.testimonials_enabled ?? false);
    setTestimonialSubmissionsEnabled(settings.testimonial_submissions_enabled ?? false);
  }, [settings]);

  if (isLoading || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  const publicUrl = getPublicPortfolioUrl(settings.username);

  async function handleCopy() {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      notifySuccess("Portfolio link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Could not copy link to clipboard.");
    }
  }

  async function handleSaveNotifications() {
    setNotificationError(null);
    setIsSavingNotifications(true);
    try {
      await updateSettings({
        notify_portfolio_views: notifyViews,
        notify_email_updates: notifyEmailUpdates,
      }).unwrap();
    } catch {
      setNotificationError("Could not save notification settings. Please try again.");
    } finally {
      setIsSavingNotifications(false);
    }
  }

  async function handleSavePrivacy() {
    setPrivacyError(null);
    setIsSavingPrivacy(true);
    try {
      await updateSettings({
        is_public: isPublic,
        seo_indexing_enabled: seoIndexing,
        contact_form_enabled: contactFormEnabled,
        listed_in_gallery: isPublic ? listedInGallery : false,
        testimonials_enabled: isPublic ? testimonialsEnabled : false,
        testimonial_submissions_enabled:
          isPublic && testimonialsEnabled ? testimonialSubmissionsEnabled : false,
      }).unwrap();
    } catch {
      setPrivacyError("Could not save privacy settings. Please try again.");
    } finally {
      setIsSavingPrivacy(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio URL</CardTitle>
          <CardDescription>
            Your public portfolio link for sharing with employers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1">
              <Input readOnly value={publicUrl} className="bg-muted" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full shrink-0 sm:w-auto"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          {copyError ? <FormAlert message={copyError} /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what notifications you receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Portfolio views</p>
              <p className="text-sm text-muted-foreground">
                In-app notification and email when someone views your portfolio
              </p>
            </div>
            <Switch
              checked={notifyViews}
              onCheckedChange={setNotifyViews}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Email updates</p>
              <p className="text-sm text-muted-foreground">
                Weekly health digest, inactivity reminders, and product tips
              </p>
            </div>
            <Switch
              checked={notifyEmailUpdates}
              onCheckedChange={setNotifyEmailUpdates}
              className="shrink-0"
            />
          </div>
          {notificationError ? <FormAlert message={notificationError} /> : null}
          <Button
            type="button"
            onClick={() => void handleSaveNotifications()}
            disabled={isSavingNotifications}
          >
            {isSavingNotifications ? "Saving…" : "Save notification settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Control your portfolio visibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Public portfolio</p>
              <p className="text-sm text-muted-foreground">
                Make your portfolio visible to everyone
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={(value) => {
                setIsPublic(value);
                if (!value) {
                  setListedInGallery(false);
                  setTestimonialsEnabled(false);
                  setTestimonialSubmissionsEnabled(false);
                }
              }}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Discover gallery</p>
              <p className="text-sm text-muted-foreground">
                List your portfolio on the public{" "}
                <Link href="/discover" className="text-primary hover:underline">
                  Discover
                </Link>{" "}
                page (opt-in)
              </p>
            </div>
            <Switch
              checked={listedInGallery}
              onCheckedChange={setListedInGallery}
              disabled={!isPublic}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Testimonials section</p>
              <p className="text-sm text-muted-foreground">
                Show quotes on your public portfolio. Manage them in{" "}
                <Link href="/testimonials" className="text-primary hover:underline">
                  Testimonials
                </Link>
                .
              </p>
            </div>
            <Switch
              checked={testimonialsEnabled}
              onCheckedChange={(value) => {
                setTestimonialsEnabled(value);
                if (!value) setTestimonialSubmissionsEnabled(false);
              }}
              disabled={!isPublic}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Visitor testimonial submissions</p>
              <p className="text-sm text-muted-foreground">
                Let visitors submit quotes for you to approve before publishing
              </p>
            </div>
            <Switch
              checked={testimonialSubmissionsEnabled}
              onCheckedChange={setTestimonialSubmissionsEnabled}
              disabled={!isPublic || !testimonialsEnabled}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Search engine indexing</p>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your portfolio
              </p>
            </div>
            <Switch
              checked={seoIndexing}
              onCheckedChange={setSeoIndexing}
              className="shrink-0"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-medium">Contact form</p>
              <p className="text-sm text-muted-foreground">
                Show a message form on your public portfolio
              </p>
            </div>
            <Switch
              checked={contactFormEnabled}
              onCheckedChange={setContactFormEnabled}
              className="shrink-0"
            />
          </div>
          {privacyError ? <FormAlert message={privacyError} /> : null}
          <Button
            type="button"
            onClick={() => void handleSavePrivacy()}
            disabled={isSavingPrivacy}
          >
            {isSavingPrivacy ? "Saving…" : "Save privacy settings"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
