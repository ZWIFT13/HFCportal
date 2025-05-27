import { NextResponse, NextRequest } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.S3_BUCKET!;

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const propertyId = form.get('propertyId');
    if (typeof propertyId !== 'string') {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
    }

    const files = form.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const key = `properties/${propertyId}/${randomUUID()}.${ext}`;

        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ACL: 'public-read',
        }));

        const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        uploadedUrls.push(url);

        await prisma.property.update({
          where: { id: propertyId },
          data: { imageUrls: { push: url } },
        });
      }
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Upload failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
