import { NextApiResponse } from "next";
import fetchData from "./fetchData";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export default async function handler(req: any, res: NextApiResponse) {
  const datareq = req.body;

  const db = await open({
    filename: "localData",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cached_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_name TEXT,
      data TEXT,
      last_modified TEXT
    );
  `);

  let time: any = process.env.NEXT_PUBLIC_API_CACHE_TIMEOUT || 10;
  time = +time;
  if (isNaN(time)) {
    time = 5;
  }

  if (req.method.toLowerCase() === "post") {
    try {
      const cachedData = await db.get("SELECT * FROM cached_data WHERE collection_name = ?", datareq.collection_name);

      const currentTime: any = new Date();
      const savedTime: any = cachedData ? new Date(cachedData.last_modified) : null;

      let timeDifference: any = savedTime
        ? Math.abs(currentTime.getTime() - savedTime.getTime())
        : Number.MAX_SAFE_INTEGER;

      timeDifference = Math.floor(timeDifference / 1000 / 60);

      console.log(timeDifference, "timeDifference");

      if (!cachedData || timeDifference > time) {
        const data = await fetchData(datareq);
        const responseData = data?.data?.response;

        if (responseData) {
          const now = new Date();

          if (cachedData) {
            await db.run(
              "UPDATE cached_data SET data = ?, last_modified = ? WHERE collection_name = ?",
              JSON.stringify(responseData),
              now.toISOString(),
              datareq.collection_name
            );
          } else {
            await db.run(
              "INSERT INTO cached_data (collection_name, data, last_modified) VALUES (?, ?, ?)",
              datareq.collection_name,
              JSON.stringify(responseData),
              now.toISOString()
            );
          }

          res.status(200).json(responseData);
        }
      } else {
        res.status(200).json(JSON.parse(cachedData?.data));
      }
    } catch (err) {
      console.error("Error querying or updating cache:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
