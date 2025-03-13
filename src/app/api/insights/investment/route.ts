import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('AWS configuration environment variables are not set');
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function GET() {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json({ error: 'AWS_S3_BUCKET_NAME not set' }, { status: 500 });
    }

    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'outputs/',
      Delimiter: '/',
    });

    const listObjectsResponse = await s3Client.send(listObjectsCommand);

    if (!listObjectsResponse.CommonPrefixes || listObjectsResponse.CommonPrefixes.length === 0) {
      return NextResponse.json({ message: 'No output folders found' }, { status: 404 });
    }

    const folders = listObjectsResponse.CommonPrefixes.map((prefix) => prefix.Prefix!.replace('outputs/', '').replace('/', ''));

    if (folders.length === 0) {
        return NextResponse.json({message: 'No output folders found'}, {status:404});
    }

    // Since S3 list objects doesn't guarantee sorting by creation time, and folders are assumed to be named in a way that lexicographical sorting matches chronological, we sort.
    folders.sort().reverse();
    const latestFolder = folders[0];
    const thesisFilePath = `outputs/${latestFolder}/investment.json`;

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: thesisFilePath,
    });

    const getObjectResponse = await s3Client.send(getObjectCommand);

    if (!getObjectResponse.Body) {
      return NextResponse.json({ error: 'investment.json not found in latest folder' }, { status: 404 });
    }

    const fileContent = await getObjectResponse.Body.transformToString();

    try {
      const jsonData = JSON.parse(fileContent);
      return NextResponse.json(jsonData);
    } catch (jsonError) {
      return NextResponse.json({ error: 'Error parsing investment.json' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching investment.json:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}