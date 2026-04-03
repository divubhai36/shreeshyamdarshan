import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      // Auto-detect if it's image or video for cloudinary optimization
      const resourceType = file.type.startsWith('video/') ? "video" : "image";
      
      cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: "shreeshyamdarshan" },
        (error, result) => {
          if (error) reject(NextResponse.json({ error: error.message }, { status: 500 }));
          else resolve(NextResponse.json({ url: result.secure_url }));
        }
      ).end(buffer);
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
