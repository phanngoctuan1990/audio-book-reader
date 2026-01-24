/**
 * Radio Service - Internet Radio Streaming
 * Minimal implementation for radio station streaming
 */

// Radio stations data organized by genre and mood
const RADIO_STATIONS = {
  genres: {
    chill: [
      {
        id: "chill-1",
        name: "SomaFM Groove Salad",
        url: "https://ice1.somafm.com/groovesalad-128-mp3",
        genre: "chill",
        description: "A nicely chilled plate of ambient/downtempo beats",
      },
      {
        id: "chill-2",
        name: "ChillHop Radio",
        url: "https://streams.ilovemusic.de/iloveradio17.mp3",
        genre: "chill",
        description: "Lo-fi hip hop beats to relax/study to",
      },
    ],
    lofi: [
      {
        id: "lofi-1",
        name: "LoFi Hip Hop Radio",
        url: "https://streams.ilovemusic.de/iloveradio17.mp3",
        genre: "lofi",
        description: "Chill beats for studying and relaxing",
      },
      {
        id: "lofi-2",
        name: "SomaFM DEF CON",
        url: "https://ice1.somafm.com/defcon-128-mp3",
        genre: "lofi",
        description: "Music for hacking",
      },
    ],
    jazz: [
      {
        id: "jazz-1",
        name: "SomaFM Jazz",
        url: "https://ice1.somafm.com/sonicuniverse-128-mp3",
        genre: "jazz",
        description: "Transcending the pointed note",
      },
      {
        id: "jazz-2",
        name: "Smooth Jazz Radio",
        url: "https://streaming.radio.co/s774887f7b/listen",
        genre: "jazz",
        description: "Smooth jazz 24/7",
      },
    ],
    classical: [
      {
        id: "classical-1",
        name: "Classical Radio",
        url: "https://ice1.somafm.com/dronezone-128-mp3",
        genre: "classical",
        description: "Atmospheric ambient space music",
      },
    ],
    ambient: [
      {
        id: "ambient-1",
        name: "SomaFM Drone Zone",
        url: "https://ice1.somafm.com/dronezone-128-mp3",
        genre: "ambient",
        description: "Served best chilled, safe with most medications",
      },
      {
        id: "ambient-2",
        name: "SomaFM Deep Space One",
        url: "https://ice1.somafm.com/deepspaceone-128-mp3",
        genre: "ambient",
        description: "Deep ambient electronic",
      },
    ],
    electronic: [
      {
        id: "electronic-1",
        name: "SomaFM Space Station",
        url: "https://ice1.somafm.com/spacestation-128-mp3",
        genre: "electronic",
        description: "Tune in, turn on, space out",
      },
    ],
  },
  moods: {
    focus: ["chill-1", "lofi-1", "ambient-1", "ambient-2"],
    happy: ["electronic-1", "jazz-1"],
    relaxing: ["chill-1", "chill-2", "ambient-1", "jazz-2"],
    energetic: ["electronic-1"],
    sleep: ["ambient-1", "ambient-2", "classical-1"],
  },
};

// Genre list for UI
export const GENRES = [
  "chill",
  "lofi",
  "jazz",
  "classical",
  "ambient",
  "electronic",
];

// Mood list for UI
export const MOODS = ["focus", "happy", "relaxing", "energetic", "sleep"];

/**
 * Get all stations as flat array
 * @returns {Array} All radio stations
 */
export function getAllStations() {
  const stations = [];
  Object.values(RADIO_STATIONS.genres).forEach((genreStations) => {
    stations.push(...genreStations);
  });
  return stations;
}

/**
 * Get stations by genre
 * @param {string} genre - Genre name
 * @returns {Array} Stations matching the genre
 */
export function getStationsByGenre(genre) {
  return RADIO_STATIONS.genres[genre] || [];
}

/**
 * Get stations by mood
 * @param {string} mood - Mood name
 * @returns {Array} Stations matching the mood
 */
export function getStationsByMood(mood) {
  const stationIds = RADIO_STATIONS.moods[mood] || [];
  const allStations = getAllStations();
  return allStations.filter((station) => stationIds.includes(station.id));
}

/**
 * Get station by ID
 * @param {string} id - Station ID
 * @returns {Object|null} Station object or null
 */
export function getStationById(id) {
  const allStations = getAllStations();
  return allStations.find((station) => station.id === id) || null;
}

/**
 * Filter stations by genre and/or mood
 * @param {string|null} genre - Genre filter
 * @param {string|null} mood - Mood filter
 * @returns {Array} Filtered stations
 */
export function filterStations(genre, mood) {
  if (genre && mood) {
    const genreStations = getStationsByGenre(genre);
    const moodStationIds = RADIO_STATIONS.moods[mood] || [];
    return genreStations.filter((station) =>
      moodStationIds.includes(station.id),
    );
  }

  if (genre) {
    return getStationsByGenre(genre);
  }

  if (mood) {
    return getStationsByMood(mood);
  }

  return getAllStations();
}
