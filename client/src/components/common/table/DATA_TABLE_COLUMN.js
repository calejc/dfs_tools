import { POSITIONS } from "../../../state/lineup"
import DataTableColumn from "./DataTableColumn"
import { MIN_MAX } from "../../../shared/CONSTANTS"
import ExcludeButton from "./ExcludeButton"
import ExposureInput from "./ExposureInput"
import LockButton from "./LockButton"
import NumberInputField from "./NumberInputField"
import RemovePlayerButton from "./RemovePlayerButton"

const DATA_TABLE_COLUMN = {
  Position: new DataTableColumn('roster_slot_id', null, 'Pos', true, (row) => POSITIONS[row.roster_slot_id].label),
  Team: new DataTableColumn(
    'team',
    (row) => row['team']['logo'],
    <></>,
    false,
    (row) => <img height='15' src={row['team']['logo']}></img>,
    null,
    { align: 'center' }
  ),
  PlayerName: new DataTableColumn('player', null, false),
  Opponent: new DataTableColumn(
    'opp',
    (row) => row['opp']['abbr'],
    null,
    true,
    (row) => row['opp']['abbr'],
    null,
    { align: 'center' }
  ),
  Salary: new DataTableColumn('salary'),
  SalaryShort: new DataTableColumn('salary', null, 'Sal'),
  Points: new DataTableColumn(
    'pts',
    ({ row, projection }) => row[projection],
    null,
    true,
    ({ row, projection }) => <span>{row[projection]}</span>
  ),
  BaseProjection: new DataTableColumn('base'),
  MedianProjection: new DataTableColumn('median'),
  CeilingProjection: new DataTableColumn('ceiling'),
  Ownership: new DataTableColumn('ownership', null, 'pOwn'),
  OptimalRate: new DataTableColumn('optimal'),
  Leverage: new DataTableColumn(
    'leverage',
    null,
    null,
    true,
    (row) => <span className={row['leverage'] > 0 ? 'green' : 'red'}>{row['leverage']}</span>
  ),
  BoomRate: new DataTableColumn('boom'),
  Exposure: new DataTableColumn('exposure', null, '%'),
  Projection: new DataTableColumn(
    'projected',
    null,
    'Proj',
    true,
    (row) => <NumberInputField value={row['projected']} disabled={true} onChange={() => void (0)} />
  ),
  RemovePlayer: new DataTableColumn(
    'remove',
    (row) => row?.value?.id,
    <></>,
    false,
    (row) => <RemovePlayerButton row={row} />
  ),
  MaxExposure: new DataTableColumn(
    MIN_MAX.MAX,
    null,
    'Max',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MAX} player={row} />
  ),
  MinExposure: new DataTableColumn(
    MIN_MAX.MIN,
    null,
    'Min',
    false,
    (row) => <ExposureInput minMax={MIN_MAX.MIN} player={row} />
  ),
  Exclude: new DataTableColumn(
    'exclude',
    () => null,
    <></>,
    false,
    (row) => <ExcludeButton player={row} />
  ),
  Lock: new DataTableColumn(
    'lock',
    () => null,
    <></>,
    false,
    (row) => <LockButton player={row} />
  ),
}

export default DATA_TABLE_COLUMN