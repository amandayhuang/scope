import { sql } from "@vercel/postgres";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { getTodaysDateString } from "../services/util";
import Anthropic from "@anthropic-ai/sdk";

const VOICES = [
  "gen z",
  "millenial",
  "goop",
  "succession",
  "valley girl",
  "motivational speaker",
  "consipracy theorist",
  "sports commentator",
  "fairy tale narrator",
];

const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const key = process.env.ANTHROPIC_API_KEY;
  console.log("KEY", key ? true : false);
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  console.log("created anthropic instance");

  const todaysDateString = getTodaysDateString();

  // if already has this date's horoscope return early
  const horoscopeCount =
    await sql`SELECT * FROM horoscope where date(date) = ${todaysDateString};`;
  if (horoscopeCount?.rowCount && horoscopeCount?.rowCount > 0) {
    return response.status(200).json({ count: 0 });
  }

  console.log("GOT COUNT", horoscopeCount?.rowCount);

  const voice = VOICES[Math.floor(Math.random() * VOICES.length)];
  const prompt = `The response should only contain the JSON object, nothing else. can you give me a horoscope for each sign for ${todaysDateString}. please format it as a JSON where each sign is a key and each value is another JSON with the date, sign, and horoscope of around 100 words in the voice of ${voice} (which will include the mention of a famous person with the same sign) as values, for example { "leo" : {date:"2024-07-02", sign: "leo", horscope: "the horscope longer than this:"} }`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-instant-1.2",
      max_tokens: 2500,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    console.log("claude RESP", msg);
    console.log("returned from claude");
    // @ts-ignore
    const jsonResponse = JSON.parse(msg.content[0]?.text);
    let count = 0;

    for (let i = 0; i < SIGNS.length; i++) {
      const horoscope = jsonResponse[SIGNS[i]];
      if (horoscope) {
        await sql`INSERT INTO horoscope (date, sign, voice, details) VALUES (${horoscope.date}, ${horoscope.sign}, ${voice}, ${horoscope.horoscope})`;
        count++;
      }
    }
    return response.status(200).json({ count });
  } catch (error) {
    console.log("ERROR from claude", error);
    return response.status(200).json({ count: -1 });
  }
}
