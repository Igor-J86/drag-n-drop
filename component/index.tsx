import React from "react";
import {createRoot} from 'react-dom/client';
import { DragNDrop } from "../src/drag-n-drop";

const root = createRoot(document.getElementById('ijdnd-root')!);

// Example data
const data = {
  entry1: {
    tileId: 'entry1',
    sortOrder: 1,
    name: "Entry 1 name",
    isAvailable: true,
    hasAccess: true,
    isDisplayed: true,
    columns: 2,
  },
  entry2: {
    tileId: 'entry2',
    sortOrder: 2,
    name: "Entry 2 name",
    isAvailable: true,
    hasAccess: true,
    isDisplayed: true,
    columns: 3,
  },
  entry3:{
    tileId: 'entry3',
    sortOrder: 3,
    name: "Entry 3 name",
    isAvailable: true,
    hasAccess: false,
    isDisplayed: true,
    columns: 2,
  },
}

root.render(
  <DragNDrop>
    <div {...data.entry1}>
      {data.entry1.name}
    </div>
    <div {...data.entry2}>
      {data.entry2.name}
    </div>
    <div {...data.entry3}>
      {data.entry3.name}
    </div>
  </DragNDrop>
);
