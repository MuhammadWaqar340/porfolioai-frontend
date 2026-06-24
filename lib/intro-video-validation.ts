import type { FieldErrors } from "@/lib/api/form-errors";
import { isSupportedIntroVideoUrl } from "@/lib/intro-video";

export function validateIntroVideo(data: {
  introVideoUrl: string;
  introVideoEnabled: boolean;
}): FieldErrors<"introVideoUrl"> {
  const errors: FieldErrors<"introVideoUrl"> = {};
  const introVideoUrl = data.introVideoUrl.trim();

  if (introVideoUrl && !isSupportedIntroVideoUrl(introVideoUrl)) {
    errors.introVideoUrl = "Use a YouTube, Vimeo, or Loom share link.";
  }
  if (data.introVideoEnabled && !introVideoUrl) {
    errors.introVideoUrl = "Add a video URL before showing it on your portfolio.";
  }

  return errors;
}
