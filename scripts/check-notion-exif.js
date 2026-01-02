const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function check() {
  const r = await notion.databases.query({
    database_id: process.env.NOTION_GALLERY_DATABASE_ID,
    page_size: 5
  });
  
  r.results.forEach(p => {
    const name = p.properties.Name?.title?.[0]?.plain_text || 'No name';
    const iso = p.properties.ISO?.rich_text?.[0]?.plain_text || 'N/A';
    const aperture = p.properties.Aperture?.rich_text?.[0]?.plain_text || 'N/A';
    const shutter = p.properties.ShutterSpeed?.rich_text?.[0]?.plain_text || 'N/A';
    console.log(`${name}: ISO=${iso}, Aperture=${aperture}, Shutter=${shutter}`);
  });
}

check();
