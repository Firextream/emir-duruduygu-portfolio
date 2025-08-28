import { Client } from "@notionhq/client";

// Initialize Notion client with error handling
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Database ID with validation
const postDatabaseId = process.env.NOTION_POSTS_DATABASE_ID;

// Check if Notion is properly configured
const isNotionConfigured = postDatabaseId && 
  postDatabaseId !== "your_notion_database_id_here" && 
  postDatabaseId !== "your_not-ion_-data-base-_id_here" &&
  process.env.NOTION_TOKEN &&
  process.env.NOTION_TOKEN !== "your_notion_token_here";

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
      "Modern architecture is undergoing a fundamental transformation as designers and builders increasingly prioritize environmental sustainability...",
    featured: true,
    author: "Emir Duruduygu",
    authorTitle: "Architectural Photographer",
  },
  {
    id: "mock-2",
    title: "Minimalism in Modern Spaces",
    slug: "minimalism-modern-spaces",
    excerpt:
      "How less can be more in contemporary architectural design, focusing on space, light, and essential elements.",
    date: "2024-01-10",
    category: "DESIGN",
    readTime: "6 min read",
    image: "/minimalist-interior-design-copenhagen-clean-lines.png",
    content: "The philosophy of minimalism in architecture goes beyond mere aesthetics...",
    featured: false,
    author: "Emir Duruduygu",
    authorTitle: "Architectural Photographer",
  },
  {
    id: "mock-3",
    title: "Urban Planning Trends for 2024",
    slug: "urban-planning-trends-2024",
    excerpt:
      "Examining the latest trends in urban development and how cities are adapting to changing demographics and climate.",
    date: "2024-01-05",
    category: "URBAN PLANNING",
    readTime: "12 min read",
    image: "/modern-glass-building-reflection.png",
    content: "As we move through 2024, urban planning continues to evolve...",
    featured: false,
    author: "Emir Duruduygu",
    authorTitle: "Architectural Photographer",
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

export async function getPostBySlug(slug) {
  console.log("getPostBySlug called with slug:", slug);
  console.log("isNotionConfigured:", isNotionConfigured);
  
  // For static export, always use mock data to avoid build hanging
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log("Static export mode detected, using mock data");
    const foundPost = mockPosts.find((post) => post.slug === slug);
    console.log("Found post:", foundPost ? foundPost.title : "Not found");
    return foundPost || null;
  }
  
  if (!isNotionConfigured) {
    console.log("Using mock data, available slugs:", mockPosts.map(p => p.slug));
    const foundPost = mockPosts.find((post) => post.slug === slug);
    console.log("Found post:", foundPost ? foundPost.title : "Not found");
    return foundPost || null;
  }

  try {
    console.log("Querying Notion database for slug:", slug);
    
    // Since there's no Slug property, directly search by title conversion
    console.log("Searching by title-to-slug conversion...");
    
    // Get all posts and check if any title matches the slug when converted
    const allPostsResponse = await notion.databases.query({
      database_id: postDatabaseId,
    });
    
    console.log("Total posts in database:", allPostsResponse.results.length);
    
    // Find post where title converted to slug matches our target slug
    const matchingPost = allPostsResponse.results.find(page => {
      const title = page.properties.Title?.title?.[0]?.plain_text || '';
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      console.log("Checking post title:", title, "-> generated slug:", generatedSlug, "| target:", slug);
      return generatedSlug === slug;
    });
    
    if (matchingPost) {
      console.log("Found matching post by title-to-slug conversion");
      console.log("DEBUG: About to format post, page title:", matchingPost?.properties?.Title?.title?.[0]?.plain_text);
      const result = await formatPost(matchingPost);
      console.log("DEBUG: Formatted post content length:", result?.content?.length);
      console.log("DEBUG: Formatted post content preview:", result?.content?.substring(0, 100));
      return result;
    } else {
      console.log("No posts found in Notion, falling back to mock data");
      const foundPost = mockPosts.find((post) => post.slug === slug);
      return foundPost || null;
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    console.log("Falling back to mock data due to error");
    return mockPosts.find((post) => post.slug === slug) || null;
  }
}

export async function getAllPosts() {
  console.log("getAllPosts called, isNotionConfigured:", isNotionConfigured);
  
  // For static export, always use mock data to avoid build hanging
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log("Static export mode detected, using mock data");
    return mockPosts;
  }
  
  if (!isNotionConfigured) {
    console.log(
      "Using mock posts - configure NOTION_POSTS_DATABASE_ID and NOTION_TOKEN for real data"
    );
    return mockPosts;
  }

  try {
    console.log("Querying Notion database for all posts...");
    const response = await notion.databases.query({
      database_id: postDatabaseId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    console.log("Found", response.results.length, "posts in Notion database");
    const posts = await Promise.all(
      response.results.map(async (page) => {
        return await formatPost(page);
      })
    );

    const validPosts = posts.filter((post) => post !== null);
    console.log("Returning", validPosts.length, "valid posts");
    return validPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return mockPosts;
  }
}

async function formatPost(page) {
  try {
    console.log("DEBUG: About to format post, page title:", page.properties?.Title?.title?.[0]?.plain_text);
    console.log("DEBUG: Available properties:", Object.keys(page.properties || {}));
    
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
    console.log("Debug: Extracting FULL content for post:", title);
    
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
    
    console.log("DEBUG: Final content length:", content.length);
    
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
      page.properties?.Image?.files?.[0]?.file?.url || "/placeholder.svg";
    const author = 
      page.properties?.Author?.people?.[0]?.name ||
      page.properties?.Author?.rich_text?.[0]?.plain_text ||
      page.properties?.Author?.select?.name ||
      "Emir Duruduygu";
    const authorTitle = 
      page.properties?.AuthorTitle?.rich_text?.[0]?.plain_text ||
      page.properties?.AuthorTitle?.select?.name ||
      "Architectural Photographer";

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
    };
  } catch (error) {
    console.error("Error formatting post:", error);
    return null;
  }
}

export async function getGalleryImages() {
  const galleryDatabaseId = process.env.NOTION_GALLERY_DATABASE_ID;
  if (!galleryDatabaseId) {
    throw new Error("NOTION_GALLERY_DATABASE_ID is not defined in environment variables");
  }

  try {
    const response = await notion.databases.query({
      database_id: galleryDatabaseId,
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.map((page) => ({
      id: page.id,
      src: page.properties.Image?.files?.[0]?.external?.url ||
           page.properties.Image?.files?.[0]?.file?.url ||
           null,
      alt: page.properties.Alt?.rich_text?.[0]?.plain_text || 
           page.properties.Description?.rich_text?.[0]?.plain_text || "",
      aspectRatio: page.properties.AspectRatio?.rich_text?.[0]?.plain_text || "1/1",
      name: page.properties.Title?.title?.[0]?.plain_text || 
            page.properties.Name?.rich_text?.[0]?.plain_text || "Untitled",
      date: page.properties.Date?.date?.start || 
            page.properties.Created?.created_time?.split('T')[0] || 
            new Date().toISOString().split('T')[0],
      place: page.properties.Location?.rich_text?.[0]?.plain_text || 
             page.properties.Place?.rich_text?.[0]?.plain_text || "Unknown Location",
      category: page.properties.Category?.select?.name || "Photography",
      featured: page.properties.Featured?.checkbox || false,
    })).filter(image => image.src); // Only return images that have a valid src
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw new Error("Failed to fetch gallery images from Notion");
  }
}
