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
} from '@/domain/calculations';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { getAccounts, saveAccounts, findAccount } from '@/storage/account.repository';

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
    alert('Wrong username or PIN!');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentUser) return alert('Sign in before making a transfer.');
  if (isProcessing) return;
  const amount = +inputTransferAmount.value;
  const receiverAcc = findAccount(accounts, inputTransferTo.value);
  if (!inputTransferTo.value || !receiverAcc || !amount || receiverAcc.username === currentUser.username) {
    alert(`${currentUser.owner.split(' ')[0]}, You entered wrong data !! \nTry Again `);
  } else if (amount <= 0 || currentUser.balance < amount) {
    alert('Please enter a correct amount');
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
  if (!currentUser) return alert('Sign in before requesting a loan.');
  if (isProcessing) return;
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
    alert('Loan request denied.');
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentUser) return alert('Sign in before closing an account.');
  if (currentUser.username === inputCloseUsername.value && currentUser.pin === +inputClosePin.value) {
    const index = accounts.findIndex(acc => acc.username === currentUser.username);
    accounts.splice(index, 1);
    saveAccounts(accounts);
    window.location.replace('../HTMLs/index.html');
    currentUser = null;
  } else {
    alert('Enter the Correct Credentials');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentUser) return;
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
