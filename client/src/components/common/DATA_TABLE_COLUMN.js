import { POSITIONS } from "../../state/lineup"

const playerValueGetter = (row) => {
  if (POSITIONS[row.roster_slot_id].label === 'DST') {
    return row.player?.nickname || ''
  } else {
    return row.player?.full_name || ''
  }
}

const DATA_TABLE_COLUMN = {
  Position: {
    field: 'roster_slot_id',
    label: 'Position',
    sortable: true,
    valueGetter: (row) => POSITIONS[row.roster_slot_id].label
  },
  PlayerName: {
    field: 'name',
    label: 'Player',
    sortable: false,
    flex: 1,
    valueGetter: (row) => playerValueGetter(row)
  },
  Salary: {
    field: 'salary',
    label: 'Salary',
    sortable: true,
    valueGetter: (row) => row.salary
  }
}

export default DATA_TABLE_COLUMN