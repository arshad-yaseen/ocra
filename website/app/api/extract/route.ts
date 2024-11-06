import {Ocra} from 'ocra';

const ocra = new Ocra({
  provider: 'openai',
  key: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {error: 'OpenAI API key not configured'},
        {status: 500},
      );
    }

    const {url, type} = await request.json();

    if (!url || !type) {
      return Response.json(
        {error: 'Missing required fields: url and type'},
        {status: 400},
      );
    }

    if (type !== 'image' && type !== 'pdf') {
      return Response.json(
        {error: 'Invalid type: must be "image" or "pdf"'},
        {status: 400},
      );
    }

    const result =
      type === 'image' ? await ocra.image(url) : await ocra.pdf(url);

    return Response.json({result});
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      {error: 'An error occurred while processing your request'},
      {status: 500},
    );
  }
}
