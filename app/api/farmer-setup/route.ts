import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Farm from "@/models/FarmSetup";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Safety check to satisfy TypeScript
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Capture the ID. Even if MongoDB uses _id,
    // NextAuth usually passes it as 'id' in the session object.
    const userId = (session.user as any).id;

    const data = await req.json();
    await dbConnect();

    // When querying Mongoose, you can use either 'userId'
    // or '_id' depending on your schema.
    const existingFarm = await Farm.findOne({ userId: userId });

    if (existingFarm) {
      return NextResponse.json(
        { error: "Farm already setup" },
        { status: 400 }
      );
    }

    // Create the farm using the userId as a reference
    await Farm.create({
      userId: userId, // This links the farm to the user's _id in MongoDB
      phoneNumber: data.phoneNumber,
      farmName: data.farmName,
      farmTypes: data.farmTypes,
      locations: data.locations,
      availability: {
        startTime: data.startTime,
        endTime: data.endTime,
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    });

    // Update the User document using findById
    // findById automatically knows to look for the '_id' field
    await User.findByIdAndUpdate(userId, {
      role: "farmer",
      isSetupComplete: true,
    });

    return NextResponse.json({ message: "Setup successful" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
