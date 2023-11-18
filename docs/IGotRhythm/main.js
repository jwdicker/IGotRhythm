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
  CUBE_JUMP_SPD: 2.5,
  CUBE_ACCEL: 0.25,

  SPIKE_SPEED: 1,
  SPIKE_INIT_X: 120,

  SCREEN: vec(100, 100),

  TXT_OFFSET: 5,
}

options = {
  viewSize: G.SCREEN, 
  isShowingScore: false,
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

/**
 * @type { boolean }
 */
let example_turn;

/**
 * @type { boolean[] }
 */
let spike_layout;

/**
 * @type { boolean }
 */
let intro;

/**
 * @type { number }
 */
let curBeat;

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
    spike_layout = [];

    spawning_example = false;

    setLayout();

    intro = true;
    example_turn = false;
  }

  // Draw the grounds
  color("black");
  const exampleLineOffset = G.EXAMPLE_Y + (G.CUBE_SIZE / 2)
  const playerLineOffset = G.PLAYER_Y + (G.CUBE_SIZE / 2);
  line(0, exampleLineOffset, G.SCREEN.x, exampleLineOffset);
  line(0, playerLineOffset, G.SCREEN.x, playerLineOffset);

  // Actions to be performed only on the down and off beats
  if(ticks % (G.TICKS_PER_BEAT / 2) == 0) {
    curBeat = (ticks / G.TICKS_PER_BEAT) % 8;

    // Play the song
    playSong();

    // On only downbeats
    if(curBeat % 1 == 0) {
      // Switch whose turn it is
      if(curBeat == 0 && !intro) {
        example_turn = !example_turn;
      }
      // Generate any spikes
      makeSpikes();

      // Make the example jump when needed
      if(example_turn && spike_layout[curBeat]) {
        play("jump");
        jump(example);
      }
    }
  }

  // Take in player input
  if(input.isJustPressed) {
    play("select", {pitch: 60});
    jump(player);
  }

  // Draw and move the players
  color("cyan");
  text("Watch", G.TXT_OFFSET, G.EXAMPLE_Y - G.TXT_OFFSET);
  moveCube(example);

  color("red");
  text("You", G.TXT_OFFSET, G.PLAYER_Y - G.TXT_OFFSET);
  moveCube(player);

  // Move and draw the spikes
  color("light_black")
  remove(example_wave, (es) => {
    // Move the spike
    es.pos.x -= G.SPIKE_SPEED;

    const endGameTime = char("a", es.pos).isColliding.rect.cyan;
    if(endGameTime) {
      play("explosion");
      end();
    }

    return es.pos.x < 0;
  });

  remove(player_wave, (ps) => {
    // Move the spike
    ps.pos.x -= G.SPIKE_SPEED;

    const endGameTime = char("a", ps.pos).isColliding.rect.red;
    if(endGameTime) {
      play("explosion");
      end();
    }
    return ps.pos.x < 0;
  });
}

// Plays the background song
function playSong () {
  const downBeat = (ticks % G.TICKS_PER_BEAT) == 0
  const offBeat = (ticks % G.TICKS_PER_BEAT) == G.TICKS_PER_BEAT / 2;

  for(let note of Song) {
    if(note.beat == (floor(curBeat) + 1)) {
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

function makeSpikes() {
  const spawnBeat = (curBeat + 2) % 8;
  if(intro && spawnBeat == 0) {
    console.log("begin");
    intro = false;
  }

  if(!intro && spike_layout[spawnBeat]) {
    if(spawning_example) {
      example_wave.push({
        pos: vec(G.SPIKE_INIT_X, G.EXAMPLE_Y),
      });
    } else {
      player_wave.push({
        pos: vec(G.SPIKE_INIT_X, G.PLAYER_Y),
      });
    }
  }

  if(spawnBeat == 7) {
    if(!spawning_example) {
      setLayout();
    }
    spawning_example = !spawning_example;
  }
}

function setLayout() {
  for(let i = 0; i < 8; i++) {
    spike_layout[i] = (rnd() > 0.5);
  }
}