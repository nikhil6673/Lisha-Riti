import { notion } from '../../lib/notion';

const databaseId = process.env.NOTION_UNIT_DATABASE_ID;

export default async function handler(req, res) {
  const { subject } = req.query;
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Subject (Relation to Subject Table)',
        rich_text: { equals: subject }
      }
    });

    const data = response.results.map(page => ({
      id: page.id,
      name: page.properties['Unit Name'].title[0].plain_text,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
}