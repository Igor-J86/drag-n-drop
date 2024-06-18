import * as React from "react";
import { translations } from "./translations";

type SetLayout = {
  handleSetLayout: Function;
  layout: number;
  language: string;
};

const DefineLayout: React.FC<SetLayout> = ({
  handleSetLayout,
  layout,
  language,
}) => {
  const t = translations[language] ?? translations["nb"];
  return (
    <div className="maxw20r w100p">
      <h3>{t.layoutHeading}</h3>
      <p>{t.layoutInfo}</p>
      <label className="form__label" htmlFor="layoutColumns">
        {t.columnsLabel}
      </label>
      <select
        className="form__control maxwmaxc"
        id="layoutColumns"
        onChange={(e) => handleSetLayout(e)}
        defaultValue={layout}
      >
        <option value={1}>1 {t.column}</option>
        <option value={2}>2 {t.columns}</option>
        <option value={3}>3 {t.columns}</option>
        <option value={4}>4 {t.columns}</option>
        <option value={5}>5 {t.columns}</option>
        <option value={6}>6 {t.columns}</option>
      </select>
    </div>
  );
};

export default DefineLayout;
