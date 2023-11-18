title = "I Got Rhythm";

description = `
Press to jump
Avoid pointies
`;

characters = [
`
  l
  l
 lll
 lll
lllll
lllll
`
];

// Universal Constants
const G = {
  TICKS_PER_BEAT: 30,
  
  EXAMPLE_Y: 30,
  PLAYER_Y: 75,
  
  CUBE_X: 50,
  CUBE_SIZE: 8,
  CUBE_JUMP_SPD: 4,
  CUBE_ACCEL: 1,

  SPIKE_SPEED: 3,
  SPIKE_INIT_X: 100,

  SCREEN: vec(100, 100),
}

options = {
  viewSize: G.SCREEN, 
};

/**
 * @typedef {{
 * pitch: number,
 * beat: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
 * onEighth: boolean,
 * }} Note
 */

/**
 * The song that will play
 * @type { Note[] }
 */
const Song = [
  {
    pitch: 48,
    beat: 1,
    onEighth: false
  },
  {
    pitch: 43,
    beat: 2,
    onEighth: false
  },
  {
    pitch: 48,
    beat: 3,
    onEighth: false
  },
  {
    pitch: 43,
    beat: 4,
    onEighth: false
  },
  {
    pitch: 48,
    beat: 5,
    onEighth: false
  },
  {
    pitch: 43,
    beat: 6,
    onEighth: false
  },
  {
    pitch: 48,
    beat: 7,
    onEighth: false
  },
  {
    pitch: 43,
    beat: 7,
    onEighth: true
  },
  {
    pitch: 45,
    beat: 8,
    onEighth: false
  },
  {
    pitch: 47,
    beat: 8,
    onEighth: true
  },
]

/**
 * @typedef {{
 * pos: Vector
 * initY: number
 * speed: number
 * grounded: boolean
 * }} Cube
 */

/**
 * @type { Cube }
 */
let player;

/**
 * @type { Cube }
 */
let example;

/**
 * @typedef {{
 * pos: Vector
 * }} Spike
 */

/**
 * @type { Spike[] }
 */
let example_wave;

/**
 * @type { Spike[] }
 */
let player_wave;

/**
 * @type { boolean }
 */
let spawning_example;

function update() {
  // Initialize
  if (!ticks) {
    example = {
      pos: vec(G.CUBE_X, G.EXAMPLE_Y),
      initY: G.EXAMPLE_Y,
      speed: 0,
      grounded: true,
    }

    player = {
      pos: vec(G.CUBE_X, G.PLAYER_Y),
      initY: G.PLAYER_Y,
      speed: 0,
      grounded: true,
    }

    example_wave = [];
    player_wave = [];

    spawning_example = true;
  }

  // Play the song
  // playSong();

  // Draw the grounds
  color("black");
  const exampleLineOffset = G.EXAMPLE_Y + (G.CUBE_SIZE / 2)
  const playerLineOffset = G.PLAYER_Y + (G.CUBE_SIZE / 2);
  line(0, exampleLineOffset, G.SCREEN.x, exampleLineOffset);
  line(0, playerLineOffset, G.SCREEN.x, playerLineOffset);

  // Take in player input
  if(input.isJustPressed) {
    jump(player);
  }

  // Draw and move the players
  color("cyan");
  moveCube(example);

  color("red");
  moveCube(player);

  // Move and draw the spikes
  color("light_black")
  example_wave.forEach((es) => {
    // Move the spike
    es.pos.x -= G.SPIKE_SPEED;

    const endGameTime = char("a", es.pos).isColliding.rect.cyan;
    if(endGameTime) {
      end();
    }
  });

  player_wave.forEach((ps) => {
    // Move the spike
    ps.pos.x -= G.SPIKE_SPEED;

    const endGameTime = char("a", ps.pos).isColliding.rect.red;
    if(endGameTime) {
      end();
    }
  });
}

// Plays the background song
function playSong () {
  const curBeat = (floor(ticks / G.TICKS_PER_BEAT) % 8) + 1;
  const downBeat = (ticks % G.TICKS_PER_BEAT) == 0
  const offBeat = (ticks % G.TICKS_PER_BEAT) == G.TICKS_PER_BEAT / 2;

  for(let note of Song) {
    if(note.beat == curBeat) {
      if((note.onEighth && offBeat) || (!note.onEighth && downBeat)) {
        play("coin", {pitch: note.pitch, volume: 0.5});
      }
    }
  }
}

/**
 * Causes a cube to jump
 * @param {Cube} c The cube that will jump
 */
function jump(c) {
  if(c.grounded) {
    c.speed = G.CUBE_JUMP_SPD;
    c.grounded = false;
    c.pos.y -= c.speed;
  }
}

/**
 * Handles the tick-by-tick movement of the given cube. Also draws the cube
 * @param {Cube} c 
 */
function moveCube(c) {
  if(!c.grounded) {
    if(c.pos.y > c.initY) {
      c.pos.y = c.initY;
      c.grounded = true;
    } else {
      c.pos.y -= c.speed;
      c.speed -= G.CUBE_ACCEL;
    }
  }

  box(c.pos, G.CUBE_SIZE);
}