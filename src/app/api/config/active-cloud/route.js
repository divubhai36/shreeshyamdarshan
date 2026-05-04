import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { autoCheckAndSwitchAccount } from "@/lib/cloudinary";

export async function GET() {
    try {
        // Trigger the "5-minute Watchman" check
        autoCheckAndSwitchAccount();

        // Fetch active config from DB
        let config = await prisma.appConfig.findFirst();
        
        if (!config) {
            // Default to first account if no config exists
            config = await prisma.appConfig.create({
                data: { activeCloudinaryIndex: 0 }
            });
        }

        const imageAccounts = JSON.parse(process.env.IMAGE_CLOUDINARY_ACCOUNTS || process.env.CLOUDINARY_ACCOUNTS || "[]");
        const videoAccounts = JSON.parse(process.env.VIDEO_CLOUDINARY_ACCOUNTS || "[]");
        
        const activeImageAccount = imageAccounts[config.activeCloudinaryIndex] || imageAccounts[0] || { name: "dumbddcvh" };
        const activeVideoAccount = videoAccounts[0] || { name: "duxn4yj3a" };

        return NextResponse.json({
            imageCloudName: activeImageAccount.name,
            videoCloudName: activeVideoAccount.name,
            cloudName: activeImageAccount.name // Backwards compatibility
        });
    } catch (error) {
        return NextResponse.json({ 
            imageCloudName: "dumbddcvh", 
            videoCloudName: "duxn4yj3a",
            cloudName: "dumbddcvh" 
        }, { status: 200 });
    }
}
