import { getPosts } from '@/lib/content'
import { SITE_EMAIL } from '@/lib/content/links'
import { SITE_URL } from '@/lib/routes/meta'

// Built with the site: content changes arrive as commits and a redeploy (Directus mode refreshes
// through its own fetch revalidation).
export const dynamic = 'force-static'

const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

export async function GET() {
  const posts = await getPosts()

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`
      const pubDate = post.published ? `\n      <pubDate>${new Date(`${post.published}T12:00:00Z`).toUTCString()}</pubDate>` : ''
      const categories = post.tags.map((t) => `\n      <category>${cdata(t)}</category>`).join('')
      return `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${cdata(post.excerpt)}</description>${pubDate}${categories}
      <author>${SITE_EMAIL} (Emir Duruduygu)</author>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Duruduygu — Journal</title>
    <link>${SITE_URL}</link>
    <description>Essays, video essays and notes by Emir Duruduygu.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
