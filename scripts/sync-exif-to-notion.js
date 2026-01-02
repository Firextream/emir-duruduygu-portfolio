/**
 * EXIF to Notion Sync Script
 * 
 * Bu script, bir klasördeki fotoğraflardan EXIF verilerini okur ve
 * Notion Gallery veritabanına yazar.
 * 
 * Kullanım:
 * 1. Notion Gallery veritabanına şu property'leri ekle (Text tipinde):
 *    - Camera
 *    - Lens  
 *    - Aperture
 *    - ShutterSpeed
 *    - ISO
 *    - FocalLength
 * 
 * 2. Script'i çalıştır:
 *    node scripts/sync-exif-to-notion.js "C:\path\to\photos"
 */

const fs = require('fs');
const path = require('path');
const ExifParser = require('exif-parser');
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY,
});

const galleryDatabaseId = process.env.NOTION_GALLERY_DATABASE_ID;

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.tiff', '.tif'];

/**
 * Read EXIF data from an image file
 */
function readExif(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    
    const tags = result.tags || {};
    
    return {
      camera: tags.Make && tags.Model 
        ? `${tags.Make} ${tags.Model}`.trim()
        : tags.Model || tags.Make || null,
      lens: tags.LensModel || tags.LensInfo || null,
      aperture: tags.FNumber ? `f/${tags.FNumber}` : null,
      shutterSpeed: tags.ExposureTime 
        ? (tags.ExposureTime < 1 
            ? `1/${Math.round(1/tags.ExposureTime)}s` 
            : `${tags.ExposureTime}s`)
        : null,
      iso: tags.ISO ? `${tags.ISO}` : null,
      focalLength: tags.FocalLength ? `${tags.FocalLength}mm` : null,
      dateTime: tags.DateTimeOriginal 
        ? new Date(tags.DateTimeOriginal * 1000).toISOString()
        : null,
      // Additional useful data
      width: result.imageSize?.width || null,
      height: result.imageSize?.height || null,
    };
  } catch (error) {
    console.error(`  ⚠️  Error reading EXIF from ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

/**
 * Get all images from Notion Gallery database
 */
async function getNotionGalleryItems() {
  const items = [];
  let cursor;
  
  do {
    const response = await notion.databases.query({
      database_id: galleryDatabaseId,
      start_cursor: cursor,
    });
    
    items.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);
  
  return items;
}

/**
 * Update Notion page with EXIF data
 */
async function updateNotionWithExif(pageId, exifData, pageName) {
  const properties = {};
  
  if (exifData.camera) {
    properties['Camera'] = { rich_text: [{ text: { content: exifData.camera } }] };
  }
  if (exifData.lens) {
    properties['Lens'] = { rich_text: [{ text: { content: exifData.lens } }] };
  }
  if (exifData.aperture) {
    properties['Aperture'] = { rich_text: [{ text: { content: exifData.aperture } }] };
  }
  if (exifData.shutterSpeed) {
    properties['ShutterSpeed'] = { rich_text: [{ text: { content: exifData.shutterSpeed } }] };
  }
  if (exifData.iso) {
    properties['ISO'] = { rich_text: [{ text: { content: exifData.iso } }] };
  }
  if (exifData.focalLength) {
    properties['FocalLength'] = { rich_text: [{ text: { content: exifData.focalLength } }] };
  }
  
  if (Object.keys(properties).length === 0) {
    console.log(`  ⚠️  No EXIF data to update for "${pageName}"`);
    return false;
  }
  
  try {
    await notion.pages.update({
      page_id: pageId,
      properties,
    });
    console.log(`  ✅ Updated "${pageName}" with EXIF data`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error updating "${pageName}":`, error.message);
    return false;
  }
}

/**
 * Normalize filename for matching
 */
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[_\-\s]+/g, ' ') // Normalize separators
    .trim();
}

/**
 * Main function
 */
async function main() {
  const photosDir = process.argv[2];
  
  console.log('\n🖼️  EXIF to Notion Sync Script\n');
  console.log('================================\n');
  
  // Validate inputs
  if (!photosDir) {
    console.log('❌ Usage: node scripts/sync-exif-to-notion.js <photos-directory>\n');
    console.log('Example: node scripts/sync-exif-to-notion.js "C:\\Users\\emir\\Pictures\\Gallery"\n');
    process.exit(1);
  }
  
  if (!galleryDatabaseId) {
    console.log('❌ NOTION_GALLERY_DATABASE_ID not found in .env.local\n');
    process.exit(1);
  }
  
  if (!fs.existsSync(photosDir)) {
    console.log(`❌ Directory not found: ${photosDir}\n`);
    process.exit(1);
  }
  
  // Get local photos
  console.log(`📁 Scanning photos in: ${photosDir}\n`);
  
  const files = fs.readdirSync(photosDir)
    .filter(f => SUPPORTED_FORMATS.includes(path.extname(f).toLowerCase()));
  
  console.log(`   Found ${files.length} image files\n`);
  
  if (files.length === 0) {
    console.log('⚠️  No supported images found (JPG, JPEG, TIFF)\n');
    process.exit(0);
  }
  
  // Read EXIF from all photos
  console.log('📖 Reading EXIF data...\n');
  
  const localPhotos = new Map();
  for (const file of files) {
    const filePath = path.join(photosDir, file);
    const exif = readExif(filePath);
    
    if (exif) {
      const normalizedName = normalizeFilename(file);
      // Only add if name has meaningful content (at least 3 chars after normalization)
      if (normalizedName.length >= 3) {
        localPhotos.set(normalizedName, {
          filename: file,
          exif,
        });
      }
    }
  }
  
  console.log(`   Read EXIF from ${localPhotos.size} photos\n`);
  
  // Get Notion gallery items
  console.log('📡 Fetching Notion Gallery items...\n');
  
  const notionItems = await getNotionGalleryItems();
  console.log(`   Found ${notionItems.length} items in Notion\n`);
  
  // Match and update
  console.log('🔄 Matching and updating...\n');
  
  let updated = 0;
  let notMatched = [];
  
  for (const page of notionItems) {
    const name = page.properties.Name?.title?.[0]?.plain_text ||
                 page.properties.Title?.title?.[0]?.plain_text ||
                 '';
    
    const normalizedName = normalizeFilename(name);
    
    // Try to find matching local photo
    let match = localPhotos.get(normalizedName);
    let matchedFile = normalizedName;
    
    // Try partial matching if exact match not found (stricter: min 5 char match)
    if (!match && normalizedName.length >= 5) {
      for (const [key, value] of localPhotos) {
        // Both must be at least 5 chars for partial match
        if (key.length >= 5 && normalizedName.length >= 5) {
          // Check if one contains the other with significant overlap
          if (key.includes(normalizedName) || normalizedName.includes(key)) {
            match = value;
            matchedFile = key;
            break;
          }
        }
      }
    }
    
    if (match) {
      console.log(`   Matching: "${name}" <-> "${match.filename}"`);
      const success = await updateNotionWithExif(page.id, match.exif, name);
      if (success) updated++;
    } else {
      notMatched.push(name);
    }
  }
  
  // Summary
  console.log('\n================================');
  console.log('📊 Summary:\n');
  console.log(`   ✅ Updated: ${updated} items`);
  console.log(`   ⚠️  Not matched: ${notMatched.length} items\n`);
  
  if (notMatched.length > 0 && notMatched.length <= 10) {
    console.log('   Not matched items:');
    notMatched.forEach(name => console.log(`      - ${name}`));
    console.log('');
  }
  
  console.log('💡 Tip: Make sure photo filenames match Notion entry names.\n');
  console.log('   Example: If Notion has "Sunset Istanbul", file should be');
  console.log('   "Sunset Istanbul.jpg" or "sunset_istanbul.jpg"\n');
}

main().catch(console.error);
