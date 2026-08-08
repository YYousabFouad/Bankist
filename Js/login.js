'use strict';
import { saveAccounts, loadAccounts, accounts } from '../Js/create';
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
const formatDate = function (date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // return `${day}/${month}/${year}`;
    return Intl.DateTimeFormat(locale).format(date);
  }
};

//Format the currency
const formattedCurrency = function (locale, currency, value) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

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
    const displayDate = formatDate(date, currentUser.locale);
    const formattedMov = formattedCurrency(acc.locale, acc.currency, movement);
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  saveAccounts(accounts);
};

// Calculate and Render Account Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formattedCurrency(
    acc.locale,
    acc.currency,
    acc.balance,
  );
};

// Calculate and Render Financial Summary
const calcDisplaySummary = function (acc) {
  acc.income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelSumIn.textContent = formattedCurrency(
    acc.locale,
    acc.currency,
    acc.income,
  );
  acc.payment = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  labelSumOut.textContent = formattedCurrency(
    acc.locale,
    acc.currency,
    Math.abs(+acc.payment),
  );

  acc.interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelSumInterest.textContent = formattedCurrency(
    acc.locale,
    acc.currency,
    acc.interest,
  );
};

saveAccounts(accounts);

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
};
//Implement Count Down
const countDownTimer = function () {
  //define the funciton
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //display it every 1 second
    labelTimer.textContent = `${min}:${sec}`;

    //check if reaches 0
    if (time === 0) {
      clearInterval(timer);
      window.location.reload();
    }

    //decrease the time
    time--;
  };
  //define the time that i want the userr to logout automatically after it
  let time = 60 * 3;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let currentUser, timer;

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
    const options = {
      year: 'numeric',
      // Weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    // const locale = navigator.language;
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentUser.locale,
      options,
    ).format(now);
    // 3. Reset login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // 4. Render Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;
    // 5. Render Time
    if (timer) clearInterval(timer);
    timer = countDownTimer();

    // 6. Populate main UI with account data
    updateUI(currentUser);

    // 7. Reveal the main banking dashboard
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
    setTimeout(() => {
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
      //reset timer
      clearInterval(timer);
      timer = countDownTimer();
    }, 2000);
  }
});

// Loan amounts
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentUser.movements.push(amount);
      // add loan date
      currentUser.movementsDates.push(new Date().toISOString());
      //save the movements dates to the account
      saveAccounts(accounts);
      //update UI
      updateUI(currentUser);
      //reset timer
      clearInterval(timer);
      timer = countDownTimer();
    }, 2000);
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

    window.location.replace('../HTMLs/index.html');
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
