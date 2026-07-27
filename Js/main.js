'use strict';

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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdraw';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const calcDisplayMovements = function (movements) {
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${balance} EUR`;
};
calcDisplayMovements(account1.movements);

const calcDisplaySummary = function (movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  console.log(income);
  labelSumIn.textContent = `${income}`;

  const payment = movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(payment)}`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * 1.2) / 100)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = `${interest}`;
};

calcDisplaySummary(account1.movements);

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
console.log(accounts);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const findMaxValue = movements.reduce((acc, curr = acc + 1) => {
  return curr > acc ? (acc = curr) : acc;
});

console.log(findMaxValue);

const ages = [5, 2, 4, 1, 15, 8, 3];

const humanAges = [];
const calcHumanAges = function (ages) {
  for (const age of ages) {
    if (age <= 2) {
      humanAges.push(age * 2);
    } else {
      humanAges.push(16 + age * 4);
    }
  }
  return humanAges;
};

console.log(calcHumanAges([5, 2, 4, 1, 15, 8, 3]));

const excludeHuman = function (humanAges) {
  const adultHuman = humanAges.filter(humanAges => humanAges > 18);
  console.log(adultHuman);
};

excludeHuman(humanAges);

const calcAvg = function (ages) {
  const adultDog = ages.filter(age => age > 2);
  const calcAVG = adultDog.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  return calcAVG / ages.length;
};

console.log(calcAvg(ages));
