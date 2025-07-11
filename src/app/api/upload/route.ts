import { NextResponse } from "next/server";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import type { IncomingMessage } from "http";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/public/uploads");

export async function POST(request: Request) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB
  });

  const data: { file: FormidableFile } = await new Promise((resolve, reject) => {
    form.parse(request as unknown as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);

      const uploadedFile = files.file;

      // Handle array or single file
      if (!uploadedFile) return reject(new Error("No file uploaded"));
      const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

      resolve({ file });
    });
  });

  const filename = path.basename(data.file.filepath);
  const fileUrl = `/uploads/${filename}`;

  return NextResponse.json({ url: fileUrl });
}
