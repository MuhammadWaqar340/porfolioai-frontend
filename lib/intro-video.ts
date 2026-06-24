export type IntroVideoProvider = "youtube" | "vimeo" | "loom";

export interface ParsedIntroVideo {
  provider: IntroVideoProvider;
  videoId: string;
  embedUrl: string;
  sourceUrl: string;
}

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const LOOM_ID_RE = /^[a-f0-9]{32}$/;
const VIMEO_ID_RE = /^\d+$/;

export const INTRO_VIDEO_HELP =
  "Paste a YouTube, Vimeo, or Loom share link. Record on Loom for the fastest setup.";

export function isSupportedIntroVideoUrl(url: string): boolean {
  return parseIntroVideoEmbed(url) !== null;
}

export function parseIntroVideoEmbed(url: string): ParsedIntroVideo | null {
  let raw = (url || "").trim();
  if (!raw) return null;

  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.pathname;

  if (host === "youtu.be") {
    const videoId = path.split("/").filter(Boolean)[0];
    if (videoId && YOUTUBE_ID_RE.test(videoId)) {
      return buildResult("youtube", videoId);
    }
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const videoId = parseYoutubeId(path, parsed.searchParams);
    if (videoId) return buildResult("youtube", videoId);
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const videoId = parseVimeoId(path);
    if (videoId) return buildResult("vimeo", videoId);
  }

  if (host === "loom.com") {
    const videoId = parseLoomId(path);
    if (videoId) return buildResult("loom", videoId);
  }

  return null;
}

function buildResult(provider: IntroVideoProvider, videoId: string): ParsedIntroVideo {
  if (provider === "youtube") {
    return {
      provider,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }
  if (provider === "vimeo") {
    return {
      provider,
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      sourceUrl: `https://vimeo.com/${videoId}`,
    };
  }
  return {
    provider,
    videoId,
    embedUrl: `https://www.loom.com/embed/${videoId}`,
    sourceUrl: `https://www.loom.com/share/${videoId}`,
  };
}

function parseYoutubeId(path: string, params: URLSearchParams): string | null {
  if (path.startsWith("/watch")) {
    const videoId = params.get("v");
    return videoId && YOUTUBE_ID_RE.test(videoId) ? videoId : null;
  }
  if (path.startsWith("/embed/") || path.startsWith("/shorts/")) {
    const videoId = path.split("/").filter(Boolean).pop();
    return videoId && YOUTUBE_ID_RE.test(videoId) ? videoId : null;
  }
  return null;
}

function parseVimeoId(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  const videoId = path.startsWith("/video/")
    ? segments[segments.length - 1]
    : segments[0];
  return videoId && VIMEO_ID_RE.test(videoId) ? videoId : null;
}

function parseLoomId(path: string): string | null {
  for (const prefix of ["/share/", "/embed/"]) {
    if (path.startsWith(prefix)) {
      const videoId = path.slice(prefix.length).split("/")[0];
      return videoId && LOOM_ID_RE.test(videoId) ? videoId : null;
    }
  }
  return null;
}

export function shouldShowIntroVideo(profile: {
  introVideoEnabled?: boolean;
  introVideoUrl?: string;
}): boolean {
  return Boolean(
    profile.introVideoEnabled &&
      profile.introVideoUrl?.trim() &&
      parseIntroVideoEmbed(profile.introVideoUrl)
  );
}

export function hasIntroVideoContent(introVideo: {
  introVideoUrl?: string;
  introVideoEnabled?: boolean;
  introVideoScript?: string;
}): boolean {
  return Boolean(
    introVideo.introVideoUrl?.trim() ||
      introVideo.introVideoScript?.trim() ||
      introVideo.introVideoEnabled
  );
}
