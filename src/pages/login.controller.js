'use strict';

/**
 * Login / Dashboard page controller — DOM interaction only.
 * Pure logic imported from @/domain, @/utils, @/storage.
 */

import {
  calculateBalance,
  calculateIncome,
  calculatePayments,
  calculateInterest,
  canRequestLoan,
} from '../domain/calculations.js';
import { formatDate, formatCurrency } from '../utils/formatters.js';
import { getAccounts, saveAccounts, findAccount } from '../storage/account.repository.js';
import { showFeedback, clearFeedback } from '../utils/feedback.js';

// ================= STATE =================
let accounts = getAccounts();
let currentUser = null;
let timer = null;
let isProcessing = false; // Transaction submit lock
let sorted = false;
let coinAnimId;

// ================= DOM ELEMENTS =================
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const coinHeroEl = document.getElementById('coinHero');
const feedbackFor = name => document.querySelector(`[data-feedback="${name}"]`);
const refuse = (name, title, message, suggestion) =>
  showFeedback(feedbackFor(name), { title, message, suggestion });

// ================= UI RENDERING =================
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movementsList = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates?.[i] ?? new Date().toISOString(),
  }));
  if (sort) {
    movementsList.sort(
      (a, b) => new Date(a.movementDate) - new Date(b.movementDate),
    );
  }
  const html = movementsList
    .map((item, i) => {
      const type = item.movement > 0 ? 'deposit' : 'withdrawal';
      const date = formatDate(new Date(item.movementDate), acc.locale);
      const formattedMov = formatCurrency(acc.locale, acc.currency, item.movement);
      return `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${date}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    })
    .join('');
  containerMovements.innerHTML = html;
};

const calcDisplayBalance = function (acc) {
  acc.balance = calculateBalance(acc.movements);
  labelBalance.textContent = formatCurrency(acc.locale, acc.currency, acc.balance);
};

const calcDisplaySummary = function (acc) {
  acc.income = calculateIncome(acc.movements).toFixed(2);
  labelSumIn.textContent = formatCurrency(acc.locale, acc.currency, acc.income);
  acc.payment = calculatePayments(acc.movements).toFixed(2);
  labelSumOut.textContent = formatCurrency(acc.locale, acc.currency, acc.payment);
  acc.interest = calculateInterest(acc.movements, acc.interestRate).toFixed(2);
  labelSumInterest.textContent = formatCurrency(acc.locale, acc.currency, acc.interest);
};

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
};

// ================= COUNTDOWN TIMER =================
const countDownTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      window.location.reload();
    }
    time--;
  };
  let time = 60 * 3;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// ================= BOUNCING COIN ANIMATION =================
const coin = document.getElementById('bouncing-coin');
if (coin) {
  let x = Math.random() * (window.innerWidth - 60);
  let y = Math.random() * (window.innerHeight - 60);
  let dx = 3;
  let dy = 3;
  const coinSize = 60;

  function animateCoin() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (x + dx > screenWidth - coinSize || x + dx < 0) dx = -dx;
    if (y + dy > screenHeight - coinSize || y + dy < 0) dy = -dy;
    x += dx;
    y += dy;
    coin.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    coinAnimId = requestAnimationFrame(animateCoin);
  }
  animateCoin();
  window.addEventListener('resize', () => {
    if (x > window.innerWidth - coinSize) x = window.innerWidth - coinSize;
    if (y > window.innerHeight - coinSize) y = window.innerHeight - coinSize;
  });
}

// ================= EVENT LISTENERS =================
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  clearFeedback(feedbackFor('login'));
  currentUser = findAccount(accounts, inputLoginUsername.value);
  if (currentUser?.pin === +inputLoginPin.value) {
    // Hide coin hero and cancel animation
    if (coinHeroEl) coinHeroEl.classList.add('hidden');
    if (coinAnimId) {
      cancelAnimationFrame(coinAnimId);
      coinAnimId = null;
    }
    // Display date
    const now = new Date();
    const options = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentUser.locale, options).format(now);
    // Reset login inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;
    // Timer
    if (timer) clearInterval(timer);
    timer = countDownTimer();
    // Populate UI
    updateUI(currentUser);
    // Reveal dashboard
    containerApp.style.opacity = 1;
    containerApp.style.pointerEvents = 'all';
    containerApp.style.transform = 'translateY(0)';
  } else {
    inputLoginPin.value = '';
    refuse('login', 'We could not sign you in', 'The username or PIN does not match an account.', 'Check both details and try again. Your PIN field has been cleared for security.');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  clearFeedback(feedbackFor('transfer'));
  if (!currentUser) return refuse('transfer', 'Sign in required', 'Transfers are available after you sign in.', 'Enter your account username and PIN above, then retry.');
  if (isProcessing) return refuse('transfer', 'Another transaction is processing', 'Please wait while your previous request finishes.', 'Retry the transfer in a moment.');
  const amount = +inputTransferAmount.value;
  const receiverAcc = findAccount(accounts, inputTransferTo.value);
  if (!inputTransferTo.value || !receiverAcc || !amount || receiverAcc.username === currentUser.username) {
    refuse('transfer', 'Transfer details need a check', 'The recipient account was not found, the details are incomplete, or you selected your own account.', 'Enter the recipient’s username exactly as shown on their account and choose a different recipient.');
  } else if (amount <= 0 || currentUser.balance < amount) {
    refuse('transfer', amount <= 0 ? 'Enter a valid amount' : 'Insufficient available balance', amount <= 0 ? 'Transfer amounts must be greater than zero.' : `Your available balance is ${formatCurrency(currentUser.locale, currentUser.currency, currentUser.balance)}.`, amount <= 0 ? 'Enter a positive amount and try again.' : 'Reduce the transfer amount or add funds before retrying.');
  } else if (receiverAcc) {
    isProcessing = true;
    setTimeout(() => {
      currentUser.movements.push(-amount);
      receiverAcc.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentUser);
      saveAccounts(accounts);
      inputTransferTo.value = inputTransferAmount.value = '';
      clearInterval(timer);
      timer = countDownTimer();
      isProcessing = false;
    }, 2000);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  clearFeedback(feedbackFor('loan'));
  if (!currentUser) return refuse('loan', 'Sign in required', 'Loan requests are available after you sign in.', 'Enter your account username and PIN above, then retry.');
  if (isProcessing) return refuse('loan', 'Another transaction is processing', 'Please wait while your previous request finishes.', 'Retry the loan request in a moment.');
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && canRequestLoan(currentUser.movements, amount)) {
    isProcessing = true;
    setTimeout(() => {
      currentUser.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());
      saveAccounts(accounts);
      updateUI(currentUser);
      clearInterval(timer);
      timer = countDownTimer();
      isProcessing = false;
    }, 2000);
  } else {
    const amount = Math.floor(inputLoanAmount.value);
    refuse('loan', 'This loan cannot be approved yet', amount > 0 ? 'To qualify, at least one previous deposit must be 10% or more of the requested loan.' : 'Enter a loan amount greater than zero.', amount > 0 ? 'Try a smaller amount, or build your deposit history and apply again.' : 'Enter a positive whole number and try again.');
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  clearFeedback(feedbackFor('close'));
  if (!currentUser) return refuse('close', 'Sign in required', 'You need an active session to close your account.', 'Sign in above, then confirm your account details here.');
  if (currentUser.username === inputCloseUsername.value && currentUser.pin === +inputClosePin.value) {
    const index = accounts.findIndex(acc => acc.username === currentUser.username);
    accounts.splice(index, 1);
    saveAccounts(accounts);
    window.location.replace('../HTMLs/index.html');
    currentUser = null;
  } else {
    refuse('close', 'We could not verify account ownership', 'The username or PIN entered does not match your signed-in account.', 'Re-enter the username and PIN linked to this account.');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentUser) return;
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
