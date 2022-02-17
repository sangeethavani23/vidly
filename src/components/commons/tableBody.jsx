import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (row, column) => {
    if (column.content) return column.content(row);
    return _.get(row, column.path);
  };

  createKey = (row, column) => {
    return row._id + (column.path || column.key);
  };

  render() {
    const { rows, columns } = this.props;

    return (
      <tbody>
        {rows.map((row) => (
          <tr key={row._id}>
            {columns.map((column) => (
              <td key={this.createKey(row, column)}>
                {this.renderCell(row, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
