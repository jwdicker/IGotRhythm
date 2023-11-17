title = "I Got Rhythm";

description = `
Press to jump
Avoid pointies
`;

characters = [];

options = {
};

// Universal Constants
const G = {
  TICKS_PER_BEAT: 30,
}

/**
 * @typedef {{
 * pitch: number,
 * beat: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
 * onEighth: boolean,
 * }} Note
 */

/**
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

// Define the song that will play (and repeat after 8 beats)

let count = 0;

function update() {
  // Initialize
  if (!ticks) {

  }

  // Play the song
  playSong()

  if(ticks % G.TICKS_PER_BEAT == 0) {
    // Handle stuff on every beat
  }

  text(count.toString(), 50, 50);
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
