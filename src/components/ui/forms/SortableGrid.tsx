import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState, type ReactNode } from "react";

type SortableGridProps = {
  ids: string[];
  onReorder: (from: number, to: number) => void;
  children: (isSorting: boolean) => ReactNode;
};

const SortableGrid = ({ ids, onReorder, children }: SortableGridProps) => {
  const [isSorting, setIsSorting] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onReorder(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    }
    requestAnimationFrame(() => setIsSorting(false));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => setIsSorting(true)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setIsSorting(false)}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        {children(isSorting)}
      </SortableContext>
    </DndContext>
  );
};

export default SortableGrid;
