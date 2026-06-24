export interface MeetingTimezone {
  zone: string;
  utc: string;
  name: string;
}

/** Display offset using UTC wording (e.g. GMT → UTC in labels). */
export function formatMeetingTimezoneLabel(timezone: MeetingTimezone): string {
  const offset = timezone.utc.replace(/\bGMT\b/g, "UTC").trim();
  if (!offset) {
    return timezone.name;
  }
  return `${offset} ${timezone.name}`;
}

/** Include a saved zone when it is not in the catalog (legacy values). */
export function meetingTimezoneOptions(
  catalog: MeetingTimezone[],
  selectedZone?: string
): MeetingTimezone[] {
  if (!selectedZone || catalog.some((item) => item.zone === selectedZone)) {
    return catalog;
  }

  return [{ zone: selectedZone, utc: "", name: selectedZone }, ...catalog];
}

export function findMeetingTimezone(
  catalog: MeetingTimezone[],
  zone: string
): MeetingTimezone | undefined {
  return catalog.find((item) => item.zone === zone);
}

export function filterMeetingTimezones(
  catalog: MeetingTimezone[],
  query: string
): MeetingTimezone[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return catalog;
  }

  return catalog.filter((timezone) => {
    const label = formatMeetingTimezoneLabel(timezone).toLowerCase();
    return (
      label.includes(normalized) ||
      timezone.zone.toLowerCase().includes(normalized) ||
      timezone.name.toLowerCase().includes(normalized) ||
      timezone.utc.toLowerCase().includes(normalized)
    );
  });
}
