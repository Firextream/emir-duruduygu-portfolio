import { getAllPosts } from "@/lib/notion"

export async function GET() {
  const posts = await getAllPosts()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emirduruduygu.vercel.app"
  
  const rssItems = posts
    .filter(post => post !== null)
    .map(post => {
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${post.category}</category>` : ""}
      <author>edmesaj@outlook.com (Duruduygu)</author>
    </item>`
    })
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Duruduygu - Blog</title>
    <link>${siteUrl}</link>
    <description>Thoughts on photography, architecture, technology, and the spaces between frames.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Duruduygu - Blog</title>
      <link>${siteUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
