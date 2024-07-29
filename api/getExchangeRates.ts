import { sql } from "@vercel/postgres";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { getTodaysDateString } from "../services/util";
import { SIGNS } from "./generateHoroscope";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const exchanges = await sql`SELECT DISTINCT ON (currency) 
    id,
    currency,
    base_currency,
    rate,
    dt_created
    FROM 
    exchange_rate
    ORDER BY 
    currency, dt_created DESC;`;

  return response.status(200).json({ latestRates: exchanges.rows });
}
