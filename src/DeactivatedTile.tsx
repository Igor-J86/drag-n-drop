import * as React from "react";
import { Translations } from "./translations";
import { Eye } from "./icons";

type Props = {
  tileName: string;
  disabled?: boolean;
  sortOrder?: number;
  onChangeDisplay?: Function;
  t: Translations;
};

const DeactivatedTile: React.FC<Props> = ({
  tileName,
  disabled,
  sortOrder,
  onChangeDisplay,
  t,
}) => {
  const listItemClass =
    "bg-white pas bshadow flex flex-wrap justify-csb align-ic";

  const handleDisplayChange = () => {
    return onChangeDisplay(true, sortOrder);
  };

  return (
    <li className={`${listItemClass} ${disabled ? "deact" : ""}`}>
      <div className="flex align-ic gas maxs">{tileName}</div>
      {!disabled && (
        <button
          className="btn"
          onClick={handleDisplayChange}
          title={`${t.show} ${tileName}`}
        >
          <Eye />
        </button>
      )}
    </li>
  );
};
export default DeactivatedTile;
