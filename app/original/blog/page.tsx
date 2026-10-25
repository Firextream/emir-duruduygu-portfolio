import OrigJournal from '@/components/skins/original/OrigJournal'
import { getJournalData, journalMetadata } from '@/lib/routes/journal'

export const metadata = journalMetadata

export default async function Journal() {
  const { posts } = await getJournalData()
  return <OrigJournal posts={posts} />
}
