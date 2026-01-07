import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();
//     await dbConnect();

//     // 1. Check if user exists
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // 2. Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // 3. Update the password
//     await User.findByIdAndUpdate(user._id, { password: hashedPassword });

//     return NextResponse.json(
//       { message: "Password updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    await dbConnect();

    // 1. Find user by email AND role
    // This ensures someone doesn't accidentally reset a buyer account on a farmer page
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: role,
    });

    if (!user) {
      return NextResponse.json(
        { message: `No ${role} account found with this email.` },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
