// Automated Read Time Calculator for Notion Blog Posts
// This script calculates read times based on content length and updates your Notion database

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '../.env.local' });

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_POSTS_DATABASE_ID;

// Average reading speed: 200 words per minute (adjustable)
const WORDS_PER_MINUTE = 200;

// Function to count words in text
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Function to calculate read time
function calculateReadTime(wordCount) {
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, minutes); // Minimum 1 minute
}

// Function to extract text content from Notion rich text
function extractTextFromRichText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(block => block.plain_text || '').join(' ');
}

// Function to get all blog posts
async function getAllBlogPosts() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    return response.results;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Function to update read time for a specific page
async function updateReadTime(pageId, readTime) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        ReadTime: {
          rich_text: [
            {
              text: {
                content: `${readTime} min read`
              }
            }
          ]
        }
      }
    });
    return true;
  } catch (error) {
    console.error(`Error updating read time for page ${pageId}:`, error);
    return false;
  }
}

// Main function to process all blog posts
async function updateAllReadTimes() {
  console.log('🚀 Starting automated read time calculation...\n');

  if (!DATABASE_ID) {
    console.error('❌ NOTION_POSTS_DATABASE_ID not found in environment variables');
    process.exit(1);
  }

  if (!process.env.NOTION_TOKEN) {
    console.error('❌ NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    const posts = await getAllBlogPosts();
    console.log(`📚 Found ${posts.length} blog posts to process\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      const pageId = post.id;
      const title = post.properties.Title?.title?.[0]?.plain_text || 'Untitled';
      
      // Extract content from various possible fields
      let content = '';
      
      // Try Content field first
      if (post.properties.Content?.rich_text) {
        content = extractTextFromRichText(post.properties.Content.rich_text);
      }
      
      // If no content, try Excerpt field
      if (!content && post.properties.Excerpt?.rich_text) {
        content = extractTextFromRichText(post.properties.Excerpt.rich_text);
      }
      
      // Calculate word count and read time
      const wordCount = countWords(content);
      const readTime = calculateReadTime(wordCount);
      
      console.log(`📝 "${title}"`);
      console.log(`   Words: ${wordCount} | Read Time: ${readTime} min`);
      
      // Update the read time in Notion
      const success = await updateReadTime(pageId, readTime);
      
      if (success) {
        console.log(`   ✅ Updated successfully\n`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to update\n`);
        errorCount++;
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('📊 Summary:');
    console.log(`✅ Successfully updated: ${successCount} posts`);
    console.log(`❌ Failed to update: ${errorCount} posts`);
    console.log('\n🎉 Read time calculation complete!');

  } catch (error) {
    console.error('❌ Error processing blog posts:', error);
    process.exit(1);
  }
}

// Function to update a single post (for testing)
async function updateSinglePost(pageId) {
  try {
    const post = await notion.pages.retrieve({ page_id: pageId });
    const title = post.properties.Title?.title?.[0]?.plain_text || 'Untitled';
    
    let content = '';
    if (post.properties.Content?.rich_text) {
      content = extractTextFromRichText(post.properties.Content.rich_text);
    }
    
    const wordCount = countWords(content);
    const readTime = calculateReadTime(wordCount);
    
    console.log(`Updating "${title}": ${wordCount} words → ${readTime} min read`);
    
    const success = await updateReadTime(pageId, readTime);
    console.log(success ? '✅ Updated successfully' : '❌ Failed to update');
    
  } catch (error) {
    console.error('Error updating single post:', error);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === '--single') {
    if (args.length < 2) {
      console.error('Usage: node update-read-times.js --single <page_id>');
      process.exit(1);
    }
    updateSinglePost(args[1]);
  } else {
    updateAllReadTimes();
  }
}

module.exports = {
  updateAllReadTimes,
  updateSinglePost,
  calculateReadTime,
  countWords
};
