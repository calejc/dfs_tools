import { POSITIONS } from "../../state/lineup"

export const playerValueGetter = (row) => {
  if (POSITIONS[row.roster_slot_id].label === 'DST') {
    return row.player?.nickname || ''
  } else {
    return row.player?.full_name || ''
  }
}

export const DATA_TABLE_COLUMN = {
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
    valueGetter: (row) => playerValueGetter(row)
  },
  Salary: {
    field: 'salary',
    label: 'Salary',
    sortable: true,
    valueGetter: (row) => row.salary
  },
  BaseProjection: {
    field: 'base',
    label: 'Base',
    sortable: true,
    valueGetter: (row) => row.base
  },
  MedianProjection: {
    field: 'median',
    label: 'Median',
    sortable: true,
    valueGetter: (row) => row.median
  },
  CeilingProjection: {
    field: 'ceiling',
    label: 'Ceiling',
    sortable: true,
    valueGetter: (row) => row.ceiling
  },
  Ownership: {
    field: 'ownership',
    label: 'pOwn',
    sortable: true,
    valueGetter: (row) => row.ownership
  },
  OptimalRate: {
    field: 'optimal',
    label: 'Optimal',
    sortable: true,
    valueGetter: (row) => row.optimal
  },
  BoomRate: {
    field: 'boom',
    label: 'Boom',
    sortable: true,
    valueGetter: (row) => row.boom
  },
  CaptainRate: {
    field: 'cpt_rate',
    label: 'CPT Rate',
    sortable: true,
    valueGetter: (row) => row.cpt_rate
  },
  FlexRate: {
    field: 'flex_rate',
    label: 'FLEX Rate',
    sortable: true,
    valueGetter: (row) => row.flex_rate
  }
}

export default DATA_TABLE_COLUMN