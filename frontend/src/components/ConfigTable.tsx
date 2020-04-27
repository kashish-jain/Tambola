import React from "react";
import { render } from "react-dom";
import { Award } from "./Config";

interface ConfigTableProps {
  // Dont know if this works
  awards: Award[];

  // form functions
  handleChangeHost: (idx: number) => (e: any) => void;
  handleAddRow: () => void;
  handleRemoveRow: () => void;
  handleRemoveSpecificRow: (idx: number) => () => void;
  handleSubmit: (event: any) => void;
}

interface ConfigTableState {}

class ConfigTable extends React.Component<ConfigTableProps, ConfigTableState> {
  constructor(props: ConfigTableProps) {
    super(props);
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <table className="config-table">
          <thead>
            <tr>
              <th className="award-name-heading"> Award Name </th>
              <th className="award-number-heading"> How Many? </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.awards.map((item, idx) => (
              <tr key={idx}>
                <td className="award-name">
                  <input
                    type="text"
                    name="nameAward"
                    value={this.props.awards[idx].nameAward}
                    onChange={this.props.handleChangeHost(idx)}
                  />
                </td>
                <td className="award-number">
                  <input
                    type="number"
                    name="numAward"
                    value={this.props.awards[idx].numAward}
                    onChange={this.props.handleChangeHost(idx)}
                  />
                </td>
                <td className="cross-button">
                  <button
                    type="button"
                    onClick={this.props.handleRemoveSpecificRow(idx)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttons-container">
          <button
            className="add-row"
            type="button"
            onClick={this.props.handleAddRow}
          >
            Add Row
          </button>
          <button className="start-game" type="submit">
            Start Game
          </button>
        </div>
      </form>
    );
  }
}

export default ConfigTable;
