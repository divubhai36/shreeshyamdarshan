import { NextResponse } from "next/server";
import { getAllAccountsUsage, autoCheckAndSwitchAccount } from "@/lib/cloudinary";

export async function GET() {
    try {
        // Force a usage check and switch if threshold reached
        await autoCheckAndSwitchAccount(true);
        
        const usage = await getAllAccountsUsage();
        return NextResponse.json(usage);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
    }
}
