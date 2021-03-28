//@ts-check
import { proxy } from 'valtio';
import { POW } from './data';
import { getPower, healUnit } from './helpers';

export const STATE = {
  p1: {
    move: 'p1move',
    attack: 'p1attack',
  },
  p2: {
    move: 'p2move',
    attack: 'p2attack',
  },
  end: 'end',
};

export const nextState = (curState) => {
  const { p1, p2 } = STATE;
  switch (curState) {
    case p1.move:
      return p1.attack;
    case p1.attack:
      return p2.move;
    case p2.move:
      return p2.attack;
    case p2.attack:
      return p1.move;
  }
};

export const CURRENT = proxy({
  state: STATE.p1.move,
  selectedCard: null,
  p1: {
    health: 20,
  },
  p2: {
    health: 20,
  },
});

export const processCombat = (attCards, defCards) => {
  //attack
  attCards.forEach((e, i) => {
    if (e.content.wait > 0) {
      return;
    }

    try {
      let pierce = getPower(e, POW.pierce);
      let totalDmg =
        Math.max(
          0,
          e.content.attack - getPower(defCards[i], POW.armor) - pierce,
        ) +
        // pierce goes right through armor
        pierce;
      defCards[i].content.health -= totalDmg;
      const killedEnemy = defCards[i].content.health <= 0;
      if (killedEnemy) {
        e.content.health += getPower(e, POW.absorb);
        e.content.attack += getPower(e, POW.rage);
      }
      if (e.content.attack > 0) {
        // for tribal shields
        e.content.health -= getPower(defCards[i], POW.avenge);
      }
    } catch (_) {
      // no adversary
      CURRENT.p2.health -= e.content.attack;
    }
  });
  // remove dead
  attCards = attCards.filter((e) => e.content.health > 0);
  defCards = defCards.filter((e) => e.content.health > 0);
  return {
    attCards,
    defCards,
  };
};

export const processEndOfTurnActions = (e, isFrontRow = false) => {
  // regen
  healUnit(e, getPower(e, POW.regen));
  if (isFrontRow) {
    // frontrow reduces wait
    e.content.wait = Math.max(0, e.content.wait - 1);
  } else {
    // backrow gains 1 health per turn
    healUnit(e, 1);
  }
};
