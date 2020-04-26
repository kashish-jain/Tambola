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
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <div className="container">
            <div className="row clearfix">
              <div className="col-md-12 column">
                <table
                  className="table table-bordered table-hover"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center"> # </th>
                      <th className="text-center"> Award Name </th>
                      <th className="text-center"> How Many? </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.awards.map((item, idx) => (
                      <tr id="addr0" key={idx}>
                        <td>{idx}</td>
                        <td>
                          <input
                            type="text"
                            name="nameAward"
                            value={this.props.awards[idx].nameAward}
                            onChange={this.props.handleChangeHost(idx)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="numAward"
                            value={this.props.awards[idx].numAward}
                            onChange={this.props.handleChangeHost(idx)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={this.props.handleRemoveSpecificRow(idx)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={this.props.handleAddRow}
                  className="btn btn-primary"
                >
                  Add Row
                </button>
                <button
                  type="button"
                  onClick={this.props.handleRemoveRow}
                  className="btn btn-danger float-right"
                >
                  Delete Last Row
                </button>
              </div>
            </div>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default ConfigTable;
