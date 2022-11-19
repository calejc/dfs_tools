import { capitalize } from "@mui/material"
import { POSITIONS } from "../../../state/lineup"
import ExcludeButton from "./ExcludeButton"
import ExposureInput, { MIN_MAX } from "./ExposureInput"
import LockButton from "./LockButton"
import RemovePlayerButton from "./RemovePlayerButton"

const BASE_DATA_TABLE_COLUMN = (
  field,
  label = null,
  sortable = true,
  customValueGetter = null,
  cellStyle = { padding: '2px 6px!important' }
) => {
  return {
    field: field,
    label: label ? label : capitalize(field),
    sortable: sortable,
    valueGetter: customValueGetter ? customValueGetter : (row) => <>{row[field]}</>,
    cellStyle: cellStyle
  }
}

export const DATA_TABLE_COLUMN = {
  Position: BASE_DATA_TABLE_COLUMN('roster_slot_id', 'Pos', true, (row) => POSITIONS[row.roster_slot_id].label),
  PlayerName: BASE_DATA_TABLE_COLUMN('player', 'Player', false),
  Team: BASE_DATA_TABLE_COLUMN('team'),
  Opponent: BASE_DATA_TABLE_COLUMN('opp'),
  Salary: BASE_DATA_TABLE_COLUMN('salary'),
  SalaryShort: BASE_DATA_TABLE_COLUMN('salary', 'Sal'),
  Points: BASE_DATA_TABLE_COLUMN('pts', 'Pts', true, ({ row, projection }) => <>{row[projection]}</>),
  BaseProjection: BASE_DATA_TABLE_COLUMN('base'),
  MedianProjection: BASE_DATA_TABLE_COLUMN('median'),
  CeilingProjection: BASE_DATA_TABLE_COLUMN('ceiling'),
  Ownership: BASE_DATA_TABLE_COLUMN('ownership', 'pOwn'),
  OptimalRate: BASE_DATA_TABLE_COLUMN('optimal'),
  BoomRate: BASE_DATA_TABLE_COLUMN('boom'),
  CaptainRate: BASE_DATA_TABLE_COLUMN('cpt_rate', 'CPT Rate'),
  FlexRate: BASE_DATA_TABLE_COLUMN('flex_rate', 'FLEX Rate'),
  RemovePlayer: BASE_DATA_TABLE_COLUMN(
    'remove',
    <></>,
    false,
    (row) => <RemovePlayerButton row={row} />
  ),
  MaxExposure: BASE_DATA_TABLE_COLUMN(
    'max',
    'Max',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MAX} player={row} />
  ),
  MinExposure: BASE_DATA_TABLE_COLUMN(
    'min',
    'Min',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MIN} player={row} />
  ),
  Exclude: BASE_DATA_TABLE_COLUMN(
    'exclude',
    <></>,
    false,
    (row) => <ExcludeButton player={row} />
  ),
  Lock: BASE_DATA_TABLE_COLUMN(
    'lock',
    <></>,
    false,
    (row) => <LockButton player={row} />
  ),
  // Boost: BASE_DATA_TABLE_COLUMN(

  // )
}

export default DATA_TABLE_COLUMN