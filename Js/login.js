'use strict';

// ================= ACCOUNTS DATA =================
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

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
const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and Render Account Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// Calculate and Render Financial Summary
const calcDisplaySummary = function (acc) {
  acc.income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${acc.income}€`;

  acc.payment = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
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
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
};

let currentUser;

// ================= EVENT LISTENERS =================

// Authentication / Login Action
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // 1. Hide the 3D coin bouncing hero area
    if (coinHeroEl) {
      coinHeroEl.classList.add('hidden');
    }

    // 2. Reset login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // 3. Render Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;

    // 4. Populate main UI with account data
    updateUI(currentUser);

    // 5. Reveal the main banking dashboard
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
  const amount = Number(inputTransferAmount.value);
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
    saveAccounts(accounts);
    updateUI(currentUser);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

// Loan amounts
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    saveAccounts(accounts);
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
    currentUser.pin === Number(inputClosePin.value)
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
  displayMovements(currentUser.movements, !sorted);
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

//===============================Studying======================================

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.sort((a, b) => b - a);
// console.log(movements);
// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];
// //1
// const huskyWeight = breeds.find(bread => bread.breed === 'Husky').averageWeight;

// console.log(huskyWeight);

// //2
// const dogBothActivities = breeds.find(bread =>
//   bread.activities.includes('fetch' && 'running'),
// ).breed;
// console.log(dogBothActivities);

// //3
// const allActivities = breeds.flatMap(bread => bread.activities);
// console.log(allActivities);

// //4
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// console.log(movements);
