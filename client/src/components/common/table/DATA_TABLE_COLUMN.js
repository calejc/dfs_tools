import { capitalize } from "@mui/material"
import { POSITIONS } from "../../../state/lineup"
import ExcludeButton from "./ExcludeButton"
import ExposureInput, { MIN_MAX } from "./ExposureInput"
import LockButton from "./LockButton"
import RemovePlayerButton from "./RemovePlayerButton"

const BASE_STYLE = { padding: '2px 6px!important' }

const BASE_DATA_TABLE_COLUMN = (
  field,
  label = null,
  sortable = true,
  customValueGetter = null,
  cellStyle = BASE_STYLE,
  props = {}
) => {
  return {
    field: field,
    label: label ? label : capitalize(field),
    sortable: sortable,
    valueGetter: customValueGetter ? customValueGetter : (row) => <span>{row[field]}</span>,
    cellStyle: cellStyle,
    props: props
  }
}

export const DATA_TABLE_COLUMN = {
  Position: BASE_DATA_TABLE_COLUMN('roster_slot_id', 'Pos', true, (row) => POSITIONS[row.roster_slot_id].label),
  Team: BASE_DATA_TABLE_COLUMN(
    'team',
    <></>,
    false,
    (row) => <img height='15' src={row['team']['logo']}></img>,
    BASE_STYLE,
    { align: 'center' }
  ),
  PlayerName: BASE_DATA_TABLE_COLUMN('player', null, false),
  Opponent: BASE_DATA_TABLE_COLUMN(
    'opp',
    null,
    true,
    (row) => row['opp']['abbr'],
    BASE_STYLE,
    { align: 'center' }
  ),
  Salary: BASE_DATA_TABLE_COLUMN('salary'),
  SalaryShort: BASE_DATA_TABLE_COLUMN('salary', 'Sal'),
  Points: BASE_DATA_TABLE_COLUMN('pts', null, true, ({ row, projection }) => <>{row[projection]}</>),
  BaseProjection: BASE_DATA_TABLE_COLUMN('base'),
  MedianProjection: BASE_DATA_TABLE_COLUMN('median'),
  CeilingProjection: BASE_DATA_TABLE_COLUMN('ceiling'),
  Ownership: BASE_DATA_TABLE_COLUMN('ownership', 'pOwn'),
  OptimalRate: BASE_DATA_TABLE_COLUMN('optimal'),
  BoomRate: BASE_DATA_TABLE_COLUMN('boom'),
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
}

export default DATA_TABLE_COLUMN