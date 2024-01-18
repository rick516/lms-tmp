"use client";

import { Chapter } from "@prisma/client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Grip, Pencil } from "lucide-react";

interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: number; position: number }[]) => void;
}

export const ChaptersList = ({
  items,
  onEdit,
  onReorder
}: ChaptersListProps) => {

  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const startIndex = Math.max(result.source.index, result.destination.index);
    const endIndex = Math.min(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: Number(chapter.id),
      position: items.findIndex((item) => item.id === chapter.id) + 1
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {chapters.map((chapter, index) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center justify-between gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bf-slate-300 rounded-l-md transition",
                        chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex items-center gap-x-2">
                          <Grip className="w-5 h-5" />
                          {chapter.title}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-x-2 mr-2">
                          {chapter.isFree && (
                            <Badge>
                              Free
                            </Badge>
                          )}
                          <Badge
                            className={cn(
                              "bg-slate-500",
                              chapter.isPublished && "text-sky-700"
                            )}>
                            {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Pencil
                            className="w-5 h-5 cursor-pointer hover:opacity-75 transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  );
}