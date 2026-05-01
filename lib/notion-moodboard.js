import { Client } from "@notionhq/client";

// ============================================================
//  MOODBOARD NOTION CMS
//  Database columns expected in Notion:
//    - Title        (title)        → collection name
//    - Subtitle     (rich_text)    → e.g. "RAW CONCRETE & GEOMETRY"
//    - CoverImage   (url)          → public image URL for the card cover
//    - Published    (checkbox)     → if false, skip
//
//  Items are read from the page's block children as a JSON code block:
//  Paste a JSON array as a ```json code block inside each Notion page.
//  Format:
//  [
//    { "id": "1", "type": "image", "span": "col-span-2 row-span-2",
//      "src": "https://...", "alt": "...", "tag": "SEE IMAGE" },
//    { "id": "2", "type": "color", "hex": "#C1FF00", "label": "Neon Accent" },
//    { "id": "3", "type": "quote", "text": "Less is more", "author": "Mies van der Rohe" },
//    { "id": "4", "type": "typography", "font": "Playfair Display",
//      "weights": ["Regular", "Bold", "Italic"] }
//  ]
// ============================================================

const notionToken = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
const moodboardDbId = process.env.NOTION_MOODBOARD_DATABASE_ID;

const isConfigured = Boolean(notionToken && moodboardDbId &&
  notionToken !== "your_notion_token_here" &&
  moodboardDbId !== "your_moodboard_db_id_here");

const notion = isConfigured
  ? new Client({ auth: notionToken })
  : null;

/**
 * Helper: extract plain text from Notion rich_text array
 */
function richText(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.map(s => s?.plain_text || "").join("").trim();
}

/**
 * Parse JSON items from a Notion page's block children.
 * Looks for the first ```json code block.
 */
async function fetchItemsFromPage(pageId) {
  try {
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 50,
    });

    for (const block of results) {
      if (block.type === "code") {
        const raw = block.code?.rich_text?.map(s => s?.plain_text || "").join("") || "";
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // not valid JSON, skip
        }
      }
    }
  } catch (err) {
    console.warn("[Moodboard] Could not fetch blocks for page:", pageId, err?.message);
  }
  return [];
}

/**
 * Fetch all moodboard collections from Notion.
 * Returns null if Notion is not configured (caller should use local data).
 */
export async function getMoodboardCollectionsFromNotion() {
  if (!isConfigured || !notion) return null;

  try {
    const response = await notion.databases.query({
      database_id: moodboardDbId,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    const collections = await Promise.all(
      response.results.map(async (page) => {
        const props = page.properties || {};
        const title = richText(props.Title?.title) || "Untitled";
        const subtitle = richText(props.Subtitle?.rich_text) || "";
        const coverImage =
          props.CoverImage?.url ||
          richText(props.CoverImage?.rich_text) ||
          null;

        const items = await fetchItemsFromPage(page.id);

        // Build a URL-safe id from the title
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        return {
          id,
          title,
          subtitle,
          coverImage: coverImage || "/placeholder.svg",
          items,
        };
      })
    );

    return collections.filter(c => c !== null);
  } catch (err) {
    console.error("[Moodboard] Notion fetch failed:", err?.message || err);
    return null;
  }
}

/**
 * Returns true if the Notion moodboard DB is configured.
 */
export function isMoodboardNotionConfigured() {
  return isConfigured;
}
