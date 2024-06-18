import * as React from "react";
import { ArrowLeft, ArrowRight, Cross } from "./icons";
import { Translations } from "./translations";
import { TileProps } from "./drag-n-drop";

type Props = {
  tile: TileProps;
  tileId: string;
  name: string;
  counter: number;
  length: number;
  sortOrder: number;
  isConfiguring: boolean;
  isDragging: boolean;
  onChangeSortOrder: Function;
  onChangeDisplay: Function;
  onDragStart: Function;
  onDragEnter: Function;
  onDragLeave: Function;
  onDragEnd: Function;
  onSetColumns: Function;
  columns: number;
  layoutColumns: number;
  t: Translations;
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

const Tile: React.FC<Props> = ({
  tile,
  tileId,
  name,
  counter,
  length,
  sortOrder,
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
}) => {
  const [gridColumns, setGridColumns] = React.useState<number>(columns);

  React.useEffect(() => {
    setGridColumns(columns);
  }, [columns]);

  const handleHideTile = () => {
    onChangeDisplay(false, sortOrder);
  };

  const moveLeft = (e: any) => {
    onChangeSortOrder(e.target.dataset.sortOrder, "left");
  };

  const moveRight = (e: any) => {
    onChangeSortOrder(e.target.dataset.sortOrder, "right");
  };

  const handleDragStart = (e: React.DragEvent<Element>) => {
    onDragStart(e, tile);
  };

  const handleDragEnter = (e: React.DragEvent<Element>) => {
    onDragEnter(e, tile);
  };

  const handleDragLeave = (e: React.DragEvent<Element>) => {
    onDragLeave(e);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent<Element>) => {
    e.preventDefault();
  };

  const handleSetColumns = () => {
    onSetColumns(gridColumns, tileId);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && gridColumns > 1) {
      setGridColumns((prev) => prev - 1);
    }
    if (e.key === "ArrowRight" && gridColumns < layoutColumns) {
      setGridColumns((prev) => prev + 1);
    }
    if (e.key === "Enter" || e.code === "Space") {
      onSetColumns(gridColumns, tileId);
    }
  };

  return isConfiguring ? (
    <div
      className={`tile__config relative${isDragging ? " box-dim" : ""} grid${columns}`}
      draggable={isConfiguring}
      onDragStart={(e: React.DragEvent) => handleDragStart(e)}
      onDragEnter={(e: React.DragEvent) => handleDragEnter(e)}
      onDragEnd={handleDragEnd}
      onDragLeave={(e: React.DragEvent) => handleDragLeave(e)}
      onDragOver={(e: React.DragEvent) => handleDragOver(e)}
    >
      <div
        className={`flex gaxs change-order-btns${isDragging ? " pointev-none" : ""}`}
      >
        {counter! > 1 && (
          <button
            className="btn"
            data-sort-order={sortOrder}
            onClick={moveLeft}
            title={`${t.move} ${name} ${t.toLeft}`}
          >
            <ArrowLeft />
          </button>
        )}
        {counter! < length! && (
          <button
            className="btn"
            data-sort-order={sortOrder}
            onClick={(e) => moveRight(e)}
            title={`${t.move} ${name} ${t.toRight}`}
          >
            <ArrowRight />
          </button>
        )}
      </div>
      <div className={`flex gas absolute display-change${isDragging ? " pointev-none" : ""}`}>
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
        <button
          className="btn"
          onClick={handleHideTile}
          title={`${t.hide} ${name}`}
        >
          <Cross />
        </button>
      </div>
      <div className="pointev-none">{tile.children}</div>
    </div>
  ) : (
    <div className={`grid${columns}`}>{tile.children}</div>
  );
};
export default Tile;
