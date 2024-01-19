import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter } from ".prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request, 
  { params }: { params: { courseId: string; chapterId: string }}) {
    try {
      const { userId } = await auth();
      if (!userId) return new NextResponse("Unauthorized", { status: 401});

      const { courseId, chapterId } = params;
      const values = await req.json();

      const chapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId
        },
        data: values
      })

      return new NextResponse(JSON.stringify(chapter), { status: 200});

    } catch (error) {
      console.log(JSON.stringify(error));
      return new NextResponse("Internal Server Error", { status: 500});
    }
  }

