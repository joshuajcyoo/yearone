export const initialGridData = [
  {
    id: 0,
    icon: "🍕", // The icon shown initially
    initialPhoto: "/Images/oneyear1.jpg",
    clue: "Where we had our first slice together.", // The text shown if they go back without a photo
    letter: "W", // The secret letter revealed after upload
    photo: null, // This will hold the uploaded image URL
    isRevealed: false, // Has the user clicked this yet?
  },
  {
    id: 1,
    icon: "🌳",
    initialPhoto: "/Images/oneyear1.jpg",
    clue: "Find the tree that looks like a high five.",
    letter: "I",
    photo: null,
    isRevealed: false,
  },
  {
    id: 2,
    icon: "☕",
    initialPhoto: "/Images/oneyear1.jpg",
    clue: "Your favorite morning pick-me-up spot.",
    letter: "L",
    photo: null,
    isRevealed: false,
  },
  // ... You can copy/paste this object 22 more times to get your 25 squares
  // For testing, just having 3-5 is fine!
];