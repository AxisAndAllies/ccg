// powers
export const POW = {
  avenge: 'avenge',
  poison: 'poison',
  pierce: 'pierce',
  ranged: 'ranged',
  armor: 'armor',
  heal: 'heal',
  regen: 'regen',
  support: 'support',
  absorb: 'absorb',
  salvage: 'salvage',
};

export const POW_DESCRIPT = {
  avenge: 'deal damage to attacker',
  poison:
    'applies poison on attack, dealing damage for 3 turns. Does not stack.', // TODO
  pierce: 'part of attack that ignores armor', // TODO
  ranged: 'attack from afar, immune to avenge.', // TODO
  armor: 'reduce damage from each attack', // TODO
  heal: 'heal ally per turn', // TODO
  regen: 'heal self per turn',
  support: 'increase ally attack', // TODO
  absorb: 'increase hp on kill',
  salvage: 'increase attack on kill',
};

export const RAW_CARDS = [
  {
    name: 'bird',
    attack: 2,
    health: 3,
    wait: 0,
  },
  {
    name: 'minibot',
    attack: 3,
    health: 1,
    wait: 0,
  },
  {
    name: 'midbot',
    attack: 4,
    health: 2,
    pow: [[POW.armor, 1]],
    wait: 1,
  },
  {
    name: 'wraith',
    attack: 3,
    health: 7,
    pow: [[POW.absorb, 2]],
    wait: 1,
  },
  {
    name: 'snake',
    attack: 4,
    health: 3,
    pow: [
      [POW.poison, 1],
      [POW.avenge, 1],
    ],
    wait: 1,
  },
  {
    name: 'mage',
    attack: 3,
    health: 5,
    pow: [[POW.support, 1]],
    wait: 1,
  },
  {
    name: 'glass cannon',
    attack: 4,
    health: 1,
    pow: [[POW.armor, 3]],
    wait: 1,
  },
  {
    name: 'bigbot',
    attack: 4,
    health: 6,
    pow: [
      [POW.armor, 2],
      [POW.avenge, 1],
    ],
    wait: 2,
  },
  {
    name: 'scavenger',
    attack: 4,
    health: 6,
    wait: 2,
    pow: [
      [POW.absorb, 2],
      [POW.salvage, 2],
    ],
  },
  {
    name: 'shark',
    attack: 6,
    health: 4,
    wait: 1,
    pow: [[POW.pierce, 1]],
  },
  {
    name: 'bigshark',
    attack: 7,
    health: 6,
    wait: 2,
    pow: [
      [POW.pierce, 2],
      [POW.armor, 1],
    ],
  },
  {
    name: 'big cannon',
    attack: 5,
    health: 4,
    pow: [[POW.armor, 2]],
    wait: 2,
  },
  {
    name: 'ent',
    attack: 1,
    health: 14,
    pow: [
      [POW.heal, 1],
      [POW.regen, 2],
    ],
    wait: 3,
  },
  {
    name: 'magma titan',
    attack: 2,
    health: 10,
    pow: [
      [POW.armor, 1],
      [POW.avenge, 1],
      [POW.pierce, 1],
    ],
    wait: 3,
  },
];
