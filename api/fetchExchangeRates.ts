import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const key = process.env.CURRENCY_API_KEY;
  const url = "https://api.freecurrencyapi.com/v1/latest";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key || "",
      },
    });
    const data = await response.json();
    console.log("DATA", data);
    return data;
  } catch (error) {
    return response.status(500);
  }
}
