import { capitalize, TableCell, TableSortLabel } from "@mui/material"
import '../../../App.css'

const BASE_STYLE = { padding: '2px 6px!important' }

class DataTableColumn {
  constructor(field, label = null, sortable = true, renderCell = null, cellStyle = null, props = {}) {
    this.field = field
    this.label = label ? label : capitalize(field)
    this.sortable = sortable
    this.renderCell = renderCell ? renderCell : (row) => <span>{row[field]}</span>
    this.cellStyle = cellStyle ? cellStyle : BASE_STYLE
    this.props = props
  }

  headerText = (onSort, currSortBy, currSortDir) => {
    if (this.sortable) {
      return <TableSortLabel
        active={currSortBy === this.field}
        className={currSortBy === this.field ? 'active-sort data-table-header' : 'data-table-header'}
        direction={currSortBy === this.field ? currSortDir : 'desc'}
        onClick={() => onSort(this.field)}
      >
        {this.label}
      </TableSortLabel>
    } else {
      return <>{this.label}</>
    }
  }

  renderHeaderCell = (onSort, currSortBy, currSortDir) => {
    return (
      <TableCell
        key={this.field}
        sortDirection={(this.sortable && currSortBy === this.field) ? currSortDir : false}
        sx={{ padding: '2px 6px!important', lineHeight: '16px', fontWeight: 'bold' }}
      >
        {this.headerText(onSort, currSortBy, currSortDir)}
      </TableCell>
    )
  }

  renderCellContents = (row) => {
    return (
      <TableCell
        key={this.field}
        sx={this.cellStyle}
        {...this.props}
      >
        {this.renderCell(row)}
      </TableCell>
    )
  }

}

export default DataTableColumn