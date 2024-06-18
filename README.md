# DragNDrop
A data driven drag-n-drop component, written in React with TypeScript.

## Usage
```jsx
import React from "react";
import { DragNDrop } from "@igor-j86/drag-n-drop";

const SomeComponent = () => {
  // Example data
  const data = {
    entry1: {
      tileId: 'entry1',
      sortOrder: 1,
      name: "Entry 1 name",
      isAvailable: true,
      hasAccess: true,
      isDisplayed: true,
      columns: 1,
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
      hasAccess: true,
      isDisplayed: true,
      columns: 2,
    },
  }

  return (
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
  )
}

export default SomeComponent
```

The component will consume the props you pass on the surrounding divs (or other elements), and render the children by determining whether they should be displayed, are accessible, in which order, how many columns they will take up etc.
If you customize the visibility, sort order or columns, this information is then stored in local storage, and retrieved from there next time as well.

## Optional props
| Prop                          | Default             |
| ----------------------------- | ------------------- |
| id:string                     | 'customizableTiles' |
| children:any                  | ''                  |
| showNonAccessible:boolean     | false               |
| rootClassName:string          | 'ijrc-dragndrop'    |
| language:string               | 'en'                |

## Developed with
- React
- TypeScript
- Vite
- PostCSS

## License
Distributed under the ISC License.