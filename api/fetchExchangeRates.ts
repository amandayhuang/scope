import { VercelRequest, VercelResponse } from "@vercel/node";
import { getTodaysDateString } from "../services/util";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const key =
    process.env.CURRENCY_API_KEY ||
    "fca_live_2ayqQLg0cv4hLtImXA6ZLwJB7PGCl7HjoB5be21z";
  const url = "https://api.freecurrencyapi.com/v1/latest";

  // const rowCount =
  //   await sql`SELECT * FROM horoscope where date(date) = ${tomorrowDateString};`;
  // if (horoscopeCount?.rowCount && horoscopeCount?.rowCount > 0) {
  //   return response.status(200).json({ count: 0 });
  // }

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
      },
    });
    const data = await resp.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500);
  }
}
