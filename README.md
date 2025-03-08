# DragNDrop
A data driven drag-n-drop component, written in React with TypeScript.

The component will render the tiles (with children or the name) from each object by determining whether they should be displayed, are accessible, in which order, how many columns they will take up etc.

If you customize the visibility, sort order or columns, the information is being stored in local storage, and will be used by the component to render the children the same way next time you visit the same page.

CSS note:
The package comes with a CSS file, but you can choose to whether import it manually from the package or use your own.

## Usage
```jsx
import React from "react";
import { DragNDrop } from "@igor-j86/drag-n-drop";
import "@igor-j86/drag-n-drop/lib/style/ijdnd.css";

const SomeComponent = () => {
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
      children: <>Some component</>
    },
    {
      tileId: 'entry2',
      sortOrder: 2,
      name: "Entry 2",
      isAvailable: true,
      hasAccess: true,
      isDisplayed: true,
      columns: 3,
      children: <>Some component</>
    },
    {
      tileId: 'entry3',
      sortOrder: 3,
      name: "Entry 3",
      isAvailable: true,
      hasAccess: true,
      isDisplayed: true,
      columns: 2,
      children: <>Some component</>
    },
  ]

  return (
    <DragNDrop id="example" resources={defaultData} />
  )
}

export default SomeComponent
```

## Props
| Prop                          | Default             |
| ----------------------------- | ------------------- |
| id:string                     | ''                  |
| resources:TileObj[]           |                     |
| showDeactivated?:boolean      | true                |
| rootClassName?:string         | 'ijdnd-area'        |
| language?:string              | 'en'                |
| configurationArea?:string     | 'bottom'            |
| isSuperUser?: boolean         |                     |
| apiEndpoint?: string          |                     |
| onEdit?: Function             |                     |
| saveInBrowser?: boolean       | true                |

## Language
The component comes with language support for:
- English - `en`
- Norwegian - `nb`
- Swedish - `sv`
- Danish - `da`

## Tech stack
- 😱 React
- 🦺 TypeScript
- 🛠️ Vite
- 🪄 PostCSS

## License
Distributed under the ISC License.
