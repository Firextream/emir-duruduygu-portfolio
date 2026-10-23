import QJournal from '@/components/skins/quiet/QJournal'
import { getJournalData, journalMetadata } from '@/lib/routes/journal'

export const revalidate = 300
export const metadata = journalMetadata

export default async function Journal() {
  return <QJournal {...await getJournalData()} />
}
