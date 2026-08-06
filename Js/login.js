'use strict';

// ================= ACCOUNTS DATA =================
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

let accounts = [account1, account2];

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

// COIN HERO DOM ELEMENTS
const coinHeroEl = document.getElementById('coinHero');
const coinContainerEl = document.querySelector('.coin-container');

// ================= FUNCTIONS =================
//Format the Date
const formatDate = function (date) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    return `${day}/${month}/${year}`;
  }
};

// Save in local storage
const saveAccounts = function (data) {
  localStorage.setItem('accounts', JSON.stringify(data));
};

// Load the saved data
const loadAccounts = function () {
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

// Render Account Movements
const displayMovements = function (acc, sort) {
  containerMovements.innerHTML = '';

  const combinedDatemov = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort)
    combinedDatemov.sort(
      (a, b) =>
        new Date(a.movementDate).getTime() - new Date(b.movementDate).getTime(),
    );
  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;
  combinedDatemov.forEach((obj, i) => {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);
    const displayDate = formatDate(date);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movement.toFixed(2)}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  saveAccounts(accounts);
};

// Calculate and Render Account Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};

// Calculate and Render Financial Summary
const calcDisplaySummary = function (acc) {
  acc.income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelSumIn.textContent = `${acc.income}€`;

  acc.payment = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelSumOut.textContent = `${Math.abs(acc.payment)}€`;

  acc.interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelSumInterest.textContent = `${acc.interest}€`;
};

// Compute Usernames dynamically based on Owner initials
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);
saveAccounts(accounts);

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
};

let currentUser;

// ================= EVENT LISTENERS =================

// Authentication / Login Action
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === +inputLoginPin.value) {
    // 1. Hide the 3D coin bouncing hero area
    if (coinHeroEl) {
      coinHeroEl.classList.add('hidden');
    }

    //2. save the current date

    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year},${hour}:${minutes}`;
    // 3. Reset login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // 4. Render Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;

    // 5. Populate main UI with account data
    updateUI(currentUser);

    // 6. Reveal the main banking dashboard
    containerApp.style.opacity = 1;
    containerApp.style.pointerEvents = 'all';
    containerApp.style.transform = 'translateY(0)';
  } else {
    inputLoginPin.value = '';
    alert('Wrong username or PIN!');
  }
});

// Implement Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );

  if (
    !inputTransferTo.value ||
    !receiverAcc ||
    !amount ||
    receiverAcc.username === currentUser.username
  ) {
    alert(
      `${currentUser.owner.split(' ')[0]}, You entered wrong data !! \nTry Again `,
    );
  } else if (amount <= 0 || currentUser.balance < amount) {
    alert('Please enter a correct amount');
  } else if (receiverAcc) {
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //add date to the movement
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //update ui
    updateUI(currentUser);
    //save the data
    saveAccounts(accounts);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

// Loan amounts
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    // add loan date
    currentUser.movementsDates.push(new Date().toISOString());
    //save the movements dates to the account
    saveAccounts(accounts);
    //update UI
    updateUI(currentUser);
  } else {
    alert('Loan request denied.');
  }
  inputLoanAmount.value = '';
});

// Close accounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === +inputClosePin.value
  ) {
    const currentAccIndex = accounts.findIndex(
      acc => acc.username === currentUser.username,
    );
    accounts.splice(currentAccIndex, 1);
    saveAccounts(accounts);

    // Reset UI view back to default
    containerApp.style.opacity = 0;
    containerApp.style.pointerEvents = 'none';
    if (coinHeroEl) coinHeroEl.classList.remove('hidden');
    labelWelcome.textContent = 'Log in to get started';
    currentUser = null;
  } else {
    alert('Enter the Correct Credentials');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});

// Bouncing Coin Animation
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

    if (x + dx > screenWidth - coinSize || x + dx < 0) {
      dx = -dx;
    }

    if (y + dy > screenHeight - coinSize || y + dy < 0) {
      dy = -dy;
    }

    x += dx;
    y += dy;

    coin.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    requestAnimationFrame(animateCoin);
  }

  animateCoin();

  window.addEventListener('resize', () => {
    if (x > window.innerWidth - coinSize) x = window.innerWidth - coinSize;
    if (y > window.innerHeight - coinSize) y = window.innerHeight - coinSize;
  });
}

//====================Studying================================================

// console.log(3 / 10);

// console.log(0.1 + 0.2);

console.log(new Date());
