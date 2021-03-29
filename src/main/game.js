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
  let extraDamage = 0;
  // attack
  attCards.forEach((e, i) => {
    if (e.content.wait > 0) {
      return;
    }

    try {
      let pierce = getPower(e, POW.pierce);
      const totalDmg =
        Math.max(
          0,
          e.content.attack - getPower(defCards[i], POW.armor) - pierce,
        ) +
        // pierce goes right through armor
        pierce;
      defCards[i].content.health -= totalDmg;
      // poison enemy
      const poison = getPower(e, POW.poison);
      if (poison && !defCards[i].poisoned?.turns) {
        defCards[i].poisoned = { turns: 3, amount: poison };
      }
      // weaken enemy
      const weaken = getPower(e, POW.weaken);
      if (weaken && !defCards[i].weakened?.turns) {
        defCards[i].weakened = { turns: 3, amount: weaken };
        // weaken acts immediately
        defCards[i].content.attack -= weaken;
      }

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
      extraDamage += e.content.attack;
    }
  });
  // remove dead
  attCards = attCards.filter((e) => e.content.health > 0);
  defCards = defCards.filter((e) => e.content.health > 0);
  return {
    attCards,
    defCards,
    extraDamage,
  };
};

export const processEndOfTurnActions = (e, isFrontRow = false) => {
  // regen
  healUnit(e, getPower(e, POW.regen));
  // poison
  if (e.poisoned?.turns) {
    // take damage
    e.content.health -= e.poisoned.amount;

    e.poisoned.turns -= 1;
    if (e.poisoned.turns == 0) {
      e.poisoned.amount = 0;
    }
  }
  // weaken
  if (e.weakened?.turns) {
    e.weakened.turns -= 1;
    if (e.weakened.turns == 0) {
      // restores attack power
      e.content.attack += e.weakened.amount;

      e.weakened.amount = 0;
    }
  }
  if (isFrontRow) {
    // frontrow reduces wait
    e.content.wait = Math.max(0, e.content.wait - 1);
  } else {
    // backrow gains 1 health per turn
    healUnit(e, 1);
  }
};
