// app/api/purchases/summary/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // コースごとの購入数を集計
    const purchasesSummary = await db.purchase.groupBy({
      by: ['courseId'],
      _count: {
        _all: true,
      },
      where: {
        courseId: {
          not: {},
        },
      },
    });

    // 集計結果を整形
    const formattedSummary = purchasesSummary.map(summary => ({
      courseId: summary.courseId,
      purchases: summary._count._all,
    }));

    return NextResponse.json(formattedSummary);
  } catch (error) {
    console.log("[PURCHASES SUMMARY]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
