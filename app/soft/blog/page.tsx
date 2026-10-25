import SJournal from '@/components/skins/soft/SJournal'
import { getJournalData, journalMetadata } from '@/lib/routes/journal'

export const metadata = journalMetadata

export default async function Journal() {
  const { posts } = await getJournalData()
  return <SJournal posts={posts} />
}
