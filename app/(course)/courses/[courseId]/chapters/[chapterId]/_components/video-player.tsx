"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils"
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react" ;

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  isCompoletedOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  courseId,
  nextChapterId,
  title,
  playbackId,
  isLocked,
  isCompoletedOnEnd,
}: VideoPlayerProps) => {

  const [isReady, setIsReady] = useState(false);

  return ( 
    <div className="relative aspect-video">
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8 "/>
          <p className="text-sm">
            This chapter is Locked.
          </p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          // autoPlay
          playbackId={playbackId}
          className={cn(
            !isReady && "hidden"
          )}
        />
      )}
    </div>
   );
}