// powers
export const POW = {
  avenge: 'avenge',
  poison: 'poison',
  pierce: 'pierce',
  ranged: 'ranged',
  armor: 'armor',
  heal: 'heal',
  regen: 'regen',
  rally: 'rally',
  absorb: 'absorb',
  rage: 'rage',
  weaken: 'weaken',
};

export const POW_DESCRIPT = {
  avenge: 'deal damage to attacker, bypasses armor',
  poison:
    'applies poison on attack, dealing damage for 3 turns. Does not stack.',
  pierce: 'part of attack that ignores armor',
  ranged: 'attack from afar, immune to `avenge`.', // TODO
  armor: 'reduce damage from each attack',
  heal: 'heal adjacent allies per turn, only works in frontrow',
  regen: 'heal self per turn',
  rally: 'temporarily increase adjacent allies attack',
  absorb: 'increase hp on kill, can exceed max hp',
  rage: 'increase attack on kill, can exceed max attack',
  weaken: 'reduce enemy attack for 3 turns. Does not stack.',
  immune: 'immune to weaken and poison', // TODO
};

import bigCannon from '../assets/big cannon.svg';
import bigbot from '../assets/bigbot.svg';
import bigshark from '../assets/bigshark.svg';
import cosmicEgg from '../assets/cosmic egg.svg';
import crow from '../assets/crow.svg';
import dragon from '../assets/dragon.svg';
import ent from '../assets/ent.svg';
import glassCannon from '../assets/glass cannon.svg';
import griffin from '../assets/griffin.svg';
import hydra from '../assets/hydra.svg';
import lancer from '../assets/lancer.svg';
import mage from '../assets/mage.svg';
import magmaTitan from '../assets/magma titan.svg';
import minibot from '../assets/minibot.svg';
import midbot from '../assets/midbot.svg';
import minotaur from '../assets/minotaur.svg';
import paladin from '../assets/paladin.svg';
import sauropod from '../assets/sauropod.svg';
import scavenger from '../assets/scavenger.svg';
import snake from '../assets/snake.svg';
import snakeMonster from '../assets/snake monster.svg';
import spacemarine from '../assets/spacemarine.svg';
import spider from '../assets/spider.svg';
import spikeTroll from '../assets/spike troll.svg';
import shark from '../assets/shark.svg';
import tribalShield from '../assets/tribal shield.svg';
import troll from '../assets/troll.svg';
import uberbot from '../assets/uberbot.svg';
import unicorn from '../assets/unicorn.svg';
import windSlicer from '../assets/windSlicer.svg';
import wraith from '../assets/wraith.svg';

export function camelize(text) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
}
export const getIcon = (name) => {
  try {
    return eval(camelize(name));
  } catch (e) {
    return '';
  }
};

export const RAW_CARDS = [
  {
    name: 'crow',
    attack: 2,
    health: 4,
    wait: 0,
  },
  {
    name: 'minibot',
    attack: 3,
    health: 1,
    wait: 0,
  },
  {
    name: 'unicorn',
    attack: 1,
    health: 4,
    pow: [[POW.weaken, 1]],
    wait: 0,
  },
  {
    name: 'tribal shield',
    attack: 0,
    health: 6,
    pow: [
      [POW.avenge, 2],
      [POW.armor, 2],
    ],
    wait: 0,
  },
  {
    name: 'cosmic egg',
    attack: 2,
    health: 4,
    pow: [
      [POW.armor, 2],
      [POW.rally, 1],
    ],
    wait: 1,
  },
  {
    name: 'midbot',
    attack: 4,
    health: 4,
    pow: [
      [POW.armor, 2],
      [POW.rage, 1],
    ],
    wait: 1,
  },
  {
    name: 'wraith',
    attack: 4,
    health: 7,
    pow: [[POW.absorb, 3]],
    wait: 1,
  },
  {
    name: 'wind slicer',
    attack: 2,
    health: 4,
    pow: [[POW.avenge, 4]],
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
    pow: [
      [POW.rally, 1],
      [POW.weaken, 1],
    ],
    wait: 1,
  },
  {
    name: 'spacemarine',
    attack: 5,
    health: 7,
    pow: [],
    wait: 1,
  },
  {
    name: 'glass cannon',
    attack: 4,
    health: 2,
    pow: [[POW.armor, 3]],
    wait: 1,
  },
  {
    name: 'shark',
    attack: 6,
    health: 4,
    wait: 1,
    pow: [[POW.pierce, 1]],
  },
  {
    name: 'bigbot',
    attack: 5,
    health: 6,
    pow: [
      [POW.armor, 2],
      [POW.pierce, 1],
    ],
    wait: 2,
  },
  {
    name: 'scavenger',
    attack: 4,
    health: 8,
    wait: 2,
    pow: [
      [POW.absorb, 2],
      [POW.rage, 1],
    ],
  },
  {
    name: 'bigshark',
    attack: 6,
    health: 7,
    wait: 2,
    pow: [
      [POW.pierce, 2],
      [POW.armor, 1],
    ],
  },
  {
    name: 'lancer',
    attack: 5,
    health: 4,
    wait: 2,
    pow: [
      [POW.pierce, 2],
      [POW.armor, 3],
    ],
  },
  {
    name: 'spider',
    attack: 3,
    health: 7,
    wait: 2,
    pow: [
      [POW.poison, 1],
      [POW.avenge, 2],
    ],
  },
  {
    name: 'spike troll',
    attack: 2,
    health: 8,
    wait: 2,
    pow: [
      [POW.weaken, 2],
      [POW.rage, 2],
    ],
  },
  {
    name: 'big cannon',
    attack: 6,
    health: 5,
    pow: [
      [POW.armor, 2],
      [POW.avenge, 1],
    ],
    wait: 2,
  },
  {
    name: 'minotaur',
    attack: 5,
    health: 7,
    pow: [
      [POW.armor, 1],
      [POW.rage, 1],
    ],
    wait: 2,
  },
  {
    name: 'hydra',
    attack: 4,
    health: 7,
    pow: [
      [POW.avenge, 1],
      [POW.regen, 3],
    ],
    wait: 2,
  },
  {
    name: 'uberbot',
    attack: 2,
    health: 10,
    pow: [
      [POW.rage, 2],
      [POW.pierce, 2],
    ],
    wait: 2,
  },
  {
    name: 'ent',
    attack: 2,
    health: 14,
    pow: [
      [POW.heal, 1],
      [POW.regen, 2],
    ],
    wait: 3,
  },
  {
    name: 'snake monster',
    attack: 2,
    health: 8,
    pow: [
      [POW.poison, 2],
      [POW.pierce, 1],
    ],
    wait: 3,
  },
  {
    name: 'magma titan',
    attack: 4,
    health: 10,
    pow: [
      [POW.armor, 1],
      [POW.avenge, 1],
    ],
    wait: 3,
  },
  {
    name: 'sauropod',
    attack: 3,
    health: 12,
    pow: [
      [POW.rage, 1],
      [POW.armor, 1],
    ],
    wait: 3,
  },
  {
    name: 'troll',
    attack: 5,
    health: 13,
    pow: [],
    wait: 3,
  },
  {
    name: 'griffin',
    attack: 3,
    health: 10,
    pow: [
      [POW.armor, 1],
      [POW.regen, 1],
      [POW.weaken, 1],
    ],
    wait: 3,
  },
  {
    name: 'paladin',
    attack: 4,
    health: 12,
    pow: [
      [POW.rally, 2],
      [POW.armor, 2],
    ],
    wait: 4,
  },
  {
    name: 'dragon',
    attack: 5,
    health: 13,
    pow: [
      [POW.rage, 1],
      [POW.absorb, 3],
      [POW.armor, 1],
    ],
    wait: 4,
  },
];
