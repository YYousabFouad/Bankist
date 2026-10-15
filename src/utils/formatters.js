'use strict';

/**
 * Shared formatting utilities — pure functions, no side effects.
 */

/**
 * Format a date as a relative string (Today, Yesterday, X days ago)
 * or fall back to locale-formatted date.
 * @param {Date} date
 * @param {string} locale — BCP 47 language tag (e.g. "en-US")
 * @returns {string}
 */
export const formatDate = function (date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return Intl.DateTimeFormat(locale).format(date);
};

/**
 * Format a numeric value as localized currency.
 * @param {string} locale — BCP 47 language tag
 * @param {string} currency — ISO 4217 currency code (e.g. "EUR")
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = function (locale, currency, value) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
