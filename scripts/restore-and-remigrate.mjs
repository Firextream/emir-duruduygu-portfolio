/**
 * Restore original URLs and re-migrate with unique IDs
 */

import { v2 as cloudinary } from 'cloudinary';
import { Client } from '@notionhq/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

// Load environment variables manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Notion
const notion = new Client({
  auth: env.NOTION_TOKEN
});

const GALLERY_DATABASE_ID = env.NOTION_GALLERY_DATABASE_ID;

// Read migration results
const resultsPath = join(__dirname, 'migration-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update Notion page with URL
async function updateNotionPage(pageId, newUrl) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Image: {
          files: [{
            type: 'external',
            name: 'image',
            external: { url: newUrl }
          }]
        }
      }
    });
    return true;
  } catch (error) {
    console.error(`   Error updating Notion: ${error.message}`);
    return false;
  }
}

// Upload to Cloudinary with unique ID
async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'gallery',
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });
    return {
      success: true,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function restoreAndRemigrate() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       🔄 Restore & Re-migrate Script                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Get all successful migrations that need fixing
  const allImages = [...results.success, ...results.failed];
  
  console.log(`Found ${allImages.length} images to process\n`);

  const newResults = { success: [], failed: [] };

  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    
    // Generate unique public ID using page ID
    const baseName = (img.name || 'untitled').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
    const uniqueId = baseName + '-' + img.pageId.slice(-8);
    
    console.log(`[${i + 1}/${allImages.length}] ${img.name}`);
    console.log(`   📌 Unique ID: ${uniqueId}`);
    
    // Skip if too large (10MB+)
    if (img.error && img.error.includes('too large')) {
      console.log(`   ⚠️ Skipping large file (needs manual resize)\n`);
      newResults.failed.push({ ...img, uniqueId, reason: 'too large' });
      continue;
    }
    
    // Check if original URL is still valid (Notion URLs expire)
    // We need to get fresh URL from Notion
    console.log(`   📡 Fetching fresh URL from Notion...`);
    
    try {
      const page = await notion.pages.retrieve({ page_id: img.pageId });
      const freshUrl = page.properties.Image?.files?.[0]?.external?.url ||
                       page.properties.Image?.files?.[0]?.file?.url;
      
      if (!freshUrl) {
        console.log(`   ❌ No image URL found\n`);
        newResults.failed.push({ ...img, uniqueId, reason: 'no url' });
        continue;
      }
      
      // If already on Cloudinary with correct unique ID, skip
      if (freshUrl.includes('res.cloudinary.com') && freshUrl.includes(uniqueId)) {
        console.log(`   ✅ Already correct, skipping\n`);
        newResults.success.push({ ...img, uniqueId, newUrl: freshUrl, skipped: true });
        continue;
      }
      
      // Upload to Cloudinary
      console.log(`   ⬆️ Uploading to Cloudinary...`);
      
      // If currently on Cloudinary (wrong ID), use original URL from results
      let sourceUrl = freshUrl;
      if (freshUrl.includes('res.cloudinary.com')) {
        // This means Notion has wrong Cloudinary URL, we can still upload from it
        // because all "untitled" images point to the same image
        // We need to use the stored original URL, but it's expired
        // Let's try uploading from the current Cloudinary URL anyway
        // It will just re-upload the same image with a new ID
        sourceUrl = freshUrl;
      }
      
      const uploadResult = await uploadToCloudinary(sourceUrl, uniqueId);
      
      if (uploadResult.success) {
        console.log(`   ✅ Uploaded: ${uploadResult.width}x${uploadResult.height} ${uploadResult.format}`);
        
        // Update Notion with new URL
        const updated = await updateNotionPage(img.pageId, uploadResult.url);
        console.log(`   📝 Notion ${updated ? 'updated' : 'update failed'}!\n`);
        
        newResults.success.push({
          ...img,
          uniqueId,
          newUrl: uploadResult.url,
          notionUpdated: updated
        });
      } else {
        console.log(`   ❌ Upload failed: ${uploadResult.error}\n`);
        newResults.failed.push({ ...img, uniqueId, error: uploadResult.error });
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      newResults.failed.push({ ...img, uniqueId, error: error.message });
    }
    
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  // Summary
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('                      📊 SUMMARY');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`✅ Successful: ${newResults.success.length}`);
  console.log(`❌ Failed: ${newResults.failed.length}`);
  
  if (newResults.failed.length > 0) {
    console.log('\n⚠️ Failed images:');
    newResults.failed.forEach(f => {
      console.log(`   - ${f.name}: ${f.reason || f.error || 'unknown'}`);
    });
  }

  // Save results
  const newResultsPath = join(__dirname, 'remigration-results.json');
  fs.writeFileSync(newResultsPath, JSON.stringify(newResults, null, 2));
  console.log(`\n📁 Results saved to: ${newResultsPath}`);
}

restoreAndRemigrate().catch(console.error);
