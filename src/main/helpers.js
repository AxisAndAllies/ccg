//@ts-check
import { RAW_CARDS } from './data';

/**
 * Creates a new card from a name
 * @param {*} name
 * @returns
 */
export const newCard = (name) => ({ ...RAW_CARDS.find((e) => e.name == name) });
/**
 * Gets base stat of unit from a name
 * @param {*} name
 * @returns
 */
export const getBaseStat = (name) => RAW_CARDS.find((e) => e.name === name);

/**
 * Gets the value of the power of a unit, if it has one. If no such power, returns 0.
 * @param {*} unit
 * @param {*} power
 * @returns
 */
export const getPower = ({ content }, power) => {
  const p = content.pow?.find(([powName, _]) => powName == power);
  return p ? p[1] : 0;
};

/**
 * Heals a unit a certain amount
 * @param {*} e
 * @param {*} amount
 * @returns
 */
export const healUnit = (e, amount) => {
  // NOTE: does nothing for already overhealed units
  if (e.content.health + amount <= getBaseStat(e.content.name).health)
    e.content.health += amount;
};
