NFL_CONTESTS_URL = "https://www.draftkings.com/lobby/getcontests?sport=NFL"
DRAFTGROUPS_URL = "https://api.draftkings.com/draftgroups/v1/draftgroups/{}/draftables"
SLEEPER_API_URL = "https://api.sleeper.app/v1/players/nfl"

DRAFTKINGS_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"

QB_ROSTER_SLOT_ID = 66
RB_ROSTER_SLOT_ID = 67
WR_ROSTER_SLOT_ID = 68
TE_ROSTER_SLOT_ID = 69
FLEX_ROSTER_SLOT_ID = 70
DST_ROSTER_SLOT_ID = 71
SD_CPT_ROSTER_SLOT_ID = 511
SD_FLEX_ROSTER_SLOT_ID = 512

CLASSIC = 1
SHOWDOWN = 96


# Json keys used when parsing API responses
DRAFT_GROUPS = "DraftGroups"
DRAFT_GROUP_ID = "DraftGroupId"
DRAFT_GROUP_DRAFTABLES = "draftables"
DRAFT_GROUP_START_DATE = "StartDate"
DRAFT_GROUP_START_TIME_SUFFIX = "ContestStartTimeSuffix"
DRAFT_GROUP_GAME_TYPE = "GameTypeId"
DRAFT_GROUP_COMPETITIONS = "competitions"

COMPETITION_ID = "competitionId"
COMPETITION_TEAM_ID = "teamId"
COMPETITION_AWAY_TEAM = "awayTeam"
COMPETITION_HOME_TEAM = "homeTeam"
COMPETITION_START_TIME = "startTime"

DRAFTABLE_ID = "draftableId"
DRAFTABLE_SALARY = "salary"
DRAFTABLE_PLAYER_ID = "playerId"
DRAFTABLE_ROSTER_SLOT_ID = "rosterSlotId"
DRAFTABLE_COMPETITION = "competition"
DRAFTABLE_TEAM_ID = "teamId"
