import { notion } from '../../lib/notion';

const databaseId = process.env.NOTION_CHAPTER_DATABASE_ID;

export default async function handler(req, res) {
  const { unit } = req.query;
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Unit (Relation to Unit Table)',
        rich_text: { equals: unit }
      }
    });

    const data = response.results.map(page => ({
      id: page.id,
      name: page.properties['Chapter Name'].title[0].plain_text,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
}