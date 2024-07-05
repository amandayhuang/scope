import { sql } from "@vercel/postgres";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  //   const querySign = request.query.sign as string;
  //   const todaysDateString = new Date().toISOString().split("T")[0];

  //   const horoscopeRow =
  //     await sql`SELECT * FROM horoscope where date(date) = ${todaysDateString} AND sign=${querySign} limit 1;`;

  //   if (horoscopeRow?.rows.length !== 1) {
  //     return response.status(200).json({
  //       date: todaysDateString,
  //       sign: querySign,
  //       horoscope: "not found",
  //     });
  //   }
  //   const { sign, details: horoscope } = horoscopeRow.rows[0];
  return response.status(200).json({ count: 10 });
}
