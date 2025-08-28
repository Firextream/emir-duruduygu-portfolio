# Blog & Gallery API Setup

## Overview
The `/api/blogs` and `/api/gallery` endpoints have been created to serve blog data and gallery images from your Notion databases.

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```bash
# Notion Configuration
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
NOTION_GALLERY_DATABASE_ID=your_gallery_database_id_here
```

## Getting Your Notion Credentials

### 1. Notion Integration Token
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Portfolio Blog")
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" - this is your `NOTION_TOKEN`

### 2. Notion Database ID
1. Open your Notion database in a browser
2. The URL will look like: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` part - this is your `NOTION_DATABASE_ID`
4. Make sure to share your database with your integration:
   - Click "Share" on your database
   - Add your integration by name
   - Give it read permissions

## Database Schema

### Blog Database
Your Notion blog database should have the following properties:
- **Title** (Title field)
- **Slug** (Rich text)
- **Date** (Date)
- **Excerpt** (Rich text)
- **ReadTime** (Rich text)
- **Content** (Rich text)
- **Category** (Select)
- **Author** (People, Rich text, or Select)
- **AuthorTitle** (Select)
- **Image** (Files & media)
- **Featured** (Checkbox)

### Gallery Database
Your Notion gallery database should have the following properties:
- **Title** or **Name** (Title field or Rich text) - Image title/name
- **Image** (Files & media) - The actual image file
- **Alt** or **Description** (Rich text) - Alt text/description for the image
- **AspectRatio** (Rich text) - Aspect ratio like "4/3", "16/9", "1/1", etc.
- **Date** (Date) - When the photo was taken
- **Location** or **Place** (Rich text) - Where the photo was taken
- **Category** (Select) - Photo category (optional)
- **Featured** (Checkbox) - Whether to feature this image (optional)

## API Endpoints

### GET /api/blogs
Returns all blog posts from your Notion database.

**Query Parameters:**
- `limit` (optional) - Number of posts to return

**Response:**
```json
{
  "posts": [...],
  "total": 10,
  "success": true
}
```

### GET /api/gallery
Returns all gallery images from your Notion database.

**Query Parameters:**
- `limit` (optional) - Number of images to return

**Response:**
```json
{
  "images": [...],
  "total": 15,
  "success": true
}
```

## Testing
1. Set up your environment variables
2. Run `npm run dev`
3. Visit `http://localhost:3000/api/blogs` to test the endpoint
4. The blog preview on the homepage should now load your Notion content

## Troubleshooting
- Make sure your Notion integration has access to your database
- Check that all environment variables are set correctly
- Verify your database has the required properties
- Check the console for any error messages
