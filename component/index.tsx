import React from "react";
import {createRoot} from 'react-dom/client';
import { DragNDrop } from "../src/drag-n-drop";

const root = createRoot(document.getElementById('ijrc-dnd-root')!);

// Example data
const data = {
  tracking: {
    tileId: 'entrance_tracking',
    sortOrder: 1,
    name: "Tracking",
    icon: 'mybicon-search',
    isAvailable: true,
    hasAccess: true,
    reqSpecificAccess: false,
    isDisplayed: true,
    columns: 2,
  },
  reports: {
    tileId: 'entrance_reports',
    sortOrder: 2,
    name: "Operational messages",
    icon: 'mybicon-chart-bar',
    isAvailable: true,
    hasAccess: true,
    reqSpecificAccess: false,
    isDisplayed: true,
    columns: 3,
  },
  checkout:{
    tileId: 'entrance_checkout',
    sortOrder: 3,
    name: "Checkout",
    icon: 'mybicon-cart',
    isAvailable: true,
    hasAccess: true,
    reqSpecificAccess: false,
    isDisplayed: false,
    columns: 2,
  },
}

root.render(
  <DragNDrop>
    <div {...data.tracking}>
      Tracking
    </div>
    <div {...data.reports}>
      Reports
    </div>
    <div {...data.checkout}>
      Checkout
    </div>
  </DragNDrop>
);
