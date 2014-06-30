SCREEN_WIDTH = 640;
SCREEN_HEIGHT = 480;

SCREEN_OFFSET_RECENTLYSTOLEN = new Phaser.Point(400, SCREEN_HEIGHT - 40);
RECENTLYSTOLEN_MAX = 5;

SPEED_WALKING = 8;
SPEED_RUNNING = 14;

TILE_WIDTH = 32;
TILE_HEIGHT = 32;

// Millisecond durations per tweens, per tile
TWEEN_DURATION_PERPIXEL_RUNNING = 6;
TWEEN_DURATION_PERPIXEL_WALKING = 12;
TWEEN_DURATION_PERTILE_RUNNING = TWEEN_DURATION_PERPIXEL_RUNNING * 32;
TWEEN_DURATION_PERTILE_WALKING = TWEEN_DURATION_PERPIXEL_WALKING * 32;

DAYLIGHT_TIMER_TOTALTIME = (9 * 60 * 60 * 1000);
DAYLIGHT_TIMER_REPEAT = 1000 / 20;
DAYLIGHT_TIMER_REPEATCOUNT = (DAYLIGHT_TIMER_TOTALTIME / DAYLIGHT_TIMER_REPEAT ) + 1;

STATE_NONE = 0;
STATE_UNAWARE = 1 << 1;
STATE_CONCERNED = 1 << 2;
STATE_ALERTED = 1 << 3;
STATE_LOSTHIM = 1 << 4;

STATE_RUNNING = 1 << 5;
STATE_FACE_LEFT = 1 << 6;
STATE_FACE_RIGHT = 1 << 7;
STATE_FACE_UP = 1 << 8;
STATE_FACE_DOWN = 1 << 9;
STATE_MOVING = 1 << 10;

STATE_RUNNINGTOLIGHT = 1 << 11;
STATE_RUNNINGTOREPORT = 1 << 12;
STATE_LOOKINGFORTARGET = 1 << 13;
STATE_STEALING = 1 << 13;

STATES_AWARENESS = (STATE_UNAWARE | STATE_CONCERNED | STATE_ALERTED | STATE_LOSTHIM);
STATES_MOVEMENT = (STATE_MOVING | STATE_RUNNING);
STATES_FACE = (STATE_FACE_LEFT | STATE_FACE_RIGHT | STATE_FACE_DOWN | STATE_FACE_UP);

SPRITE_TOWNSFOLK_MALE = 1;
SPRITE_TOWNSFOLK_FEMALE = 2;
SPRITE_TOWNSFOLK_GUARD = 3;

SPRITE_TOWNSFOLK_MALE1 = 1;
SPRITE_TOWNSFOLK_MALE2 = 2;
SPRITE_TOWNSFOLK_MALE3 = 3;
SPRITE_TOWNSFOLK_MALE4 = 4;

SPRITE_TOWNSFOLK_FEMALE1 = 5;
SPRITE_TOWNSFOLK_FEMALE2 = 6;
SPRITE_TOWNSFOLK_FEMALE3 = 7;
SPRITE_TOWNSFOLK_FEMALE4 = 8;

SPRITE_TOWNSFOLK_GUARD1 = 9;
SPRITE_TOWNSFOLK_GUARD2 = 10;

SCORE_PERSECOND = 1;
SCORE_LOSTHIM = 0;
SCORE_ALERTED = -50;
SCORE_CONCERNED = 0;

MAX_TREASURES = 384;
TREASURE_SHEET_WIDTH = 16;

STEAL_DISTANCE = 16;
