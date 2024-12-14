import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('voiceFile') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure the uploads directory exists
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, file.name);

  // Save the file to the public/uploads directory
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);

  return NextResponse.json({ filePath: `/uploads/${file.name}` });
}
