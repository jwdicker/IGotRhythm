title = "I Got Rhythm";

description = `
Press to jump
Avoid pointies
`;

characters = [];

// Universal Constants
const G = {
  TICKS_PER_BEAT: 30,
  
  EXAMPLE_Y: 30,
  PLAYER_Y: 75,
  
  CUBE_X: 46,
  CUBE_SIZE: 8,
  CUBE_ACCEL: 10,

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
 * speed: number
 * grounded: boolean
 * }} cube
 */

/**
 * @type { cube }
 */
let player;

/**
 * @type { cube }
 */
let example;

function update() {
  // Initialize
  if (!ticks) {
    example = {
      pos: vec(G.CUBE_X, G.EXAMPLE_Y),
      speed: 0,
      grounded: true,
    }

    player = {
      pos: vec(G.CUBE_X, G.PLAYER_Y),
      speed: 0,
      grounded: true,
    }
  }

  // Play the song
  playSong();

  // Draw the grounds
  color("black");
  line(0, G.EXAMPLE_Y + G.CUBE_SIZE, G.SCREEN.x, G.EXAMPLE_Y + G.CUBE_SIZE);
  line(0, G.PLAYER_Y + G.CUBE_SIZE, G.SCREEN.x, G.PLAYER_Y + G.CUBE_SIZE);

  // Draw the players
  color("cyan")
  rect(example.pos, G.CUBE_SIZE);

  color("red")
  rect(player.pos, G.CUBE_SIZE);
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
