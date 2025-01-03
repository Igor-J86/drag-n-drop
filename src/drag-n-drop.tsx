import * as React from "react";
import Tile from "./Tile";
import DeactivatedTiles from "./DeactivatedTiles";
import { translations } from "./translations";
import DefineLayout from "./DefineLayout";
import { Cog, Info } from "./icons";

export type TileProps = {
  entranceId: string;
  name: string;
  sortOrder: number;
  isAvailable?: boolean;
  hasAccess?: boolean;
  isDisplayed?: boolean;
  reqSpecificAccess?: boolean;
  children: React.ReactElement;
  columns: number;
};

export interface DragNDropProps {
  /** Container id */
  id?: string;
  /** Children elements */
  children: any;
  /** Show non-accessible elements */
  showNonAccessible?: boolean;
  /** Root class name */
  rootClassName?: string;
  /** Language */
  language?: string;
  /** An API endpoint for storing config */
  apiEndpoint?: string;
  /** Placement of the configuration area */
  configurationArea?: "bottom" | "left" | "right";
  /** User type */
  isSuperUser?: boolean;
}

type TileObj = {
  entranceId: string;
  sortOrder: number;
  displayed: boolean;
  columns: number;
};

export const DragNDrop: React.FC<DragNDropProps> = ({
  id = "customizableTiles",
  children,
  showNonAccessible,
  rootClassName = "ijdnd-area",
  language = "en",
  configurationArea = "bottom",
  apiEndpoint,
  isSuperUser
}) => {
  const [allTiles, setAllTiles] = React.useState<Array<any>>(children);
  const [noAccessTo, setNoAccessTo] = React.useState<Array<any>>([]);
  const [hiddenTiles, setHiddenTiles] = React.useState<Array<TileProps>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const dragTile: React.MutableRefObject<any> = React.useRef();
  const dragNode: React.MutableRefObject<any> = React.useRef();
  const [configuringTiles, setConfiguringTiles] =
    React.useState<boolean>(false);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [layout, setLayout] = React.useState<number>(4);

  const t = translations[language];

  const saveUserConfig = (tiles: Array<TileProps>) => {
    //Making the array with objects
    const tilesCollection: Array<TileObj> = [];

    tiles.map((tile) => {
      if (isSuperUser && !tile.reqSpecificAccess || tile.hasAccess) {
        const tilesObj: TileObj = {
          entranceId: tile.entranceId,
          sortOrder: tile.sortOrder,
          displayed: tile.isDisplayed!,
          columns: tile.columns,
        };
        tilesCollection.push(tilesObj);
      }
    });

    // Possibility to post the tiles via an API
    if(apiEndpoint) {
      fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(tilesCollection),
      }).then((res) => res.json())
    } else {
      // Storing the tiles data in local storage
      localStorage.setItem("ijdnd-tiles", JSON.stringify(tilesCollection));
    }
  };

  const arrangeTilesData = (tilesData: Array<TileProps>) => {
    // Push tiles with access to be displayed to one list,
    // tiles with access to not be displayed to another,
    // tiles without regular access to a third
    // and leave out tiles that should not be available at all
    const tiles = [...tilesData];
    let notAccessible: Array<TileProps> = [];
    let accessible: Array<TileProps> = [];
    let hiddenTiles: Array<TileProps> = [];

    tiles.map((tile) => {
      if (
        (tile.reqSpecificAccess && tile.hasAccess) ||
        (isSuperUser && !tile.reqSpecificAccess) ||
        (!isSuperUser && !tile.reqSpecificAccess && tile.hasAccess)
      ) {
        if (tile.isDisplayed) {
          accessible.push(tile);
        } else {
          hiddenTiles.push(tile);
        }
      } else if(!tile.reqSpecificAccess) {
        notAccessible.push(tile);
      }
    });

    setNoAccessTo(notAccessible);

    //Set sort order by index
    const updateHiddenTiles = hiddenTiles.map((tile, index) => {
      return { ...tile, sortOrder: index };
    });
    setHiddenTiles(updateHiddenTiles);

    const updateDisplayedTiles = accessible.map((tile, index) => {
      return { ...tile, sortOrder: index };
    });
    setAllTiles(updateDisplayedTiles);
    setIsLoading(false);
  };

  React.useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      // Get stored tiles data from local storage or an API
      let configData = null
      if(apiEndpoint) {
        try {
          const response = await fetch(apiEndpoint)
          if(response.ok) {
            configData = await response.json()
          } else {
            console.error("Faled to fetch data:", response.statusText)
          }
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      } else {
        const localData = localStorage.getItem("ijdnd-tiles")
        if(localData) {
          configData = JSON.parse(localData)
        }
      }

      if (configData && configData.length > 0) {
        let sortOrder: number;
        let isDisplayed: boolean;
        let columns: number;

        const gridLayout = JSON.parse(localStorage.getItem("ijdnd-tiles-layout")!);
        if (gridLayout) {
          setLayout(+gridLayout);
        }

        // Update default tiles data with data from local storage
        const getTilesStatus = (tileId: string) => {
          configData.map((tile: TileObj) => {
            if (tile.entranceId === tileId) {
              sortOrder = tile.sortOrder;
              isDisplayed = tile.displayed;
              columns = tile.columns;
            }
          });
        };
        const tilesData = [...allTiles];
        const updatedUserTiles: Array<TileProps> = tilesData.map((tile, i) => {
          getTilesStatus(tile.props.entranceId);
          return {
            ...tile.props,
            sortOrder: sortOrder,
            isDisplayed: isDisplayed,
            columns: columns,
          };
        });

        updatedUserTiles.sort((a, b) => a.sortOrder - b.sortOrder);
        //Treat the fetched Tiles
        arrangeTilesData(updatedUserTiles);
      } else {
        //Treat the default Tiles
        const tilesData = [...allTiles];
        const sortedTiles: Array<TileProps> = tilesData.map((tile) => {
          return tile.props;
        });
        sortedTiles.sort((a, b) => a.sortOrder - b.sortOrder);
        arrangeTilesData(sortedTiles);
        saveUserConfig(sortedTiles)
      }
    }
    fetchData()
  }, [apiEndpoint]);

  // Change sort order buttons
  const changeSortOrder = (sortOrder: number, direction: string) => {
    const tiles: Array<TileProps> = [...allTiles];
    const fromIndex: number = tiles.indexOf(tiles[sortOrder]);
    const obj: TileProps = tiles.splice(fromIndex, 1)[0];
    const toIndex: number =
      direction === "left" ? fromIndex - 1 : fromIndex + 1;

    tiles.splice(toIndex, 0, obj);
    tiles[fromIndex] = { ...tiles[fromIndex], sortOrder: fromIndex };
    tiles[toIndex] = { ...tiles[toIndex], sortOrder: toIndex };

    arrangeTilesData(tiles.concat(hiddenTiles).concat(noAccessTo));
    saveUserConfig(tiles.concat(hiddenTiles));

    const btn = document.querySelector(
      '[data-sort-order="' + toIndex + '"]',
    ) as HTMLButtonElement;
    if (btn) {
      btn.focus();
    }
  };

  // Hide/show tiles function
  const handleDisplayChange = (displayState: boolean, sortOrder: number) => {
    const tiles: Array<TileProps> = [...allTiles];
    const hiddenTilesArr: Array<TileProps> = [...hiddenTiles];

    let obj: TileProps;

    if (displayState === true) {
      obj = hiddenTilesArr.splice(
        hiddenTilesArr.indexOf(hiddenTilesArr[sortOrder]),
        1,
      )[0];
      tiles.splice(tiles.length, 0, obj);
    } else {
      obj = tiles.splice(tiles.indexOf(tiles[sortOrder]), 1)[0];
      hiddenTilesArr.splice(hiddenTilesArr.length, 0, obj);
    }

    const updateDisplayedState = tiles.map((tile: TileProps, index: number) => {
      return { ...tile, sortOrder: index, isDisplayed: true };
    });

    const updateHiddenState = hiddenTilesArr.map(
      (tile: TileProps, index: number) => {
        return { ...tile, sortOrder: index, isDisplayed: false };
      },
    );

    arrangeTilesData(
      updateDisplayedState.concat(updateHiddenState).concat(noAccessTo),
    );
    saveUserConfig(updateDisplayedState.concat(updateHiddenState));
  };

  // Set columns on tile
  const handleSetColumns = (cols: number, tileId: string) => {
    const tiles: Array<TileProps> = [...allTiles];
    const hiddenTilesArr: Array<TileProps> = [...hiddenTiles];

    const updateDisplayedState = tiles.map((tile: TileProps) => {
      if (tile.entranceId === tileId) {
        return { ...tile, columns: cols };
      }
      return tile;
    });

    arrangeTilesData(
      updateDisplayedState.concat(hiddenTilesArr).concat(noAccessTo),
    );
    saveUserConfig(updateDisplayedState.concat(hiddenTilesArr));
  };

  let count = 0;

  const counter = () => {
    return (count = count + 1);
  };

  const handleDragStart = (e: Event, params: TileProps) => {
    dragTile.current = params;
    dragNode.current = e.target;
    dragNode.current.classList.add("box-dragging");

    setDragging(true);
  };

  const handleDragEnd = () => {
    dragNode.current.classList.remove("box-dragging");
    dragTile.current = null;
    dragNode.current = null;

    arrangeTilesData(allTiles.concat(hiddenTiles).concat(noAccessTo));
    saveUserConfig(allTiles.concat(hiddenTiles));
    setDragging(false);
  };

  const handleDragLeave = (e: any) => {
    e.target.classList.remove("box-dragging");
  };

  const handleDragEnter = (e: any, params: TileProps) => {
    e.target.classList.add("box-dragging");
    if (e.target !== dragNode.current) {
      const currentTile = dragTile.current;
      const tiles = [...allTiles];
      const movingTile = tiles.splice(currentTile.sortOrder, 1)[0];
      tiles.splice(params.sortOrder, 0, movingTile);

      const updateOrderedState: Array<TileProps> = tiles.map(
        (tile: TileProps, index: number) => {
          return { ...tile, sortOrder: index };
        },
      );
      setAllTiles(updateOrderedState);

      dragNode.current.classList.remove("box-dragging");
      dragNode.current = e.target;
      dragTile.current = params;
    }
  };

  const handleSetLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(+e.target.value);
    localStorage.setItem("ijdnd-tiles-layout", JSON.stringify(e.target.value));
  };

  // Update each tile that is stored where number of columns exceeds layout with the number of layout
  React.useEffect(() => {
    const tiles: Array<TileProps> = [...allTiles];
    tiles.map((tile: TileProps) => {
      tile.columns > layout && handleSetColumns(layout, tile.entranceId);
    });
  }, [layout, allTiles]);

  return (
    <div className={`ijdnd${configurationArea === "left" ? " config-left" : configurationArea === "right" ? " config-right" : ""}`}>
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
        {!isLoading && allTiles.length > 0 && (
          <div
            id={id}
            className={rootClassName + `${configuringTiles ? " gaxs" : " gam"}`}
            style={{
              gridTemplateColumns: `repeat(auto-fill,minmax(calc(100% / ${layout} - 1rem), 1fr))`,
            }}
          >
            {allTiles.map(
              (tile: TileProps) =>
                tile.isAvailable && (
                  <Tile
                    key={tile.entranceId}
                    tile={tile}
                    tileId={tile.entranceId}
                    name={tile.name}
                    isConfiguring={configuringTiles}
                    sortOrder={tile.sortOrder}
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
                  />
                ),
            )}
          </div>
        )}
      </div>

      {/* Editing area with lists */}
      <div
        className={`flex flex-dir-col gas${configurationArea === "left" || configurationArea === "right" ? " maxw24r" : ""}`}
      >
        {configuringTiles ? (
          <>
            <div className="bg-gray2 flex flex-wrap gal pam">
              <DeactivatedTiles
                hiddenTiles={hiddenTiles}
                noAccessList={noAccessTo}
                onChangeDisplay={handleDisplayChange}
                isSuperUser={isSuperUser}
                showNonAccessible={showNonAccessible}
                t={t}
              />
              <DefineLayout
                handleSetLayout={handleSetLayout}
                layout={layout}
                language={language}
              />
            </div>
            <button
              aria-expanded="true"
              aria-controls={id}
              className="btn gaxs"
              type="button"
              onClick={() => setConfiguringTiles(!configuringTiles)}
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
            onClick={() => setConfiguringTiles(!configuringTiles)}
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
