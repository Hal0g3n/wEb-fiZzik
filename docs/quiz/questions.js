
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
    question: "What is spaghetti?",
    choices: [
      "Long, thin, cylindrical noodles",
      "The code of this website",
      "Long rods of nucleons",
      "An Astronaut falling into a black hole",
      "When nuclei are squeezed until they touch",
    ],
    answer: 3,
    author: "Yu Pin",
  },
  
  { // 3: Yu Pin
    question: "Why are neutron stars named 'neutron stars'?",
    choices: [
      "They spin as fast as neutrons",
      "They are as dense as neutrons",
      "They are as hot as neutrons",
      "They are as large as neutrons",
      "They have very few protons",
    ],
    answer: 5,
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
      "A Bose-Einstien Condensate",
      "Protons",
      "Quark-Gluon Plasma",
      "Nuclear Pasta",
      "Elemental Iron",
    ],
    answer: 3, // of course!
    author: "Vikram",
  },
  
  { // 9: Vikram
    question: "What are neutrons made of?",
    choices: [
      "Three quarks and three gluons",
      "Superfluid plasma",
      "Three mesons",
      "Two Down quarks and an Up quark",
      "An electron and a proton",
    ],
    answer: 4,
    author: "Vikram",
  },
  
  
  { // 10: Vikram
    question: "When are Neutron Stars born?",
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
  
  
  { // 11
    question: "Can Neutron Stars produce energy?",
    choices: [
      "Yes. They are stars after all",
      "No. They are just hot balls of neutrons",
      "Yes. Energy is released when electrons and protons fuse",
      "No. They absorb energy from the surroundings instead to keep them shiny",
      "Yes. The hot neutron star undergoes black body radiation",
    ],
    answer: 2,
    author: "Yuan Xi",
  },
];

for (const question of questions) {
  if (typeof question === "number") continue;
  question.chosen = [false, false, false, false, false, false];
  question.chosen_number = 0;
}