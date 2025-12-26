export const initialGridData = [
  {
    id: 0,
    icon: "🍕", // The icon shown initially
    type: "image",
    initialPhoto: "/Media/y1_bumsan.jpg",
    clue: "A photo of ice cream.",
    description: "",
    letter: "W", // The secret letter revealed after upload
    photo: null, // This will hold the uploaded image URL
    isRevealed: false, // Has the user clicked this yet?
    revealToggle: false
  },
  {
    id: 1,
    icon: "🌳",
    type: "video",
    initialPhoto: "/Media/y1_gacha.mp4",
    clue: "A photo of any gacha item.",
    description: "",
    letter: "I",
    photo: null,
    isRevealed: false,
    revealToggle: false
  },
  {
    id: 2,
    icon: "☕",
    type: "image",
    initialPhoto: "/Media/y1_scrabble.jpg",
    clue: "A photo of a board game.",
    description: "",
    letter: "L",
    photo: null,
    isRevealed: false,
    revealToggle: false
  },
  {
    id: 3,
    icon: "☕",
    type: "video",
    initialPhoto: "/Media/y1_fit.mp4",
    clue: "A photo of your fit.",
    description: "",
    letter: "L",
    photo: null,
    isRevealed: false,
    revealToggle: false
  },
  {
    id: 4,
    icon: "☕",
    type: "image",
    initialPhoto: "/Media/y1_skincare.jpg",
    clue: "A photo of a skincare product.",
    description: "",
    letter: "L",
    photo: null,
    isRevealed: false,
    revealToggle: false
  },
  // ... You can copy/paste this object 22 more times to get your 25 squares
  // For testing, just having 3-5 is fine!
];