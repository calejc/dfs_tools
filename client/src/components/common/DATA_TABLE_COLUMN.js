import { capitalize } from "@mui/material"
import { POSITIONS } from "../../state/lineup"

const BASE_DATA_TABLE_COLUMN = (field, label = null, sortable = true, custom_value_getter = null) => {
  return {
    field: field,
    label: label ? label : capitalize(field),
    sortable: sortable,
    valueGetter: custom_value_getter ? custom_value_getter : (row) => row[field]
  }
}

export const DATA_TABLE_COLUMN = {
  Position: BASE_DATA_TABLE_COLUMN('roster_slot_id', 'Pos', true, (row) => POSITIONS[row.roster_slot_id].label),
  PlayerName: BASE_DATA_TABLE_COLUMN('player', 'Player', false),
  Team: BASE_DATA_TABLE_COLUMN('team'),
  Opponent: BASE_DATA_TABLE_COLUMN('opp'),
  Salary: BASE_DATA_TABLE_COLUMN('salary', 'Salary'),
  BaseProjection: BASE_DATA_TABLE_COLUMN('base'),
  MedianProjection: BASE_DATA_TABLE_COLUMN('median'),
  CeilingProjection: BASE_DATA_TABLE_COLUMN('ceiling'),
  Ownership: BASE_DATA_TABLE_COLUMN('ownership', 'pOwn'),
  OptimalRate: BASE_DATA_TABLE_COLUMN('optimal'),
  BoomRate: BASE_DATA_TABLE_COLUMN('boom'),
  CaptainRate: BASE_DATA_TABLE_COLUMN('cpt_rate', 'CPT Rate'),
  FlexRate: BASE_DATA_TABLE_COLUMN('flex_rate', 'FLEX Rate'),
}

export default DATA_TABLE_COLUMN