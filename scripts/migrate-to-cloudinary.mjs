/**
 * Cloudinary Migration Script
 * 
 * Bu script Notion'daki galeri resimlerini Cloudinary'ye yükler
 * ve yeni URL'leri gösterir.
 * 
 * Kullanım:
 * 1. .env.local dosyasına Cloudinary bilgilerini ekle:
 *    CLOUDINARY_CLOUD_NAME=djl5lgrpr
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 * 
 * 2. Script'i çalıştır:
 *    node scripts/migrate-to-cloudinary.mjs
 * 
 * 3. Notion'daki Image alanlarını yeni URL'lerle güncelle
 */

import { v2 as cloudinary } from 'cloudinary';
import { Client } from '@notionhq/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';
import https from 'https';
import http from 'http';
import { createWriteStream, unlinkSync, statSync } from 'fs';
import { tmpdir } from 'os';

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

console.log('Environment loaded:', {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY ? '***' + env.CLOUDINARY_API_KEY.slice(-4) : 'missing',
  has_secret: !!env.CLOUDINARY_API_SECRET
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

// Check configuration
function checkConfig() {
  const missing = [];
  if (!env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY === 'your_api_key_here') {
    missing.push('CLOUDINARY_API_KEY');
  }
  if (!env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET === 'your_api_secret_here') {
    missing.push('CLOUDINARY_API_SECRET');
  }
  if (!env.NOTION_TOKEN) missing.push('NOTION_TOKEN');
  if (!GALLERY_DATABASE_ID) missing.push('NOTION_GALLERY_DATABASE_ID');

  if (missing.length > 0) {
    console.error('\n❌ Missing environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\n📝 Please update .env.local with your Cloudinary API credentials.');
    console.error('   Get them from: https://console.cloudinary.com/settings/api-keys\n');
    process.exit(1);
  }
}

// Download file to temp location
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

// Upload image to Cloudinary
async function uploadToCloudinary(imageUrl, publicId, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`   Uploading... (attempt ${attempt}/${retries})`);
      
      // For large files, we need to resize during upload
      // Cloudinary free plan has 10MB limit
      const result = await cloudinary.uploader.upload(imageUrl, {
        public_id: publicId,
        folder: 'gallery',
        overwrite: true,
        resource_type: 'image',
        // CRITICAL: Resize large images during upload to avoid 10MB limit
        eager: [
          { width: 4000, height: 4000, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' }
        ],
        eager_async: false,
        // Optimize settings
        transformation: [
          { width: 4000, height: 4000, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
    } catch (error) {
      // If file too large, skip it (Cloudinary free plan has 10MB limit)
      if (error.message.includes('too large')) {
        console.log(`   ⚠️ File too large for Cloudinary (10MB limit)`);
        console.log(`   💡 Consider resizing the image or using Cloudinary paid plan`);
        return {
          success: false,
          error: 'File too large (10MB limit). Resize the image or upgrade Cloudinary plan.'
        };
      }
      
      console.log(`   ⚠️ Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        return {
          success: false,
          error: error.message
        };
      }
      // Wait before retry
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// Get gallery images from Notion
async function getGalleryImages() {
  console.log('\n📚 Fetching images from Notion...\n');
  
  const response = await notion.databases.query({
    database_id: GALLERY_DATABASE_ID,
  });

  const images = response.results.map((page) => {
    const name = page.properties.Name?.title?.[0]?.plain_text ||
                 page.properties.Title?.title?.[0]?.plain_text ||
                 'Untitled';
    
    const src = page.properties.Image?.files?.[0]?.external?.url ||
                page.properties.Image?.files?.[0]?.file?.url ||
                null;

    return {
      pageId: page.id,
      name,
      originalUrl: src,
      // Create safe public ID from name + unique suffix from page ID
      publicId: name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40) + '-' + page.id.slice(-8)
    };
  }).filter(img => img.originalUrl);

  return images;
}

// Update Notion page with new Cloudinary URL
async function updateNotionPage(pageId, newUrl) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Image: {
          files: [
            {
              type: 'external',
              name: 'Cloudinary Image',
              external: {
                url: newUrl
              }
            }
          ]
        }
      }
    });
    return true;
  } catch (error) {
    console.log(`   ⚠️ Failed to update Notion: ${error.message}`);
    return false;
  }
}

// Format bytes
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Main migration function
async function migrate() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       🌥️  Cloudinary Migration Script                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  checkConfig();

  const images = await getGalleryImages();
  console.log(`Found ${images.length} images to migrate\n`);

  if (images.length === 0) {
    console.log('No images found in Notion gallery.');
    return;
  }

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[${i + 1}/${images.length}] ${img.name}`);
    
    // Check if already on Cloudinary with CORRECT unique ID
    // The URL should contain the unique public_id we generate
    const expectedUrlPart = `gallery/${img.publicId}`;
    if (img.originalUrl.includes('res.cloudinary.com') && img.originalUrl.includes(expectedUrlPart)) {
      console.log('   ✅ Already on Cloudinary with correct ID, skipping\n');
      results.success.push({ ...img, skipped: true });
      continue;
    }
    
    // If on Cloudinary but wrong ID, we need to re-upload
    if (img.originalUrl.includes('res.cloudinary.com')) {
      console.log('   🔄 Wrong Cloudinary ID, re-uploading...');
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(img.originalUrl, img.publicId);

    if (uploadResult.success) {
      console.log(`   ✅ Uploaded: ${uploadResult.width}x${uploadResult.height} ${uploadResult.format} (${formatBytes(uploadResult.bytes)})`);
      console.log(`   📎 New URL: ${uploadResult.url}`);
      
      // Update Notion
      const updated = await updateNotionPage(img.pageId, uploadResult.url);
      if (updated) {
        console.log('   📝 Notion updated!\n');
      } else {
        console.log('   ⚠️ Notion update failed - manual update needed\n');
      }

      results.success.push({
        ...img,
        newUrl: uploadResult.url,
        notionUpdated: updated
      });
    } else {
      console.log(`   ❌ Failed: ${uploadResult.error}\n`);
      results.failed.push({
        ...img,
        error: uploadResult.error
      });
    }

    // Rate limiting - wait between uploads
    if (i < images.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Summary
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('                      📊 MIGRATION SUMMARY');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n⚠️ Failed images:');
    results.failed.forEach(img => {
      console.log(`   - ${img.name}: ${img.error}`);
    });
  }

  // Save results to file
  const resultsPath = join(__dirname, 'migration-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsPath}`);

  console.log('\n🎉 Migration complete!\n');
}

// Run migration
migrate().catch(console.error);
