import { VercelRequest, VercelResponse } from "@vercel/node";
import { getTodaysDateString } from "../services/util";
import { sql } from "@vercel/postgres";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const key =
    process.env.CURRENCY_API_KEY ||
    "fca_live_2ayqQLg0cv4hLtImXA6ZLwJB7PGCl7HjoB5be21z";
  const url = "https://api.freecurrencyapi.com/v1/latest";

  // return early if already have rates for today
  const today = getTodaysDateString();
  const exchangeCount =
    await sql`SELECT * FROM exchange_rate where date(dt_created) = ${today};`;
  if (exchangeCount?.rowCount && exchangeCount?.rowCount > 0) {
    return response.status(200).json({ count: 0 });
  }

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
      },
    });
    const data = await resp.json();

    const dataArray = Object.entries(data.data);

    for (let i = 0; i < dataArray.length; i++) {
      const entry = dataArray[i];
      const [k, v] = entry;
      const rate = typeof v === "number" ? v : 0;

      await sql`INSERT INTO exchange_rate (currency, rate) VALUES (${k}, ${rate})`;
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500);
  }
}
