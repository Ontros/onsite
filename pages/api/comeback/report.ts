import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const report = req.body;
        console.log("Reported image:", report);
        res.status(200).json({ status: "ok" });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
