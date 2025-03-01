import * as React from "react";
import Tile from "./Tile";
import DeactivatedTiles from "./DeactivatedTiles";
import { translations } from "./translations";
import DefineLayout from "./DefineLayout";
import { Cog, Info } from "./icons";

export type TileObj = {
  tileId: string;
  sortOrder: number;
  name: string;
  isDisplayed: boolean;
  isAvailable?: boolean;
  hasAccess?: boolean;
  reqSpecificAccess?: boolean;
  showAlways?: boolean;
  children?: React.ReactNode;
  columns: number;
};

type TileConfig = {
  tileId: string;
  sortOrder: number;
  displayed: boolean;
  columns: number;
};

export type TilesDnDProps = {
  /** A unique ID for the drag-n-drop */
  id: string;
  /** List of objects containing necessary data */
  resources: TileObj[];
  /** Type of user */
  isSuperUser?: boolean;
  /** Endpoint for GET/POST methods */
  apiEndpoint?: string;
  /** For controlling layout */
  rootClassName?: string;
  /** The language */
  language?: string;
  /** Show the non-accessible tiles area */
  showDeactivated?: boolean;
  /** A callback function that returns objects with stored data */
  onEdit?: Function;
  /** Save config in localStorage - only if no apiEndpoint is provided */
  saveInBrowser?: boolean;
  /** Placement of the configuration area */
  configurationArea?: "bottom" | "left" | "right";
  /** Display tiles as grid, not flex */
  isGrid?: boolean;
};

export const DragNDrop: React.FC<TilesDnDProps> = ({
  id,
  isSuperUser,
  apiEndpoint,
  resources,
  rootClassName = "ijdnd-area",
  showDeactivated = true,
  onEdit,
  language = "en",
  configurationArea = "bottom",
  saveInBrowser = true,
  isGrid = true,
}) => {
  const dragTile = React.useRef<TileObj>(null);
  const dragNode = React.useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [configuringTiles, setConfiguringTiles] =
    React.useState<boolean>(false);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [noAccessTo, setNoAccessTo] = React.useState<Array<TileObj>>([]);
  const [hiddenTiles, setHiddenTiles] = React.useState<Array<TileObj>>([]);
  const [allTiles, setAllTiles] = React.useState<Array<TileObj>>(resources);
  const [layout, setLayout] = React.useState<number>(4);
  const t = translations[language] ?? translations["nb"];

  const arrangeTilesData = (tilesData: Array<TileObj>) => {
    // Push tiles with access to be displayed to one list,
    // tiles with access to be hidden to another,
    // tiles without regular access to a third
    // and leave out tiles that lack specific access (canaries, warehousing etc.)

    const tiles = [...tilesData];
    let notAccessible: Array<TileObj> = [];
    let accessible: Array<TileObj> = [];
    let hidden: Array<TileObj> = [];

    tiles.map((tile) => {
      if (
        (tile.reqSpecificAccess && tile.hasAccess) ||
        (isSuperUser && !tile.reqSpecificAccess) ||
        (!isSuperUser && !tile.reqSpecificAccess && tile.hasAccess)
      ) {
        if (tile.isDisplayed || tile.showAlways === true) {
          accessible.push(tile);
        } else {
          hidden.push(tile);
        }
      } else if (!tile.reqSpecificAccess) {
        notAccessible.push(tile);
      }
    });

    setNoAccessTo(notAccessible);

    //Set sort order by index
    const updateHiddenTiles = hidden.map((ent: TileObj, index: number) => {
      return { ...ent, sortOrder: index };
    });
    setHiddenTiles(updateHiddenTiles);

    const updateDisplayedTiles = accessible.map(
      (ent: TileObj, index: number) => {
        return { ...ent, sortOrder: index };
      }
    );
    setAllTiles(updateDisplayedTiles);
    setIsLoading(false);
  };

  const saveUserConfig = (tiles: Array<TileObj>) => {
    //Making the array with objects
    const tilesArray: Array<TileConfig> = [];

    tiles.map((tile) => {
      if ((isSuperUser && !tile.reqSpecificAccess) || tile.hasAccess) {
        const tilesObj: TileConfig = {
          tileId: tile.tileId,
          sortOrder: tile.sortOrder,
          displayed: tile.isDisplayed,
          columns: tile.columns,
        };
        tilesArray.push(tilesObj);
      }
    });

    // Save the config via an API endpoint, or in localStorage
    if (apiEndpoint && apiEndpoint !== "") {
      fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(tilesArray),
      }).then((res) => res.json());
    } else if (saveInBrowser) {
      localStorage.setItem(`ijdnd-tiles-${id}`, JSON.stringify(tilesArray));
    }
    if (onEdit) {
      return onEdit(tilesArray);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
    // Get saved tiles config via an API or from localStorage
    const fetchData = async () => {
      let configData = null;
      if (apiEndpoint) {
        try {
          const response = await fetch(apiEndpoint);
          if (response.ok) {
            configData = await response.json();
          } else {
            console.error("Failed to fetch data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        const localData = localStorage.getItem(`ijdnd-tiles-${id}`);
        if (localData) {
          configData = JSON.parse(localData);
        }
      }

      // Sync default tiles config with loaded config
      if (configData && configData.length > 0) {
        let sortOrder: number;
        let isDisplayed: boolean;
        let columns: number;

        const gridLayout = JSON.parse(
          localStorage.getItem("ijdnd-tiles-layout")!
        );
        if (gridLayout) {
          setLayout(+gridLayout);
        }

        const getTilesStatus = (tileId: string) => {
          configData.map((tile: TileConfig) => {
            if (tile.tileId === tileId) {
              sortOrder = tile.sortOrder;
              isDisplayed = tile.displayed;
              columns = tile.columns;
            }
          });
        };
        const tilesData = [...allTiles];
        const updatedUserTiles: Array<TileObj> = tilesData.map((tile) => {
          getTilesStatus(tile.tileId);
          return {
            ...tile,
            sortOrder: sortOrder,
            isDisplayed: isDisplayed,
            columns: columns,
          };
        });

        updatedUserTiles.sort((a, b) => a.sortOrder - b.sortOrder);
        //Treat the fetched tiles
        arrangeTilesData(updatedUserTiles);
      } else {
        //Treat the default tiles
        const tilesData = [...allTiles];
        const sortedTiles: Array<TileObj> = tilesData.sort(
          (a, b) => a.sortOrder - b.sortOrder
        );
        arrangeTilesData(sortedTiles);
        // Storing the default config on first render (?)
        //saveUserConfig(sortedTiles);
      }
    };
    fetchData();
  }, [apiEndpoint]);

  const changeSortOrder = (sortOrder: number, direction: string) => {
    const tiles = [...allTiles];
    const fromIndex = tiles.indexOf(tiles[sortOrder]);
    const obj = tiles.splice(fromIndex, 1)[0];
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;

    tiles.splice(toIndex, 0, obj);
    tiles[fromIndex] = { ...tiles[fromIndex], sortOrder: fromIndex };
    tiles[toIndex] = { ...tiles[toIndex], sortOrder: toIndex };

    setAllTiles(tiles);
    saveUserConfig(tiles.concat(hiddenTiles).concat(noAccessTo));

    const btn = document.querySelector(
      '[data-sort-order="' + toIndex + '"]'
    ) as HTMLButtonElement;
    if (btn) {
      btn.focus();
    }
  };

  const handleDisplayChange = (displayState: boolean, sortOrder: number) => {
    const tiles: Array<TileObj> = [...allTiles];
    const hidden: Array<TileObj> = [...hiddenTiles];

    let obj: TileObj;

    if (displayState === true) {
      obj = hidden.splice(hidden.indexOf(hidden[sortOrder]), 1)[0];
      tiles.splice(tiles.length, 0, obj);
    } else {
      obj = tiles.splice(tiles.indexOf(tiles[sortOrder]), 1)[0];
      hidden.splice(hidden.length, 0, obj);
    }

    const updateDisplayedState = tiles.map((ent: TileObj, index: number) => {
      return { ...ent, sortOrder: index, isDisplayed: true };
    });

    const updateHiddenState = hidden.map((ent: TileObj, index: number) => {
      return { ...ent, sortOrder: index, isDisplayed: false };
    });

    arrangeTilesData(
      updateDisplayedState.concat(updateHiddenState).concat(noAccessTo)
    );
    saveUserConfig(updateDisplayedState.concat(updateHiddenState));
  };

  let count = 0;

  const counter = () => {
    return (count = count + 1);
  };

  const handleDragStart = (e: Event, params: TileObj) => {
    dragTile.current = params;
    if (e.target instanceof HTMLElement) {
      dragNode.current = e.target;
    } else {
      console.error("Target is not an HTMLElement", e.target);
    }
    dragNode.current!.classList.add("box-dragging");

    setDragging(true);
  };

  const handleDragEnd = () => {
    dragNode.current!.classList.remove("box-dragging");
    dragTile.current = undefined;
    dragNode.current = undefined;

    setDragging(false);
    saveUserConfig(allTiles.concat(hiddenTiles).concat(noAccessTo));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.currentTarget.classList.remove("box-dragging");
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLElement>,
    params: TileObj
  ) => {
    e.currentTarget.classList.add("box-dragging");
    if (e.target !== dragNode.current) {
      const currentTile = dragTile.current;
      const tiles = [...allTiles];
      const movingTile = tiles.splice(currentTile!.sortOrder, 1)[0];
      tiles.splice(params.sortOrder, 0, movingTile);

      const updateOrderedState = tiles.map((tile: TileObj, index: number) => {
        return { ...tile, sortOrder: index };
      });
      setAllTiles(updateOrderedState);

      dragNode.current!.classList.remove("box-dragging");
      dragNode.current = e.currentTarget;
      dragTile.current = params;
    }
  };

  const handleSetColumns = (cols: number, tileId: string) => {
    const tiles: Array<TileObj> = [...allTiles];
    const hiddenTilesArr: Array<TileObj> = [...hiddenTiles];

    const updateDisplayedState = tiles.map((tile: TileObj) => {
      if (tile.tileId === tileId) {
        return { ...tile, columns: cols };
      }
      return tile;
    });

    arrangeTilesData(
      updateDisplayedState.concat(hiddenTilesArr).concat(noAccessTo)
    );
    saveUserConfig(updateDisplayedState.concat(hiddenTilesArr));
  };

  const toggleTiles = () => {
    setConfiguringTiles(!configuringTiles);
  };

  const handleSetLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(+e.target.value);
    localStorage.setItem("ijdnd-tiles-layout", JSON.stringify(e.target.value));
  };

  // Update each tile that is stored where number of columns exceeds layout with the number of layout
  React.useEffect(() => {
    const tiles: Array<TileObj> = [...allTiles];
    tiles.map((tile: TileObj) => {
      tile.columns > layout && handleSetColumns(layout, tile.tileId);
    });
  }, [layout, allTiles]);

  return (
    <div
      className={`ijdnd${
        configurationArea === "left"
          ? " config-left"
          : configurationArea === "right"
          ? " config-right"
          : ""
      }`}
    >
      <div className="w100p">
        {configuringTiles &&
          (allTiles.length > 0 ? (
            <p className="flex gaxs align-ic text-note">
              <Info size={18} />
              {t.customizeInfo}
            </p>
          ) : (
            <p>{t.allTilesHidden}</p>
          ))}
        {!isLoading &&
          (allTiles.length > 0 ? (
            <div
              id={id}
              className={
                rootClassName + `${configuringTiles ? " gaxs" : " gam"}${isGrid ? " grid" : " flex flex-wrap"}`
              }
              style={isGrid ? {
                gridTemplateColumns: `repeat(auto-fill,minmax(calc(100% / ${layout} - 1rem), 1fr))`,
              } : {}}
            >
              {allTiles.map(
                (tile: TileObj) =>
                  tile.isAvailable && (
                    <Tile
                      key={tile.tileId}
                      tile={tile}
                      isConfiguring={configuringTiles}
                      counter={counter()}
                      length={allTiles.length}
                      isDragging={dragging}
                      onChangeDisplay={handleDisplayChange}
                      onChangeSortOrder={changeSortOrder}
                      onDragStart={handleDragStart}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                      onSetColumns={handleSetColumns}
                      columns={tile.columns ? tile.columns : 1}
                      layoutColumns={layout}
                      t={t}
                      isGrid={isGrid}
                    />
                  )
              )}
            </div>
          ) : (
            <></>
          ))}
      </div>

      <div
        className={`flex flex-dir-col gas${
          configurationArea === "left" || configurationArea === "right"
            ? " maxw24r"
            : ""
        }`}
      >
        {/* Editing area with lists */}
        {configuringTiles ? (
          <>
            <div className="bg-gray2 flex flex-wrap gal pam">
              <DeactivatedTiles
                hiddenTiles={hiddenTiles}
                noAccessList={noAccessTo}
                isSuperUser={isSuperUser}
                onChangeDisplay={handleDisplayChange}
                t={t}
                showNonAccessible={showDeactivated}
              />
              {isGrid &&
                <DefineLayout
                  handleSetLayout={handleSetLayout}
                  layout={layout}
                  language={language}
                />
              }
            </div>
            <button
              aria-expanded="true"
              aria-controls={id}
              className="btn gaxs"
              type="button"
              onClick={() => {
                toggleTiles();
              }}
            >
              <Cog />
              {t.close}
            </button>
          </>
        ) : (
          <button
            aria-expanded="false"
            aria-controls={id}
            className="btn reveal-slide"
            type="button"
            onClick={() => {
              toggleTiles();
            }}
          >
            <Cog />
            <span className="reveal-hover" tabIndex={-1}>
              {t.configure}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
