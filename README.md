# DragNDrop
A data driven drag-n-drop component, written in React with TypeScript.

## Usage
```jsx
import React from "react";
import { Link } from "react-router-dom";
import { DragNDrop } from "@igor-j86/drag-n-drop";

const SomeComponent = () => {
  return (
    <DragNDrop>
      <Link to="/1">
        Card 1
      </Link>
      <Link to="/2">
        Card 2
      </Link>
      <Link to="/3">
        Card 3
      </Link>
      <Link to="/4">
        Card 4
      </Link>
      <Link to="/5">
        Card 5
      </Link>
    </DragNDrop>
  )
}

export default SomeComponent
```

## Optional props
| Prop                          | Default             |
| ----------------------------- | ------------------- |
| id:string                     | 'customizableTiles' |
| children:any                  | ''                  |
| apiEndpoint:number            |                     |
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