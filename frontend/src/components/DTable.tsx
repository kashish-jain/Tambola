import React from "react";
import { render } from "react-dom";

interface DTableProps {
  
  // Dont know if this works
  rows: {
   [name: string]: number | string,
  }[];

  // form functions
  handleChangeHost: (idx: number) => (e: any) => void;
  handleAddRow: () => void;
  handleRemoveRow: () => void;
  handleRemoveSpecificRow: (idx: number) => () => void;
  handleSubmit: (event: any) => void;
}

interface DTableState {}

class DTable extends React.Component<DTableProps, DTableState> {
  constructor(props: DTableProps) {
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
                    <th className="text-center"> Name </th>
                    <th className="text-center"> Mobile </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx}</td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={this.props.rows[idx].name}
                          onChange={this.props.handleChangeHost(idx)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="mobile"
                          value={this.props.rows[idx].mobile}
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
                className="btn btn-primary">
                Add Row
              </button>
              <button 
                type="button"
                onClick={this.props.handleRemoveRow}
                className="btn btn-danger float-right">
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

export default DTable;
