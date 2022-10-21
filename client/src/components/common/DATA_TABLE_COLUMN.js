import { ROSTER_SLOT_IDS } from "../../util/rosterSlotToPositionAbbr"

const playerValueGetter = (params) => {
  if (ROSTER_SLOT_IDS[params.row.roster_slot_id] === 'DST') {
    // TODO: need to join Team entity on draftable response object, render Team Name here
    return ''
  } else {
    return params.row.player?.full_name || ''
  }
}


const DATA_TABLE_COLUMN = {
  Position: {
    field: 'roster_slot',
    headerName: 'Position',
    sortable: true,
    flex: 1,
    valueGetter: (params) => ROSTER_SLOT_IDS[params.row.roster_slot_id]
  },
  PlayerName: {
    field: 'name',
    headerName: 'Player',
    sortable: true,
    flex: 1,
    valueGetter: (params) => playerValueGetter(params)
  },
  Salary: {
    field: 'salary',
    headerName: 'Salary',
    sortable: true,
    flex: 1,
  }
}

export default DATA_TABLE_COLUMN