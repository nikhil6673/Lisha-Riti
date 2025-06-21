import { notion } from '../../lib/notion';

const databaseId = process.env.NOTION_QUESTION_DATABASE_ID;

export default async function handler(req, res) {
  const { subtopic } = req.query;
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Subtopic (Relation to Subtopic Table)',
        rich_text: { equals: subtopic }
      }
    });

    const data = response.results.map(page => ({
      id: page.id,
      name: page.properties['Question Text'].title[0].plain_text,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}