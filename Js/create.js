'use strict';
// ================= ACCOUNTS DATA =================

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  username: 'js',
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
  username: 'jd',
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
function generateNumber() {
  return Math.trunc(Math.random() * 9000) + 1000;
}

const generatedNumbers = [];
function creatUserName(firstName, lastName) {
  const userName = document.querySelector('#username');
  const firstnamelower = firstName.toLowerCase()[0];
  const lastnamelower = lastName.toLowerCase()[0];
  let generatedNumber = generateNumber();
  while (generatedNumbers.includes(generatedNumber)) {
    generatedNumber = generateNumber();
  }
  generatedNumbers.push(generatedNumber);
  userName.value = `${firstnamelower + lastnamelower + generatedNumber}`;
}

//============================step1============================
//get form inputs and buttons
const firstNameInput = document.querySelector('.form-input-firstName');
const lastNameInput = document.querySelector('.form-input-lastName');
const emailInput = document.querySelector('.form-input-email');
const birthYearInput = document.querySelector('.form-input-birthdate');
const idNumberInput = document.querySelector('.form-input-IdNumber');
const idCardInput = document.querySelector('.file-input');
const checkBoxInput = document.querySelector('.custom-checkbox');
const sumbitButton = document.querySelector('.btn-primary1');
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
    idCardInput.files.length === 0 ||
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
  } else if (idNumberInput.value.length !== 14) {
    alert('Enter Your National id number correctly');
  } else if (user21Years > today) {
    alert(
      `Your need to be 21 at least \n You have to wait ${Math.trunc(((user21Years.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 12)}Months`,
    );
  } else {
    // Validate file types first
    let filesValid = true;

    if (idCardInput.files.length === 1) {
      if (idCardInput.files[0].type !== 'application/pdf') {
        alert('you have to add a pdf file');
        filesValid = false;
      }
    } else if (idCardInput.files.length === 2) {
      if (
        idCardInput.files[0].type !== 'image/png' ||
        idCardInput.files[1].type !== 'image/png'
      ) {
        alert('You need to add an image please with an extension png');
        filesValid = false;
      }
    } else {
      alert('The Applicant just needs 1 PDF or 2 PNG files, no more');
      filesValid = false;
    }

    // Only navigate if everything actually passed
    if (filesValid) {
      alert(
        `Ok ${firstNameInput.value} we gonna navigate you to account setup section `,
      );
      document.querySelector('.form-card-first-one').classList.add('hidden');
      document
        .querySelector('.form-card-second-one')
        .classList.remove('hidden');
      document.querySelector('.step1').classList.remove('step-active');
      document.querySelector('.step2').classList.add('step-active');
      //==================Step2==================================

      creatUserName(firstNameInput.value, lastNameInput.value);
    }
  }
});

//=============Sumbit & Create Account==========================
const pinDigit1 = document.querySelector('.pin-digit1');
const pinDigit2 = document.querySelector('.pin-digit2');
const pinDigit3 = document.querySelector('.pin-digit3');
const pinDigit4 = document.querySelector('.pin-digit4');
const sumbitBtn = document.querySelector('.btn-primary2');
sumbitBtn.addEventListener('click', function (e) {
  e.preventDefault();
});

//==============Back to Personal info===========================
const backBtn = document.querySelector('.btn-secondary');
backBtn.addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('.form-card-first-one').classList.remove('hidden');
  document.querySelector('.form-card-second-one').classList.add('hidden');
  document.querySelector('.step1').classList.add('step-active');
  document.querySelector('.step2').classList.remove('step-active');
});
