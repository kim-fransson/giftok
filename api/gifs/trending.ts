import { GiphyFetch } from "@giphy/js-fetch-api";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const gf = new GiphyFetch(process.env.GIPHY_API_KEY as string);
  const { offset, limit } = request.query;

  try {
    const res = await gf.trending({
      limit: Number.parseInt(limit as string),
      offset: Number.parseInt(offset as string),
    });

    response.status(200).json(res);
  } catch (err) {
    response.status(500).json({
      body: "internal error",
    });
  }
}
