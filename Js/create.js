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

//get form inputs and buttons
const firstNameInput = document.querySelector('.form-input-firstName');
const lastNameInput = document.querySelector('.form-input-lastName');
const emailInput = document.querySelector('.form-input-email');
const birthYearInput = document.querySelector('.form-input-birthdate');
const idNumberInput = document.querySelector('.form-input-IdNumber');
const idCardInput = document.querySelector('.file-input');
const checkBoxInput = document.querySelector('.custom-checkbox');
const sumbitButton = document.querySelector('.btn-primary');
const nameCheckRegex = /\d/;
const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
sumbitButton.addEventListener('click', function (e) {
  const userBirthDate = new Date(birthYearInput.value);
  userBirthDate.setFullYear(userBirthDate.getFullYear() + 21);
  const user21Years = userBirthDate;
  const today = new Date();
  e.preventDefault();
  if (
    !firstNameInput.value ||
    !lastNameInput.value ||
    !emailInput.value ||
    !birthYearInput.value ||
    !idNumberInput.value ||
    !idCardInput.value ||
    !checkBoxInput.checked
  ) {
    alert('Enter the correct Information');
  } else if (
    nameCheckRegex.test(firstNameInput.value) ||
    nameCheckRegex.test(lastNameInput.value)
  ) {
    alert('Enter your name correctly without numbers');
  } else if (!emailCheckRegex.test(emailInput.value)) {
    alert('Enter your email correctly');
  } else if (user21Years > today) {
    alert(
      `Your need to be 21 at least \n You have to wait ${user21Years.getTime() - today.getTime()}`,
    );
  } else if (idCardInput.files.length === 2) {
    if (
      idCardInput.files[0].type !== 'image/png' ||
      idCardInput.files[1].type !== 'image/png'
    ) {
      alert('You need to add an image please with an extension png');
    }
  } else if (idCardInput.files.length === 1) {
    if (idCardInput.files[0].type !== 'application/pdf') {
      alert('you have to add a pdf file');
    }
  } else if (idCardInput.files.length > 2) {
    alert('The Applicant just need 2 files no more');
  } else {
    alert(
      `Ok ${firstNameInput.value} we gonna navigate you to account setup section `,
    );
    document.querySelector('.form-card-first-one').classList.add('hidden');
    document.querySelector('.form-card-second-one').classList.remove('hidden');
    document.querySelector('.step1').classList.remove('step-active');
    document.querySelector('.step2').classList.add('step-active');
  }
});
