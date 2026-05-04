import { NextResponse } from "next/server";
import { getUploadSignatures, autoCheckAndSwitchAccount } from "@/lib/cloudinary";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'image';
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatures = await getUploadSignatures(timestamp, mode);
    
    // Also trigger background usage check and auto-switch
    // We don't await this to keep the API fast
    autoCheckAndSwitchAccount();

    return NextResponse.json({ signatures });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
