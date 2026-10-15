'use strict';

/**
 * Pure domain calculations — no DOM queries, no side effects.
 * All functions are 100% deterministic and unit-testable.
 */

/**
 * Calculate total balance from an array of movements.
 * @param {number[]} movements
 * @returns {number}
 */
export const calculateBalance = function (movements) {
  return movements.reduce((sum, mov) => sum + mov, 0);
};

/**
 * Calculate total income (sum of all deposits).
 * @param {number[]} movements
 * @returns {number}
 */
export const calculateIncome = function (movements) {
  return movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
};

/**
 * Calculate total payments (sum of all withdrawals, returned as positive).
 * @param {number[]} movements
 * @returns {number}
 */
export const calculatePayments = function (movements) {
  return movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + Math.abs(mov), 0);
};

/**
 * Calculate total interest earned on deposits.
 * @param {number[]} movements
 * @param {number} interestRate — percentage (e.g. 1.2 for 1.2%)
 * @returns {number}
 */
export const calculateInterest = function (movements, interestRate) {
  return movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .reduce((sum, interest) => sum + interest, 0);
};

/**
 * Check if a loan can be requested.
 * Rule: at least one deposit must be >= 10% of the loan amount.
 * @param {number[]} movements
 * @param {number} amount
 * @returns {boolean}
 */
export const canRequestLoan = function (movements, amount) {
  return movements.some(mov => mov >= amount * 0.1);
};

/**
 * Validate a national ID number (must be exactly 14 digits).
 * @param {string} id
 * @returns {boolean}
 */
export const validateNationalId = function (id) {
  return /^\d{14}$/.test(id);
};

/**
 * Calculate age in years from a birth date string.
 * @param {string} birthDate — ISO date string (e.g. "2000-01-01")
 * @returns {number}
 */
export const calculateAge = function (birthDate) {
  const birth = new Date(birthDate);
  if (!Number.isFinite(birth.getTime())) return NaN;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
