// Unix time (seconds, UTC) for the first day of a 'YYYY-MM' month.
export function monthStartEpoch(month: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) throw new Error(`Expected YYYY-MM, got "${month}"`);
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, 1) / 1000;
}

export function monthStartLabel(month: string): string {
  const date = new Date(monthStartEpoch(month) * 1000);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
