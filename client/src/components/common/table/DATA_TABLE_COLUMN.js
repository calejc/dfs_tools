import { POSITIONS } from "../../../state/lineup"
import { MIN_MAX } from "./DataTable"
import DataTableColumn from "./DataTableColumn"
import ExcludeButton from "./ExcludeButton"
import ExposureInput from "./ExposureInput"
import LockButton from "./LockButton"
import NumberInputField from "./NumberInputField"
import RemovePlayerButton from "./RemovePlayerButton"

const DATA_TABLE_COLUMN = {
  Position: new DataTableColumn('roster_slot_id', 'Pos', true, (row) => POSITIONS[row.roster_slot_id].label),
  Team: new DataTableColumn(
    'team',
    <></>,
    false,
    (row) => <img height='15' src={row['team']['logo']}></img>,
    null,
    { align: 'center' }
  ),
  PlayerName: new DataTableColumn('player', null, false),
  Opponent: new DataTableColumn(
    'opp',
    null,
    true,
    (row) => row['opp']['abbr'],
    null,
    { align: 'center' }
  ),
  Salary: new DataTableColumn('salary'),
  SalaryShort: new DataTableColumn('salary', 'Sal'),
  Points: new DataTableColumn('pts', null, true, ({ row, projection }) => <span>{row[projection]}</span>),
  BaseProjection: new DataTableColumn('base'),
  MedianProjection: new DataTableColumn('median'),
  CeilingProjection: new DataTableColumn('ceiling'),
  Ownership: new DataTableColumn('ownership', 'pOwn'),
  OptimalRate: new DataTableColumn('optimal'),
  Leverage: new DataTableColumn(
    'leverage',
    null,
    true,
    (row) => <span className={row['leverage'] > 0 ? 'green' : 'red'}>{row['leverage']}</span>
  ),
  BoomRate: new DataTableColumn('boom'),
  Exposure: new DataTableColumn('exposure', '%'),
  Projection: new DataTableColumn(
    'projected',
    'Proj',
    true,
    (row) => <NumberInputField value={row['projected']} disabled={true} onChange={() => void (0)} />
  ),
  RemovePlayer: new DataTableColumn(
    'remove',
    <></>,
    false,
    (row) => <RemovePlayerButton row={row} />
  ),
  MaxExposure: new DataTableColumn(
    'max',
    'Max',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MAX} player={row} />
  ),
  MinExposure: new DataTableColumn(
    'min',
    'Min',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MIN} player={row} />
  ),
  Exclude: new DataTableColumn(
    'exclude',
    <></>,
    false,
    (row) => <ExcludeButton player={row} />
  ),
  Lock: new DataTableColumn(
    'lock',
    <></>,
    false,
    (row) => <LockButton player={row} />
  ),
}

export default DATA_TABLE_COLUMN