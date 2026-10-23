import SJournal from '@/components/skins/soft/SJournal'
import { getJournalData, journalMetadata } from '@/lib/routes/journal'

export const revalidate = 300
export const metadata = journalMetadata

export default async function Journal() {
  const { posts } = await getJournalData()
  return <SJournal posts={posts} />
}
