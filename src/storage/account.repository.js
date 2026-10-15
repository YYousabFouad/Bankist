'use strict';

/**
 * AccountRepository — encapsulates all localStorage read/write operations.
 * Listens for the 'storage' event to synchronize state across browser tabs.
 */

const STORAGE_KEY = 'accounts';

const demoAccounts = [
  {
    owner: 'Test User', email: 'test@test.com', birthDate: '2000-01-01',
    idNumber: '12345678901234', movements: [], username: 'tu1234', pin: 1234,
    movementsDates: [], interestRate: 1.2, currency: 'EUR', locale: 'en-US',
  },
  {
    owner: 'Demo User', email: 'demo@demo.com', birthDate: '2000-02-02',
    idNumber: '98765432109876', movements: [], username: 'du5678', pin: 5678,
    movementsDates: [], interestRate: 1.5, currency: 'USD', locale: 'en-US',
  },
];

/**
 * Load accounts from localStorage.
 * @returns {any[]|null}
 */
export const getAccounts = function () {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Recover from stale or manually edited browser storage below.
  }
  saveAccounts(demoAccounts);
  return JSON.parse(JSON.stringify(demoAccounts));
};

/**
 * Persist accounts to localStorage.
 * @param {any[]} data
 */
export const saveAccounts = function (data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Add a new account and persist.
 * @param {any[]} accounts
 * @param {object} account
 */
export const addAccount = function (accounts, account) {
  if (!Array.isArray(accounts)) throw new TypeError('Accounts must be an array');
  if (accounts.some(existing => existing.username === account.username)) {
    throw new Error('That username is already in use');
  }
  accounts.push(account);
  saveAccounts(accounts);
};

/**
 * Remove an account by username and persist.
 * @param {any[]} accounts
 * @param {string} username
 */
export const removeAccount = function (accounts, username) {
  const index = accounts.findIndex(acc => acc.username === username);
  if (index !== -1) accounts.splice(index, 1);
  saveAccounts(accounts);
};

/**
 * Find an account by username.
 * @param {any[]} accounts
 * @param {string} username
 * @returns {object|undefined}
 */
export const findAccount = function (accounts, username) {
  return accounts.find(acc => acc.username === username);
};

/**
 * Subscribe to cross-tab storage synchronization.
 * @param {function} callback — receives the parsed accounts array
 * @returns {function} unsubscribe
 */
export const onStorageChange = function (callback) {
  const handler = e => {
    if (e.key === STORAGE_KEY) {
      try {
        const accounts = JSON.parse(e.newValue);
        callback(Array.isArray(accounts) ? accounts : []);
      } catch {
        callback([]);
      }
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};
