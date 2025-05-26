// src/app/api/upload/[filename]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import mime from 'mime-types'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  // อ่าน filename จาก URL path เอง
  const url = new URL(request.url)
  const parts = url.pathname.split('/')
  const filename = parts[parts.length - 1]

  const uploadDir = path.join('/tmp', 'upload')
  const filePath = path.join(uploadDir, filename)

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = await readFile(filePath)
  const contentType = mime.lookup(filename) || 'application/octet-stream'

  return new NextResponse(data, {
    headers: { 'Content-Type': contentType },
  })
}
