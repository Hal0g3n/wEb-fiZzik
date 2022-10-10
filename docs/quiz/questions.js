
export const questions = [

  0,

  { // 1: 
    question: "How big are neutron stars?",
    choices: [
      "Around the size of a neutron, of course",
      "Around the size of the Sun",
      "Around the size of the Earth",
      "Around the size of a city",
      "Around the size of a neutral party",
    ],
    answer: 4,
    author: "Yu Pin",
  },
  
  { // 2: Yu Pin
    question: "What is spaghetti? (think of what you learnt)",
    choices: [
      "Long, thin, cylindrical noodles",
      "Long rods of nucleons",
      "The code of this website",
      "An astronaut falling into a black hole",
      "When nuclei are squeezed until they touch fully",
    ],
    answer: 2,
    author: "Yu Pin",
  },
  
  { // 3: Yu Pin
    question: "Which of the following is true about neutron stars?",
    choices: [
      "They spin as fast as neutrons",
      "They are as dense as neutrons",
      "They are as hot as neutrons",
      "They are as large as neutrons",
      "They are as small as neutrons",
    ],
    answer: 2,
    author: "Yu Pin",
  },
  
  { // 4: Yu Pin
    question: "When 2 neutron stars merge, what can't form?",
    choices: [
      "A neutron star",
      "A black hole",
      "A big explosion",
      "A white dwarf",
      "Heavy elements",
    ],
    answer: 4,
    author: "Yu Pin",
  },
  
  { // 5: Yu Pin
    question: "Which one is least likely to exist in neutron stars?",
    choices: [
      "Iron",
      "Neutrons",
      "Plutonium",
      "Anti-gnocchi",
      "An atmosphere",
    ],
    answer: 3,
    author: "Yu Pin",
  },
  
  { // 6: Vikram?
    question: "Neutron stars are interesting. Why?",
    choices: [
      "They are the smoothest objects in the universe",
      "They are aggressively lethal to humans",
      "They have the most durable pasta in the universe",
      "They are way hotter than the Sun",
      "All of the above",
    ],
    answer: 5,
    author: "Vikram",
  },
  
  { // 7: Vikram?
    question: "Neutron stars are not fun. Why?",
    choices: [
      "They can sterilise the area around them",
      "They are aggressively lethal to humans",
      "They have very strong magnetic fields",
      "They are way hotter than the Sun",
      "All of the above",
    ],
    answer: 5,
    author: "Vikram",
  },
  
  { // 8: Vikram
    question: "What might neutron star cores contain?",
    choices: [
      "A Bose-Einstein condensate",
      "Protons",
      "Quark-gluon plasma",
      "Nuclear pasta",
      "Elemental iron",
    ],
    answer: 3,
    author: "Vikram",
  },
  
  { // 9: Vikram
    question: "What are neutrons made of?",
    choices: [
      "Three quarks and three gluons",
      "Superfluid plasma",
      "Three mesons",
      "Two down quarks and an up quark",
      "An electron and a proton",
    ],
    answer: 4,
    author: "Vikram",
  },
  
  { // 10: Vikram
    question: "When are neutron stars born?",
    choices: [
      "When a small star runs out of energy",
      "When a medium star runs out of heat",
      "When a huge star runs out of fuel",
      "When a supergiant star collides with another star",
      "When a white dwarf flickers out",
    ],
    answer: 3,
    author: "Vikram",
  },
  
  { // 11: Yuan Xi
    question: "Can neutron stars produce energy?",
    choices: [
      "Yes. They are stars after all", // Flawed understanding of stars
      "No. They are just hot balls of neutrons", // The true answer
      "Yes. Energy is released when electrons and protons fuse", // Only occurs during formation, not relevant
      "No. Instead, they absorb energy from the surroundings to keep them glowing", // This is just wrong, they lose heat energy to the surrounding anyways
      "Yes. The hot neutron star undergoes Black Body Radiation, producing energy", // Black Body Radiation doesn't produce energy :angry:
    ],
    answer: 2,
    author: "Yuan Xi", // Uh yuan xi we didn't teach this (yes, we didn't)
  },

  { // 12: Yuan Xi
    question: "What is Pauli's Exclusion Principle?",
    choices: [
      "No 2 fermions can be in the same quantum state", // The true answer
      "We must exclude neutron stars from classical physics", // Wrong kind of exclusion
      "Like charges will repel each other", // Repulsion due to Coulomb's Law
      "For all objects, there exist an anti version of it", // What even, this is not factually correct
      "The many universes in the multiverse will never interact", // Part of multiverse theory, but is just not exclusion
    ],
    answer: 1,
    author: "Yuan Xi",
  },

  { // 13: Kenneth
    question: "Which star can form neutron stars on death?",
    choices: [
      "Proxima Centauri (~0.12 solar masses)",
      "The Sun (1 solar mass)",
      "Alpha Centauri (~1.1 solar masses)",
      "Betelgeuse (~11 solar masses)",
      "Zeta Puppis (~56.1 solar masses)",
    ],
    answer: 5,
    author: "Kenneth",
  },
  
  { // 14: Kenneth
    question: "Which quark is the most stable?",
    choices: [
      "Strange quark",
      "Up quark",
      "Left quark",
      "Down quark",
      "Right quark",
    ],
    answer: 1,
    author: "Kenneth",
  },

  { // 15: Yuan Xi
    Question: "What is the cause of currents on the atmosphere of neutron stars?",
    choices: [
      "The strong magnetic fields of neutron stars",
      "The high spin of neutron stars",
      "The neutrons in neutron stars",
      "The moon of the neutron stars",
      "All of the above",
    ],
    answer: 1,
    author: "Yuan Xi",
  },
  
  { // 15: Kenneth
    Question: "Which of the following are not hypothetical?",
    choices: [
      "Neutron stars",
      "Quark star",
      "Strange star",
      "White hole",
      "Black Dwarf",
    ],
    answer: 1,
    author: "Kenneth",
  },
  
  { // 16: Yu Pin
    question: "From a scale of 1 to 10, how do you tell whether a star is sus?",
    choices: [
      "Black body radiation",
      "0 * π",
      "Among Us",
      "Ten!", // = 3628800
      "Sus",
    ],
    answer: 5,
    author: "Yu Pin",
    joke: true,
  },

];

for (const question of questions) {
  if (typeof question === "number") continue;
  question.chosen = [false, false, false, false, false, false];
  question.chosen_number = 0;
}

/* 
Question Option Distribution
1: 4
2: 3
3: 3
4: 3
5: 4

Question Author Distribution
Yu Pin: 6
Vikram: 5
Kenneth: 3
Yuan Xi: 3
*/