# ...existing content...

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Configure your Notion integration:
   - Create a new integration at https://www.notion.so/my-integrations
   - Copy the Internal Integration Token to `NOTION_TOKEN`
   - Create a database in Notion with these properties:
     - Title (Title)
     - Slug (Rich Text)
     - Excerpt (Rich Text)
     - Date (Date)
     - Category (Select)
     - Featured (Checkbox)
     - Image (Files)
   - Share the database with your integration
   - Copy the database ID to `NOTION_POSTS_DATABASE_ID`

3. For development without Notion, the blog will use mock data automatically.

## Development

```bash
npm run dev
```

The blog will work with mock data if Notion environment variables are not configured.

# ...existing content...
