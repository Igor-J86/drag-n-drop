import * as React from "react";
import { ArrowLeft, ArrowRight, Cross } from "./icons";
import { Translations } from "./translations";
import { TileObj } from "./drag-n-drop";

type TileProps = {
  tile: TileObj;
  counter: number;
  length: number;
  onChangeSortOrder?: Function;
  isConfiguring: boolean;
  onChangeDisplay: Function;
  isDragging: boolean;
  onDragStart: Function;
  onDragEnter: Function;
  onDragLeave: Function;
  onDragEnd: Function;
  onSetColumns: Function;
  columns: number;
  layoutColumns: number;
  t: Translations;
  isGrid: boolean;
};

type LayoutColumns = {
  count: number;
  columns: number;
  setGridColumns: Function;
  handleSetColumns: Function;
};

const GenerateLayoutColumnsGrid: React.FC<LayoutColumns> = ({
  count,
  columns,
  setGridColumns,
  handleSetColumns,
}) => {
  return (
    <span
      className={count < columns ? "active" : ""}
      onMouseOver={() => setGridColumns(count + 1)}
      onClick={() => handleSetColumns()}
      data-columns={count}
    />
  );
};

const Tile: React.FC<TileProps> = ({
  tile,
  counter,
  length,
  isConfiguring,
  isDragging,
  onChangeSortOrder,
  onChangeDisplay,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragEnd,
  onSetColumns,
  columns,
  layoutColumns,
  t,
  isGrid,
}) => {
  const [gridColumns, setGridColumns] = React.useState<number>(columns);

  React.useEffect(() => {
    setGridColumns(columns);
  }, [columns]);

  const handleHideTile = () => {
    return onChangeDisplay(false, tile.sortOrder);
  };

  const moveLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    return onChangeSortOrder(e.currentTarget.dataset.sortOrder, "left");
  };

  const moveRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    return onChangeSortOrder(e.currentTarget.dataset.sortOrder, "right");
  };

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    return onDragStart(e, tile);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
    return onDragEnter(e, tile);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    return onDragLeave(e);
  };

  const handleDragEnd = () => {
    return onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleSetColumns = () => {
    onSetColumns(gridColumns, tile.tileId);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && gridColumns > 1) {
      setGridColumns((prev) => prev - 1);
    }
    if (e.key === "ArrowRight" && gridColumns < layoutColumns) {
      setGridColumns((prev) => prev + 1);
    }
    if (e.key === "Enter" || e.code === "Space") {
      onSetColumns(gridColumns, tile.tileId);
    }
  };

  return isConfiguring ? (
    <div
      className={`tile__config relative${isDragging ? " box-dim" : ""} grid${columns}`}
      draggable={isConfiguring}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <div
        className={`flex gaxs change-order-btns${isDragging ? " pointev-none" : ""}`}
      >
        {counter! > 1 && (
          <button
            className="btn"
            data-sort-order={tile.sortOrder}
            onClick={moveLeft}
            title={`${t.move} ${tile.name} ${t.toLeft}`}
          >
            <ArrowLeft />
          </button>
        )}
        {counter! < length! && (
          <button
            className="btn"
            data-sort-order={tile.sortOrder}
            onClick={(e) => moveRight(e)}
            title={`${t.move} ${tile.name} ${t.toRight}`}
          >
            <ArrowRight />
          </button>
        )}
      </div>
      <div className={`flex gas absolute display-change${isDragging ? " pointev-none" : ""}`}>
        {isGrid && 
          <button
            className="btn set-column"
            onMouseLeave={() => setGridColumns(columns)}
            onKeyUp={(e) => handleKeyUp(e)}
            title={`${gridColumns} ${gridColumns > 1 ? t.columns : t.column}`}
          >
            {Array.from({ length: layoutColumns }, (_, i) => (
              <GenerateLayoutColumnsGrid
                key={i}
                count={i}
                columns={gridColumns}
                setGridColumns={setGridColumns}
                handleSetColumns={handleSetColumns}
              />
            ))}
          </button>
        }
        {!tile.showAlways && (
          <button
            className="btn"
            onClick={handleHideTile}
            title={`${t.hide} ${tile.name}`}
          >
            <Cross />
          </button>
        )}
      </div>
      <div className="pointev-none">{tile.children ? tile.children : tile.name}</div>
    </div>
  ) : (
    <div className={`grid${columns}`}>{tile.children ? tile.children : tile.name}</div>
  );
};
export default Tile;
