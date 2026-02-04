import { Client } from "@notionhq/client";
import probe from "probe-image-size";
import { getAssetPath } from "./image-utils";
import { unstable_cache } from "next/cache";

// ============================================
// CLOUDINARY CDN CONFIGURATION
// ============================================
// Cloudinary fetch mode does NOT work with Notion's signed URLs
// The URLs are too long and have too many special characters
// Using Next.js Image Optimization instead (works great on Vercel)
const CLOUDINARY_CLOUD_NAME = "djl5igrpr";
const CLOUDINARY_ENABLED = false;

// Only log in development
const isDev = process.env.NODE_ENV === "development";
if (isDev) {
  console.log("Notion Config Debug:", {
    hasToken: !!(process.env.NOTION_TOKEN || process.env.NOTION_API_KEY),
    hasPostsDB: !!(process.env.NOTION_POSTS_DATABASE_ID || process.env.NOTION_DATABASE_ID),
    hasGalleryDB: !!process.env.NOTION_GALLERY_DATABASE_ID,
    hasPortfolioDB: !!process.env.NOTION_PORTFOLIO_DATABASE_ID,
  });
}

// Initialize Notion client with error handling
// Support both NOTION_TOKEN and NOTION_API_KEY for flexibility
const notionToken = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
const notion = new Client({
  auth: notionToken,
});

// Database ID with validation - support both naming conventions
const postDatabaseId = process.env.NOTION_POSTS_DATABASE_ID || process.env.NOTION_DATABASE_ID;

// Check if Notion is properly configured
const isNotionConfigured = postDatabaseId && 
  postDatabaseId !== "your_notion_database_id_here" && 
  postDatabaseId !== "your_not-ion_-data-base-_id_here" &&
  notionToken &&
  notionToken !== "your_notion_token_here";

if (!isNotionConfigured && process.env.NODE_ENV === "development") {
  console.warn(
    "Notion CMS not configured - using mock data. Update NOTION_POSTS_DATABASE_ID in .env.local to use real data."
  );
}

// Mock data for development when Notion is not configured
const mockPosts = [
  {
    id: "mock-1",
    title: "The Future of Sustainable Architecture",
    slug: "future-sustainable-architecture",
    excerpt:
      "Exploring how modern architecture is evolving to meet environmental challenges through innovative design and materials.",
    date: "2024-01-15",
    category: "SUSTAINABILITY",
    readTime: "8 min read",
    image: "/brutalist-concrete-architecture-berlin-dramatic-li.png",
    content:
      "Modern architecture is undergoing a fundamental transformation as designers and builders increasingly prioritize environmental sustainability. This shift represents more than just a trend; it's a fundamental reimagining of how we design, construct, and inhabit our built environment.\n\nSustainable architecture encompasses a holistic approach that considers the entire lifecycle of a building, from the sourcing of materials to the structure's eventual end of life. Architects are now incorporating renewable energy systems, utilizing locally sourced and recycled materials, and designing for maximum energy efficiency.\n\nOne of the most significant developments in sustainable architecture is the integration of green technologies. Solar panels, green roofs, and advanced insulation systems are becoming standard features rather than luxury additions. These technologies not only reduce environmental impact but also create long-term economic benefits for building owners.\n\nThe concept of biophilic design has also gained prominence, emphasizing the human connection to nature within built environments. This approach not only improves air quality and reduces energy consumption but also enhances the psychological well-being of occupants.\n\nAs we move forward, the challenge for architects lies in balancing aesthetic appeal with environmental responsibility, creating spaces that are both beautiful and sustainable.",
    featured: true,
    author: "Duruduygu",
    authorTitle: "Blogger",
    authorImage: null,
  },
  {
    id: "mock-2",
    title: "Light and Shadow in Architecture",
    slug: "light-shadow-architecture",
    excerpt:
      "Exploring how architects use light and shadow as fundamental design elements to create dramatic and functional spaces.",
    date: "2024-01-10",
    category: "DESIGN",
    readTime: "6 min read",
    image: "/architectural-photography-light-shadow-modern-buil.png",
    content: "Light and shadow are among the most powerful tools in an architect's arsenal. They shape our perception of space, create mood, and can fundamentally alter how we experience a building.\n\nThe interplay between light and shadow has been a cornerstone of architectural design since ancient times. From the dramatic chiaroscuro effects in Baroque churches to the subtle gradations in Japanese tea houses, architects have long understood that light is not merely functional but deeply emotional.\n\nModern architecture has taken this understanding to new heights. Architects like Louis Kahn spoke of light as a material, something to be shaped and molded like concrete or steel. This approach has led to some of the most memorable spaces in contemporary architecture.\n\nThe technical aspects of lighting design have also evolved dramatically. Today's architects must consider not only natural light patterns throughout the day and seasons but also artificial lighting systems that can adapt and respond to changing needs.\n\nBeyond aesthetics, the strategic use of light and shadow serves practical purposes: reducing energy consumption, improving wayfinding, and creating comfortable environments for occupants.",
    featured: false,
    author: "Duruduygu",
    authorTitle: "Blogger",
    authorImage: null,
  },
  {
    id: "mock-3",
    title: "Minimalist Design Principles",
    slug: "minimalist-design-principles",
    excerpt:
      "Understanding the core principles of minimalist design and how they create powerful, serene architectural spaces.",
    date: "2024-01-05",
    category: "DESIGN",
    readTime: "12 min read",
    image: "/minimalist-interior-design-copenhagen-clean-lines.png",
    content: "Minimalism in architecture is often misunderstood as simply 'less stuff.' In reality, minimalist design is a sophisticated approach that requires careful consideration of every element within a space.\n\nThe principles of minimalist design begin with the concept of essentialism - keeping only what serves a purpose. This doesn't mean spaces should be stark or uncomfortable, but rather that every element should have intentional reason for being there.\n\nColor palettes in minimalist architecture tend toward neutrals, but this restraint allows for subtle variations and textures to take on greater significance. A single piece of natural wood grain or the texture of raw concrete becomes a focal point when surrounded by simplified elements.\n\nSpace planning in minimalist design emphasizes flow and openness. Rooms transition seamlessly into one another, and natural light is allowed to move freely throughout the structure. This creates a sense of expansiveness even in smaller spaces.\n\nStorage and organization are crucial to maintaining minimalist principles. Built-in solutions and hidden storage ensure that the visual simplicity of the space is preserved while maintaining functionality.\n\nThe psychological benefits of minimalist design are well-documented. Simplified environments can reduce stress, improve focus, and create a sense of calm that enhances daily life.",
    featured: false,
    author: "Duruduygu",
    authorTitle: "Blogger",
    authorImage: null,
  },
  {
    id: "mock-4",
    title: "Urban Planning Trends for 2024",
    slug: "urban-planning-trends-2024",
    excerpt:
      "Examining the latest trends in urban development and how cities are adapting to changing demographics and climate challenges.",
    date: "2024-01-05",
    category: "URBAN PLANNING",
    readTime: "12 min read",
    image: "/modern-glass-building-reflection.png",
    content: "As we move through 2024, urban planning continues to evolve in response to unprecedented global challenges. Climate change, population growth, and technological advancement are reshaping how we think about city development.\n\nOne of the most significant trends is the move toward 15-minute cities - urban environments where residents can access most of their daily needs within a 15-minute walk or bike ride. This concept reduces reliance on cars and creates more vibrant, connected communities.\n\nGreen infrastructure is becoming central to urban planning strategies. Cities are incorporating more parks, green corridors, and sustainable stormwater management systems. These elements not only address environmental concerns but also improve quality of life for residents.\n\nMixed-use development continues to gain popularity, combining residential, commercial, and office spaces in single projects. This approach creates more dynamic neighborhoods and reduces the need for long commutes.\n\nTechnology integration is another key trend, with smart city initiatives becoming more sophisticated. From traffic management systems to energy-efficient building controls, technology is helping cities become more responsive to their residents' needs.\n\nThe post-pandemic world has also influenced urban planning, with greater emphasis on outdoor spaces, flexible work environments, and resilient infrastructure that can adapt to unexpected challenges.",
    featured: false,
    author: "Duruduygu",
    authorTitle: "Blogger",
    authorImage: null,
  },
];

export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not defined in environment variables");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results.map((page) => ({
    id: page.id,
    title: page.properties.Title?.title?.[0]?.plain_text || "",
    slug: page.properties.Slug?.rich_text?.[0]?.plain_text || "",
    date: page.properties.Date?.date?.start || null,
    excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || "",
    readTime: page.properties.ReadTime?.rich_text?.[0]?.plain_text || (() => {
      // Calculate read time from content if not set
      const content = page.properties.Content?.rich_text?.[0]?.plain_text || 
                     page.properties.Excerpt?.rich_text?.[0]?.plain_text || "";
      const wordCount = content ? content.split(/\s+/).filter(word => word.length > 0).length : 0;
      const minutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      return `${minutes} min read`;
    })(),
    content: page.properties.Content?.rich_text?.[0]?.plain_text || "",
    category: page.properties.Category?.select?.name || "Uncategorized",
    author:
      page.properties.Author?.people?.[0]?.name ||
      page.properties.Author?.rich_text?.[0]?.plain_text ||
      page.properties.Author?.select?.name ||
      "Anonymous",
    authorTitle: page.properties.AuthorTitle?.select?.name || "Content Creator",
    image:
      page.properties.Image?.files?.[0]?.external?.url ||
      page.properties.Image?.files?.[0]?.file?.url ||
      null,
    featured: page.properties.Featured?.checkbox || false,
  }));
}

// Internal function to fetch post by slug
async function _getPostBySlug(slug) {
  if (isDev) console.log("getPostBySlug called with slug:", slug);
  
  if (!isNotionConfigured) {
    const foundPost = mockPosts.find((post) => post.slug === slug);
    return foundPost || null;
  }

  try {
    // Get all posts and check if any title matches the slug when converted
    const allPostsResponse = await notion.databases.query({
      database_id: postDatabaseId,
    });
    
    // Find post where title converted to slug matches our target slug
    const matchingPost = allPostsResponse.results.find(page => {
      const title = page.properties.Title?.title?.[0]?.plain_text || '';
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return generatedSlug === slug;
    });
    
    if (matchingPost) {
      const result = await formatPost(matchingPost);
      return result;
    } else {
      const foundPost = mockPosts.find((post) => post.slug === slug);
      return foundPost || null;
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return mockPosts.find((post) => post.slug === slug) || null;
  }
}

// Cached version of getPostBySlug - cache for 5 minutes
export const getPostBySlug = unstable_cache(
  _getPostBySlug,
  ['post-by-slug'],
  { revalidate: 300, tags: ['posts'] }
);

// Internal function to fetch all posts
async function _getAllPosts() {
  if (isDev) console.log("getAllPosts called");
  
  if (!isNotionConfigured) {
    return mockPosts;
  }

  try {
    const response = await notion.databases.query({
      database_id: postDatabaseId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page) => {
        return await formatPost(page);
      })
    );

    const validPosts = posts.filter((post) => post !== null);
    return validPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return mockPosts;
  }
}

// Cached version of getAllPosts - cache for 5 minutes
export const getAllPosts = unstable_cache(
  _getAllPosts,
  ['all-posts'],
  { revalidate: 300, tags: ['posts'] }
);

async function formatPost(page) {
  try {
    if (isDev) console.log("DEBUG: About to format post, page title:", page.properties?.Title?.title?.[0]?.plain_text);
    if (isDev) console.log("DEBUG: Available properties:", Object.keys(page.properties || {}));
    
    const title = page.properties?.Title?.title?.[0]?.plain_text || "Untitled";
    
    // Get slug from Notion or generate from title, then clean it for URLs
    let rawSlug = page.properties?.Slug?.rich_text?.[0]?.plain_text || title;
    const slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
    
    // FIXED: Prioritize full content over excerpt for the main content field
    // Try different field names for content - get the FULL content, not excerpt
    let content = "";
    
    // First try to get full content from Content field (try both with and without trailing space)
    const contentProperty = page.properties?.Content || page.properties?.['Content '];
    
    if (contentProperty) {
      if (contentProperty.text && typeof contentProperty.text === 'string') {
        content = contentProperty.text.trim();
      } else if (contentProperty.rich_text && Array.isArray(contentProperty.rich_text)) {
        content = contentProperty.rich_text
          .map(segment => segment.plain_text || '')
          .join('')
          .trim();
      }
    }
    
    // If no content found, try other content fields (but not excerpt!)
    if (!content || content.length < 10) {
      const alternativeContentSources = [
        page.properties?.Body,
        page.properties?.Description,
        page.properties?.Text,
      ];
      
      for (const source of alternativeContentSources) {
        if (!content && source) {
          if (source.text && typeof source.text === 'string') {
            content = source.text.trim();
            break;
          } else if (source.rich_text && Array.isArray(source.rich_text)) {
            content = source.rich_text
              .map(segment => segment.plain_text || '')
              .join('')
              .trim();
            if (content.length > 5) break;
          }
        }
      }
    }
    
    // Extract excerpt SEPARATELY - never use it as main content
    const excerpt = 
      page.properties?.Excerpt?.text ||
      page.properties?.excerpt?.text ||
      page.properties?.Excerpt?.rich_text?.[0]?.plain_text ||
      page.properties?.excerpt?.rich_text?.[0]?.plain_text ||
      // If no excerpt, create one from content (first 200 chars)
      (content ? content.substring(0, 200) + "..." : "");
    
    // Only use fallback content if absolutely no content found
    if (!content || content.length < 5) {
      content = `This is a placeholder for the full blog post content. 

The actual content should be added to the Content field in your Notion database.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

To fix this:
1. Open your Notion database
2. Add a "Content" field (Text type)
3. Fill it with your full blog post content
4. Make sure the field is shared with your integration`;
    }
    
    const date =
      page.properties?.Date?.date?.start ||
      new Date().toISOString().split("T")[0];
    const category = page.properties?.Category?.select?.name || "Uncategorized";
    const featured = page.properties?.Featured?.checkbox || false;
    const image =
      page.properties?.Image?.files?.[0]?.external?.url ||
      page.properties?.Image?.files?.[0]?.file?.url ||
      "/placeholder.svg";
    const author = 
      page.properties?.Author?.people?.[0]?.name ||
      page.properties?.Author?.rich_text?.[0]?.plain_text ||
      page.properties?.Author?.select?.name ||
      "Duruduygu";
    const authorTitle = 
      page.properties?.AuthorTitle?.rich_text?.[0]?.plain_text ||
      page.properties?.AuthorTitle?.select?.name ||
      "Blogger";
    
    // Get author image from Notion People field or AuthorImage field
    const authorImage = 
      page.properties?.Author?.people?.[0]?.avatar_url ||
      page.properties?.AuthorImage?.files?.[0]?.external?.url ||
      page.properties?.AuthorImage?.files?.[0]?.file?.url ||
      null;

    // Get read time from Notion or calculate from content
    let readTime = page.properties?.ReadTime?.rich_text?.[0]?.plain_text;
    if (!readTime) {
      const wordCount = content ? content.split(/\s+/).filter(word => word.length > 0).length : 0;
      const minutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      readTime = `${minutes} min read`;
    }

    return {
      id: page.id,
      title,
      slug,
      excerpt, // This should be the SHORT excerpt
      date,
      category,
      readTime,
      image,
      featured,
      content, // This should be the FULL content
      author,
      authorTitle,
      authorImage,
    };
  } catch (error) {
    console.error("Error formatting post:", error);
    return null;
  }
}

// Gallery Database ID
const galleryDatabaseId = process.env.NOTION_GALLERY_DATABASE_ID;

// Check if Gallery is configured
const isGalleryConfigured = galleryDatabaseId && 
  galleryDatabaseId !== "your_gallery_database_id_here" &&
  notionToken &&
  notionToken !== "your_notion_token_here";

// Mock gallery data for fallback
const mockGalleryImages = [
  {
    id: "mock-gallery-1",
    src: "/modernist-concrete-building-with-geometric-shadows.png",
    alt: "Geometric Shadows",
    aspectRatio: "4/3",
    name: "Geometric Shadows",
    date: "March 2024",
    place: "Berlin",
    category: "Architecture",
    featured: true,
    description: "A study of geometric shadows cast by modernist concrete architecture in Berlin.",
  },
  {
    id: "mock-gallery-2",
    src: "/brutalist-tower-with-dramatic-sky.png",
    alt: "Urban Monolith",
    aspectRatio: "3/4",
    name: "Urban Monolith",
    date: "February 2024",
    place: "London",
    category: "Brutalist",
    description: "A dramatic brutalist tower set against the moody London sky.",
  },
  {
    id: "mock-gallery-3",
    src: "/minimalist-interior-with-natural-light.png",
    alt: "Light Studies",
    aspectRatio: "16/9",
    name: "Light Studies",
    date: "January 2024",
    place: "Copenhagen",
    category: "Interior",
    description: "Minimalist interior design showcasing the interplay of natural light and space.",
  },
  {
    id: "mock-gallery-4",
    src: "/abstract-architectural-detail-with-patterns.png",
    alt: "Pattern Language",
    aspectRatio: "1/1",
    name: "Pattern Language",
    date: "December 2023",
    place: "Tokyo",
    category: "Details",
    description: "Abstract architectural details revealing the hidden patterns of urban structures.",
  },
  {
    id: "mock-gallery-5",
    src: "/architectural-photography-light-shadow-modern-buil.png",
    alt: "Light & Shadow",
    aspectRatio: "4/3",
    name: "Light & Shadow",
    date: "November 2023",
    place: "Barcelona",
    category: "Modern",
    description: "The eternal dance of light and shadow on modern building facades.",
  },
  {
    id: "mock-gallery-6",
    src: "/brutalist-concrete-architecture-berlin-dramatic-li.png",
    alt: "Concrete Dreams",
    aspectRatio: "3/4",
    name: "Concrete Dreams",
    date: "October 2023",
    place: "Berlin",
    category: "Brutalist",
    featured: true,
    description: "Raw concrete forms creating dramatic compositions in Berlin's brutalist architecture.",
  },
];

// Internal function to fetch gallery images
async function _getGalleryImages() {
  if (isDev) console.log("getGalleryImages called");
  
  if (!isGalleryConfigured) {
    return mockGalleryImages;
  }

  try {
    const response = await notion.databases.query({
      database_id: galleryDatabaseId,
    });

    if (response.results.length === 0) {
      return mockGalleryImages;
    }

    const images = await Promise.all(response.results.map(async (page) => {
      // Try multiple property name variations
      const name = page.properties.Name?.title?.[0]?.plain_text ||
                   page.properties.Title?.title?.[0]?.plain_text ||
                   "Untitled";
      
      // Main original source (legacy Image/Cover properties)
      const originalSrc = page.properties.Image?.files?.[0]?.external?.url ||
                  page.properties.Image?.files?.[0]?.file?.url ||
                  page.properties.Cover?.files?.[0]?.external?.url ||
                  page.properties.Cover?.files?.[0]?.file?.url ||
                  null;

      // Optional helper properties: allow editors to upload smaller / variant files
      // directly in Notion using properties named 'Thumbnail', 'Lightbox', or 'Original'.
      // These are optional — if present we'll prefer them (but still proxy/optimize).
      const thumbProp = page.properties.Thumbnail?.files?.[0]?.external?.url ||
                        page.properties.Thumbnail?.files?.[0]?.file?.url ||
                        null;
      const lightboxProp = page.properties.Lightbox?.files?.[0]?.external?.url ||
                           page.properties.Lightbox?.files?.[0]?.file?.url ||
                           null;
      const originalProp = page.properties.Original?.files?.[0]?.external?.url ||
                           page.properties.Original?.files?.[0]?.file?.url ||
                           null;
      
      const place = page.properties.Place?.rich_text?.[0]?.plain_text ||
                    page.properties.Location?.rich_text?.[0]?.plain_text ||
                    page.properties.Place?.select?.name ||
                    "Unknown";

      // Probe original image dimensions (width/height) on the server so we can
      // return them to the client and reserve correct layout space to prevent
      // layout shifts. Don't fail the whole mapping if probe fails.
      let width = null
      let height = null
      if (originalSrc) {
        try {
          const result = await probe(originalSrc)
          width = result.width || null
          height = result.height || null
        } catch (e) {
          if (isDev) console.warn("Image probe failed:", originalSrc, e.message)

          // Fallback: try probing the proxied optimized URL (bigger width)
          try {
            const prox = getOptimizedUrl(originalSrc, 1600, 85)
            const r2 = await probe(prox)
            // prox returns scaled sizes but preserves aspect ratio
            width = r2.width || width
            height = r2.height || height
          } catch (e2) {
            if (isDev) console.warn("Proxy probe also failed:", prox, e2.message)
          }
        }
      }
      
      const category = page.properties.Category?.select?.name ||
                       page.properties.Type?.select?.name ||
                       "Photography";
      
      const featured = page.properties.Featured?.checkbox || false;

      // EXIF Data
      const exif = {
        camera: page.properties.Camera?.rich_text?.[0]?.plain_text || null,
        lens: page.properties.Lens?.rich_text?.[0]?.plain_text || null,
        aperture: page.properties.Aperture?.rich_text?.[0]?.plain_text || null,
        shutterSpeed: page.properties.ShutterSpeed?.rich_text?.[0]?.plain_text || null,
        iso: page.properties.ISO?.rich_text?.[0]?.plain_text || null,
        focalLength: page.properties.FocalLength?.rich_text?.[0]?.plain_text || null,
      };
      
      // Only include exif if at least one field exists
      const hasExif = Object.values(exif).some(v => v !== null);

      // Use wsrv.nl as image proxy for optimization
      // Aggressive optimization for fast loading like teocrawford.com
      const getOptimizedUrl = (url, width = 250, quality = 50) => {
        if (!url) return null;
        // wsrv.nl - width only, auto height, aggressive compression
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp&af`;
      };

      // Stronger blur placeholder (30px width - clearer, less artifacting)
      const blurUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalSrc)}&w=30&blur=15&q=50&output=webp`;

      // Prefer explicit variant fields if editors upload lower-quality files for
      // thumbnails/lightbox. Fallback to optimized versions of the main original.
      const baseOriginal = originalProp || originalSrc;
      const thumbSource = thumbProp || baseOriginal;
      const lightboxSource = lightboxProp || baseOriginal;

      const thumb1x = getOptimizedUrl(thumbSource, 480, 90)
      const thumb2x = getOptimizedUrl(thumbSource, 960, 90)

      return {
        id: page.id,
        src: thumb1x, // Thumbnail - higher quality for better appearance (~30-70KB)
        srcSet: `${thumb1x} 1x, ${thumb2x} 2x`, // Serve 2x for retina
        srcFull: getOptimizedUrl(lightboxSource, 1800, 90), // Lightbox - high quality
        srcOriginal: baseOriginal || lightboxSource || thumbSource || originalSrc, // Keep original if available
        blurDataUrl: blurUrl, // For blur-up effect
        width,
        height,
        alt: name,
        name,
        place,
        category,
        featured,
        exif: hasExif ? exif : null,
      };
    }));

    // Only return images with valid src
    const imagesFiltered = images.filter(image => image.src);

    return imagesFiltered.length > 0 ? imagesFiltered : mockGalleryImages;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return mockGalleryImages;
  }
}

// Cached version of getGalleryImages - cache for 5 minutes
export const getGalleryImages = unstable_cache(
  _getGalleryImages,
  ['gallery-images'],
  { revalidate: 300, tags: ['gallery'] }
);

// ============================================
// PORTFOLIO DATABASE (Separate from Gallery)
// ============================================

const portfolioDatabaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;

const isPortfolioConfigured = portfolioDatabaseId && 
  portfolioDatabaseId !== "your_portfolio_database_id_here" &&
  notionToken &&
  notionToken !== "your_notion_token_here";

// Mock portfolio data for fallback
const mockPortfolioItems = [
  {
    id: "mock-portfolio-1",
    src: "/modernist-concrete-building-with-geometric-shadows.png",
    alt: "Geometric Shadows",
    name: "Geometric Shadows",
    date: "2024",
    place: "Berlin",
    category: "Architecture",
    description: "A study of light and shadow on modernist concrete structures.",
  },
  {
    id: "mock-portfolio-2",
    src: "/brutalist-tower-with-dramatic-sky.png",
    alt: "Urban Monolith",
    name: "Urban Monolith", 
    date: "2024",
    place: "London",
    category: "Brutalist",
    description: "Capturing the raw power of brutalist architecture against dramatic skies.",
  },
  {
    id: "mock-portfolio-3",
    src: "/minimalist-interior-with-natural-light.png",
    alt: "Light Studies",
    name: "Light Studies",
    date: "2024", 
    place: "Copenhagen",
    category: "Interior",
    description: "Natural light flowing through minimalist Scandinavian interiors.",
  },
  {
    id: "mock-portfolio-4",
    src: "/abstract-architectural-detail-with-patterns.png",
    alt: "Pattern Language",
    name: "Pattern Language",
    date: "2024",
    place: "Tokyo", 
    category: "Details",
    description: "Abstract patterns found in contemporary Japanese architecture.",
  },
  {
    id: "mock-portfolio-5",
    src: "/architectural-photography-light-shadow-modern-buil.png",
    alt: "Light & Shadow",
    name: "Light & Shadow",
    date: "2024",
    place: "Barcelona",
    category: "Modern",
    description: "The interplay of Mediterranean light on modern facades.",
  },
  {
    id: "mock-portfolio-6",
    src: "/brutalist-concrete-architecture-berlin-dramatic-li.png",
    alt: "Concrete Dreams",
    name: "Concrete Dreams",
    date: "2024",
    place: "Berlin",
    category: "Brutalist",
    description: "The beauty of raw concrete in post-war German architecture.",
  },
];

// Internal function to fetch portfolio items
async function _getPortfolioItems() {
  if (isDev) console.log("getPortfolioItems called");
  
  if (!isPortfolioConfigured) {
    return mockPortfolioItems;
  }

  try {
    const response = await notion.databases.query({
      database_id: portfolioDatabaseId,
      sorts: [{ property: "Date", direction: "descending" }],
    });

    if (response.results.length === 0) {
      return mockPortfolioItems;
    }

    const items = response.results.map((page) => {
      const name = page.properties.Name?.title?.[0]?.plain_text ||
                   page.properties.Title?.title?.[0]?.plain_text ||
                   "Untitled";
      
      // Handle Images property (plural, as in your database)
      const src = page.properties.Images?.files?.[0]?.external?.url ||
                  page.properties.Images?.files?.[0]?.file?.url ||
                  page.properties.Image?.files?.[0]?.external?.url ||
                  page.properties.Image?.files?.[0]?.file?.url ||
                  page.properties.Cover?.files?.[0]?.external?.url ||
                  page.properties.Cover?.files?.[0]?.file?.url ||
                  null;
      
      const place = page.properties.Place?.rich_text?.[0]?.plain_text ||
                    page.properties.Location?.rich_text?.[0]?.plain_text ||
                    page.properties.Place?.select?.name ||
                    "Unknown";
      
      const date = page.properties.Date?.date?.start?.split('-')[0] ||
                   new Date().getFullYear().toString();
      
      // Handle lowercase category (as in your database)
      const category = page.properties.category?.select?.name ||
                       page.properties.Category?.select?.name ||
                       page.properties.Type?.select?.name ||
                       "Photography";
      
      // Handle typo "Descripton" in your database
      const description = page.properties.Descripton?.rich_text?.[0]?.plain_text ||
                          page.properties.Description?.rich_text?.[0]?.plain_text ||
                          page.properties.Summary?.rich_text?.[0]?.plain_text ||
                          "";

      return {
        id: page.id,
        src,
        alt: name,
        name,
        date,
        place,
        category,
        description,
      };
    }).filter(item => item.src);

    return items.length > 0 ? items : mockPortfolioItems;
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return mockPortfolioItems;
  }
}

// Cached version of getPortfolioItems - cache for 5 minutes
export const getPortfolioItems = unstable_cache(
  _getPortfolioItems,
  ['portfolio-items'],
  { revalidate: 300, tags: ['portfolio'] }
);
