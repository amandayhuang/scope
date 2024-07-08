import { sql } from "@vercel/postgres";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { getTodaysDateString } from "../services/util";
import { SIGNS } from "./generateHoroscope";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const querySign = request.query.sign as string;
  if (!SIGNS.includes(querySign)) {
    return response
      .status(422)
      .json({ message: "must provide valid sign param" });
  }
  const dateString = (request.query.date as string) || getTodaysDateString();

  const horoscopeRow =
    await sql`SELECT * FROM horoscope where date(date) = ${dateString} AND sign=${querySign} limit 1;`;

  if (horoscopeRow?.rows.length !== 1) {
    return response.status(200).json({
      date: dateString,
      sign: querySign,
      horoscope: "not found",
    });
  }
  const { sign, details: horoscope } = horoscopeRow.rows[0];
  return response.status(200).json({ date: dateString, sign, horoscope });
}
