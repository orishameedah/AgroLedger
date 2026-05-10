import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    await dbConnect();

    const user = await User.findOne({
      email: email.toLowerCase(),
      role: role,
    });

    if (!user) {
      return NextResponse.json(
        { message: `No ${role} account found with this email.` },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
