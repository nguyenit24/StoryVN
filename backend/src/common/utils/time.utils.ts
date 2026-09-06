export function parseDurationToMs(
  duration: string | number | undefined,
  defaultMs: number,
): number {
  if (typeof duration === 'number') return duration * 1000;
  if (!duration) return defaultMs;

  const match = String(duration).match(/^(\d+)([smhd])$/);
  if (!match) return defaultMs;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] ?? 1000);
}
