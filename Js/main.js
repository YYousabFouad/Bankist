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

const accounts = [account1, account2, account3, account4];

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

// Render Account Movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//save in local storage
const saveAccounts = function (data) {
  localStorage.setItem('accounts', JSON.stringify(data));
};
const loadAccounts = function () {
  return JSON.parse(localStorage.getItem('accounts'));
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
  //1.1 - We need to check if the user have an input
  //1.2- We need to check on if amount is positive number
  //2 - We need to check if amount is lower than balance
  if (
    !inputTransferTo.value ||
    !receiverAcc ||
    !amount ||
    receiverAcc.username === currentUser.username
  ) {
    alert(
      `${currentUser.owner.split(' ')[0]} , You add the Wrong data !! \nTry Again `,
    );
  } else if (amount <= 0 || currentUser.balance < amount) {
    alert('Please Enter the correct amount please');
  } else if (receiverAcc) {
    //3 - if 2 is true add a negative movement and update UI
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentUser);
    saveAccounts(accounts);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

// Close accounts
btnClose.addEventListener('click', function (e) {
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const currentAccIndex = accounts.findIndex(
      acc => acc.username === currentUser.username,
    );
    accounts.splice(currentAccIndex, 1);
    currentUser = '';
  } else {
    alert('Enter the Correct Credentials');
  }
  saveAccounts(accounts);
  inputCloseUsername.value = inputClosePin.value = '';
});

// ================= 3D COIN BOUNCING PHYSICS =================
if (coinHeroEl && coinContainerEl) {
  let posX = 30;
  let posY = 30;
  let speedX = 4.5; // Horizontal movement speed
  let speedY = 3.8; // Vertical movement speed

  function animateBouncingCoin() {
    // Stop physics calculation if user logged in and coin is hidden
    if (coinHeroEl.classList.contains('hidden')) return;

    const heroRect = coinHeroEl.getBoundingClientRect();
    const coinSize = 90; // Pixel size of the coin element

    posX += speedX;
    posY += speedY;

    // Detect left and right boundary collisions
    if (posX + coinSize >= heroRect.width || posX <= 0) {
      speedX *= -1; // Reverse horizontal direction
    }

    // Detect top and bottom boundary collisions
    if (posY + coinSize >= heroRect.height || posY <= 0) {
      speedY *= -1; // Reverse vertical direction
    }

    // Apply translation to container
    coinContainerEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

    requestAnimationFrame(animateBouncingCoin);
  }

  // Start animation loop
  animateBouncingCoin();

  // Handle window resize to prevent coin getting stuck outside boundaries
  window.addEventListener('resize', () => {
    const heroRect = coinHeroEl.getBoundingClientRect();
    if (posX + 90 > heroRect.width) posX = heroRect.width - 90;
    if (posY + 90 > heroRect.height) posY = heroRect.height - 90;
  });
}
// console.log(Array('1e3').map(n => isFinite(n)));

//Studying
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const ages = [5, 2, 4, 1, 15, 8, 3];

// const calcHumanAges = function (ages) {
//   const averageHumanAges =
//     ages
//       .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
//       .filter(age => age > 18)
//       .reduce((acc, age) => acc + age, 0) / ages.length;
//   return averageHumanAges.toFixed(2);
// };

// console.log(calcHumanAges(ages));

// console.log(movements.find(mov => mov < 0));

// let accJess;

// for (const acc of accounts) {
//   if ((acc.owner = 'Jessica Davis')) accJess = acc;
// }

// console.log(accJess);
