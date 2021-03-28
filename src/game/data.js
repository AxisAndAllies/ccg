// powers
export const POW = {
  freeze: 'freeze',
  avenge: 'avenge',
  poison: 'poison',
  pierce: 'pierce',
  leech: 'leech',
  ranged: 'ranged',
  armor: 'armor',
  heal: 'heal',
  regen: 'regen',
  support: 'support',
};

export const POW_DESCRIPT = {
  avenge: 'strike back at attacker',
  poison:
    'applies poison on attack, which deals damage per turn for 3 turns. Does not stack.',
  pierce: 'negates armor',
  leech: 'takes health on attack',
  ranged: 'attack from afar, immune to avenge.',
  armor: 'armor negates some damage',
  heal: 'heal ally per turn',
  regen: 'heal self per turn',
  support: 'increase ally attack',
  absorb: 'increase hp on kill',
  salvage: 'increase attack on kill',
};

export const RAW_CARDS = [
  {
    name: 'bird',
    att: 2,
    hp: 3,
    wait: 0,
  },
  {
    name: 'minibot',
    att: 3,
    hp: 1,
    wait: 0,
  },
  {
    name: 'scavenger',
    att: 3,
    hp: 3,
    wait: 1,
    pow: [
      [POW.absorb, 1],
      [POW.salvage, 1],
      [POW.avenge, 1],
    ],
  },
  {
    name: 'icebot',
    att: 3,
    hp: 5,
    wait: 1,
    pow: [
      [POW.absorb, 1],
      [POW.freeze, 1],
      [POW.avenge, 1],
    ],
  },
  {
    name: 'midbot',
    att: 4,
    hp: 2,
    pow: [[POW.armor, 1]],
    wait: 1,
  },
  {
    name: 'bigbot',
    att: 4,
    hp: 4,
    pow: [[POW.armor, 2]],
    wait: 2,
  },
  {
    name: 'shark',
    att: 6,
    hp: 4,
    wait: 1,
    pow: [[POW.pierce, 1]],
  },
  {
    name: 'bigshark',
    att: 7,
    hp: 6,
    wait: 2,
    pow: [[POW.pierce, 2]],
  },
  {
    name: 'ent',
    att: 1,
    hp: 10,
    pow: [
      [POW.heal, 1],
      [POW.regen, 2],
    ],
    wait: 3,
  },
  {
    name: 'vamp',
    att: 3,
    hp: 4,
    pow: [[POW.leech, 1]],
    wait: 1,
  },
  {
    name: 'snake',
    att: 4,
    hp: 3,
    pow: [[POW.poison, 1]],
    wait: 1,
  },
  {
    name: 'mage',
    att: 3,
    hp: 5,
    pow: [[POW.support, 1]],
    wait: 1,
  },
  {
    name: 'glass cannon',
    att: 4,
    hp: 1,
    pow: [[POW.armor, 3]],
    wait: 1,
  },
  {
    name: 'big cannon',
    att: 5,
    hp: 4,
    pow: [[POW.armor, 2]],
    wait: 2,
  },
];
