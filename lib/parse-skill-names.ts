export function parseSkillNames(input: string): string[] {
  const names = input
    .split(/[\n,;]+/)
    .map((name) => name.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const unique: string[] = [];

  for (const name of names) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(name);
    }
  }

  return unique;
}
