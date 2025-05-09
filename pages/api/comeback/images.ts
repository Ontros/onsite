import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const filePath = path.join(process.cwd(), "public", "images.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    res.status(200).json(JSON.parse(fileContent));
}
