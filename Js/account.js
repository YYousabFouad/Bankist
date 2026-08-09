'user strict';
// ================= ACCOUNTS DATA =================

const account1 = {
  owner: 'Test User',
  email: 'test@test.com',
  birthDate: '2000-01-01',
  idNumber: '12345678901234',
  movements: [],
  username: 'tu1234',
  pin: 1234,
  movementsDates: [],
  interestRate: 1.2,
  currency: 'EUR',
  locale: 'en-US',
};

const account2 = {
  owner: 'Demo User',
  email: 'demo@demo.com',
  birthDate: '2000-02-02',
  idNumber: '98765432109876',
  movements: [],
  username: 'du5678',
  pin: 5678,
  movementsDates: [],
  interestRate: 1.5,
  currency: 'USD',
  locale: 'en-US',
};

export let accounts = [account1, account2];

// Save in local storage
export const saveAccounts = function (data) {
  localStorage.setItem('accounts', JSON.stringify(data));
};

// Load the saved data
export const loadAccounts = function () {
  return JSON.parse(localStorage.getItem('accounts'));
};

// Check if there's saved data and initialize
const initializeAccounts = function () {
  let data = loadAccounts();
  if (data) {
    accounts = data;
  } else {
    saveAccounts(accounts);
  }
};

initializeAccounts();
