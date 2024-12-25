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
  isSuperUser: boolean;
};

const DeactivatedTiles: React.FC<Props> = ({
  hiddenTiles,
  noAccessList,
  onChangeDisplay,
  showNonAccessible,
  t,
  isSuperUser
}) => {
  const handleDisplayChange = (displayState: boolean, sortOrder: number) => {
    return onChangeDisplay(displayState, sortOrder);
  };

  return (
    <>
      <div className="maxw24r w100p">
        <h3>{t.hiddenTilesHeading}</h3>
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

      {!isSuperUser && noAccessList.length > 0 && showNonAccessible ? (
        <div className="maxw20r w100p">
          <h3>{t.noAccessHeading}</h3>
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
