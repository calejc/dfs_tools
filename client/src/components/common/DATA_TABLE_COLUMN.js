import { ROSTER_SLOT_IDS } from "../../util/ROSTER_SLOT_IDS"

const playerValueGetter = (row) => {
  if (ROSTER_SLOT_IDS[row.roster_slot_id] === 'DST') {
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
    valueGetter: (row) => {
      console.log(row)
      return ROSTER_SLOT_IDS[row.roster_slot_id]
    }
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