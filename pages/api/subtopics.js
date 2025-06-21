import { notion } from '../../lib/notion';

const databaseId = process.env.NOTION_SUBTOPIC_DATABASE_ID;

export default async function handler(req, res) {
  const { chapter } = req.query;
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Chapter (Relation to Chapter Table)',
        rich_text: { equals: chapter }
      }
    });

    const data = response.results.map(page => ({
      id: page.id,
      name: page.properties['Subtopic Name'].title[0].plain_text,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subtopics' });
  }
}