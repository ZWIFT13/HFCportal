// src/app/api/upload/[filename]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import mime from "mime-types";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      filename: string;
    };
  }
) {
  const { filename } = params;
  const uploadDir = "/tmp/upload";
  const filePath = path.join(uploadDir, filename);

  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileBuffer = await readFile(filePath);
  const contentType = mime.lookup(filename) || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  });
}
