import { capitalize, IconButton } from "@mui/material"
import { POSITIONS } from "../../state/lineup"
import CloseIcon from '@mui/icons-material/Close'

const BASE_DATA_TABLE_COLUMN = (field, label = null, sortable = true, customValueGetter = null, cellStyle = { padding: '2px 6px!important' }) => {
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
    (onClick) => {
      return <IconButton
        color='error'
        sx={{ padding: '0px!important', fontSize: '6px!important' }}
        onClick={onClick}
      >
        <CloseIcon />
      </IconButton>
    },
    { lineHeight: '1px!important', padding: '2px 6px!important' }
  ),
  // MaxExposure: BASE_DATA_TABLE_COLUMN(

  // ),
  // MinExposure: BASE_DATA_TABLE_COLUMN(

  // ),
  // Exclude: BASE_DATA_TABLE_COLUMN(

  // ),
  // Lock: BASE_DATA_TABLE_COLUMN(

  // ),
}

export default DATA_TABLE_COLUMN