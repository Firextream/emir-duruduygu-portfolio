import type { Metadata } from "next"

interface StructuredDataProps {
  type: "article" | "website" | "person" | "portfolio"
  data: Record<string, unknown>
}

// Generate JSON-LD structured data
export function generateStructuredData({ type, data }: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emirduruduygu.vercel.app"
  
  switch (type) {
    case "article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
          "@type": "Person",
          name: data.author || "Emir Duruduygu",
          url: siteUrl,
        },
        publisher: {
          "@type": "Person",
          name: "Emir Duruduygu",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/og-image.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
      }

    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Emir Duruduygu Portfolio",
        description: "Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye.",
        url: siteUrl,
        author: {
          "@type": "Person",
          name: "Emir Duruduygu",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }

    case "person":
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Emir Duruduygu",
        url: siteUrl,
        image: `${siteUrl}/profile-image.jpg`,
        jobTitle: "Electrical & Electronics Engineering Student",
        worksFor: {
          "@type": "Organization",
          name: "Istanbul Technical University",
        },
        sameAs: [
          "https://www.instagram.com/emir_duruduygu/",
          "https://www.linkedin.com/in/emir-duruduygu-90800a27a/",
        ],
        knowsAbout: [
          "Photography",
          "Architecture",
          "Electronics",
          "Programming",
        ],
      }

    case "portfolio":
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: data.title,
        description: data.description,
        image: data.image,
        creator: {
          "@type": "Person",
          name: "Emir Duruduygu",
        },
        dateCreated: data.date,
        genre: data.category,
      }

    default:
      return null
  }
}

// Component to inject structured data into page
export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = generateStructuredData({ type, data })
  
  if (!jsonLd) return null
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ 
  items 
}: { 
  items: { name: string; url: string }[] 
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emirduruduygu.vercel.app"
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
