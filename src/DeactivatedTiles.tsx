import * as React from "react";
import DeactivatedTile from "./DeactivatedTile";
import { Translations } from "./translations";

type Tile = {
  tileId: string;
  sortOrder?: number;
  name?: string;
  isAvailable?: boolean;
  hasAccess?: boolean;
  isDisplayed?: boolean;
};

type Props = {
  hiddenTiles: Array<Tile>;
  noAccessList: Array<Tile>;
  onChangeDisplay?: React.FC | Function;
  showNonAccessible: boolean;
  t: Translations;
};

const DeactivatedTiles: React.FC<Props> = ({
  hiddenTiles,
  noAccessList,
  onChangeDisplay,
  showNonAccessible,
  t,
}) => {
  const handleDisplayChange = (displayState: boolean, sortOrder: number) => {
    return onChangeDisplay(displayState, sortOrder);
  };

  return (
    <>
      <div className="maxw24r w100p">
        <h3>{t.hiddenTilesHeading}</h3>
        <p>{t.hiddenTilesInfo}</p>
        <ul className="owlxs">
          {hiddenTiles.map(
            (tile) =>
              tile.isAvailable && (
                <DeactivatedTile
                  key={tile.tileId}
                  sortOrder={tile.sortOrder}
                  tileName={tile.name}
                  onChangeDisplay={handleDisplayChange}
                  t={t}
                />
              ),
          )}
        </ul>
      </div>

      {noAccessList.length > 0 && showNonAccessible ? (
        <div className="maxw20r w100p">
          <h3>{t.noAccessHeading}</h3>
          <p>{t.noAccessInfo}</p>
          <ul className="owlxs">
            {noAccessList.map(
              (tile) =>
                tile.isAvailable && (
                  <DeactivatedTile
                    key={tile.tileId}
                    tileName={tile.name}
                    disabled={true}
                    t={t}
                  />
                ),
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default DeactivatedTiles;
