import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSystemInstructions } from "@/lib/chatbot-instructions";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    console.log("full body:", body);

    const { messages, context } = body;

    const role = session?.user?.role || "buyer";
    const userName = session?.user?.name || "User";

    let contextText = "No specific context provided.";

    // ✅ MARKETPLACE CONTEXT
    if (context?.type === "marketplace" && context?.data) {
      contextText = `
USER IS VIEWING THE MARKETPLACE.

IMPORTANT PRICING FORMAT:
Each produce item shows: [Name] | ₦[Price Per Unit] per [Unit] | Total Stock: [Quantity] [Units] | Status: [Verified/Pending]

Available Produce:
${context.data
  .map(
    (item: any) =>
      `• **${item.name}** - ₦**${item.price}** per ${item.unit} | Total in stock: **${item.quantity}** ${item.unit} | Status: **${item.status}**`,
  )
  .join("\n")}
`;
    }

    // ✅ PRODUCT CONTEXT
    else if (context?.type === "product" && context?.data) {
      const item = context.data;

      contextText = `
USER IS VIEWING A SPECIFIC PRODUCT PAGE.

PRODUCT DETAILS:
- **Product Name:** ${item.produceName}
- **Price Per Unit:** ₦**${item.producePrice}** per ${item.unit}
- **Total Stock Available:** **${item.produceQuantity}** ${item.unit}s
- **Status Badge:** **${item.status}**

FARMER DETAILS:
- **Farmer Name:** ${item.farmerName}
- **Farm Name:** ${item.farmName}
- **Phone:** ${item.phoneNumber}
- **Location:** ${Array.isArray(item.location) ? item.location.join(", ") : item.location}

`;
    }

    // ✅ DASHBOARD CONTEXT
    else if (context?.type === "dashboard") {
      contextText = `
    USER IS IN THE FARMER DASHBOARD.
    Guide them on:
      on how to manage their dashboard.
    `;
    }

    // console.log("AI Context Data:\n", contextText);

    const systemInstruction = getSystemInstructions(
      userName,
      role,
      contextText,
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
      contents: messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    return NextResponse.json({
      content: response.text,
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { content: "Market server is busy, abeg try again soon!" },
      { status: 500 },
    );
  }
}
