import React from "react";
import { Award } from "./Config";

interface ConfigTableProps {
  awards: Award[];

  // form functions
  handleChangeHost: (idx: number) => (e: any) => void;
  handleAddRow: () => void;
  handleRemoveRow: () => void;
  handleRemoveSpecificRow: (idx: number) => () => void;
  handleSubmit: (event: any) => void;
}

function ConfigTable(props: ConfigTableProps) {
  return (
    <form onSubmit={props.handleSubmit}>
      <table className="config-table">
        <thead>
          <tr>
            <th className="award-name-heading"> Award Name </th>
            <th className="award-number-heading"> How Many? </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {props.awards.map((item, idx) => (
            <tr key={idx}>
              <td className="award-name">
                <input
                  type="text"
                  name="nameAward"
                  placeholder="Enter Award Name"
                  value={props.awards[idx].nameAward}
                  onChange={props.handleChangeHost(idx)}
                />
              </td>
              <td className="award-number">
                <input
                  type="number"
                  name="numAward"
                  placeholder="Enter Number of Awards"
                  min="1"
                  value={props.awards[idx].numAward}
                  onChange={props.handleChangeHost(idx)}
                />
              </td>
              <td className="cross-button">
                <button
                  type="button"
                  onClick={props.handleRemoveSpecificRow(idx)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons-container">
        <button className="add-row" type="button" onClick={props.handleAddRow}>
          Add Award
        </button>
        <button className="start-game" type="submit">
          Start Game
        </button>
      </div>
    </form>
  );
}

export default ConfigTable;
