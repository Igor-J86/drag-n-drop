import React from "react";
import {createRoot} from 'react-dom/client';
import { DragNDrop } from "../src/drag-n-drop";

const root = createRoot(document.getElementById('ijdnd-root')!);

// Example data
const defaultData = [
  {
    tileId: 'entry1',
    sortOrder: 1,
    name: "Entry 1",
    isAvailable: true,
    hasAccess: true,
    isDisplayed: true,
    columns: 2,
    children: <div className="pam" style={{ backgroundColor: 'hsla(0,0%,70%,10%)'}}>
      <h2>Some example content</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </div>
  },
  {
    tileId: 'entry2',
    sortOrder: 2,
    name: "Entry 2",
    isAvailable: true,
    hasAccess: true,
    isDisplayed: true,
    columns: 3,
    children: <div className="pam" style={{ backgroundColor: 'hsla(0,0%,70%,10%)'}}>
      <h2>Some example content 2</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam temporibus repudiandae corrupti dolorum optio magnam culpa, neque obcaecati natus voluptates distinctio porro in dolor. Sunt eaque dicta aliquid qui mollitia?</p>
    </div>
  },
  {
    tileId: 'entry3',
    sortOrder: 3,
    name: "Entry 3",
    isAvailable: true,
    hasAccess: true,
    isDisplayed: true,
    columns: 2,
    children: <div className="pam" style={{ backgroundColor: 'hsla(0,0%,70%,10%)'}}>
    <h2>Some example content 3</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam temporibus repudiandae corrupti dolorum optio magnam culpa, neque obcaecati natus voluptates distinctio porro in dolor. Sunt eaque dicta aliquid qui mollitia?</p>
  </div>
  },
]

root.render(
  <DragNDrop id="example1" resources={defaultData} />
);
