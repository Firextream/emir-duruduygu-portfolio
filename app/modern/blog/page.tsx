import OJournal from '@/components/skins/modern/OJournal'
import { getJournalData, journalMetadata } from '@/lib/routes/journal'

export const metadata = journalMetadata

export default async function Journal() {
  return <OJournal {...await getJournalData()} />
}
