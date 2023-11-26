import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import fetchData from "./fetchData";

const apiFolderPath = path.resolve("./pages/api");

export default async function handler(req: any, res: NextApiResponse) {
  let datareq = req.body;

  const jsonFileName = datareq?.collection_name + ".json" || "data.json";
  const jsonFilePath = path.join(apiFolderPath, jsonFileName);

  let time: any = process.env.NEXT_PUBLIC_API_CACHE_TIMEOUT || 10;
  time = +time;
  if (isNaN(time)) {
    time = 5;
  }

  if (req.method.toLowerCase() === "post") {
    let finalData = "";
    await fs.stat(jsonFilePath, async (err, stats) => {
      if (err) {
        let data: any = await fetchData(datareq);

        data = await data?.data?.response;

        if (data) {
          await fs.writeFile(jsonFilePath, JSON.stringify(data), (err) => {
            if (err) throw err;
            return;
          });
        }
        res.status(200).json(data);
        return;
      }
      const lastModified = stats.mtime;
      const currentTime = new Date();
      const timeDifference = currentTime.getTime() - lastModified.getTime();

      if (timeDifference > time * 60 * 1000) {
        let data: any = await fetchData(datareq);
        data = await data?.data?.response;

        if (data) {
          await fs.writeFile(jsonFilePath, JSON.stringify(data), (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    });

    await fs.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading file from disk: ", err);
        return;
      }

      res.status(200).json(JSON.parse(data));
    });
  }
}
