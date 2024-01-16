import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs"

const f = createUploadthing();

const handlAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handlAuth())
    .onUploadComplete(()=> {}),
  courseAttachment: f(["image", "video", "audio", "pdf"])
    .middleware(() => handlAuth())
    .onUploadComplete(()=> {}),
  chapterVideo: f({ video: { maxFileCount: 1 } })
    .middleware(() => handlAuth())
    .onUploadComplete(()=> {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;