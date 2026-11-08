import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;

export function isVisible(entry: Pick<WorkEntry, 'data'>, production: boolean): boolean {
  return !production || !entry.data.draft;
}

export async function getPublishedWork(): Promise<WorkEntry[]> {
  const entries = await getCollection('work', (e) => isVisible(e, import.meta.env.PROD));
  return entries.sort((a, b) => a.data.order - b.data.order);
}
