'use strict';
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
const numberCheckRegex = /\d/;
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
    numberCheckRegex.test(firstNameInput.value) ||
    numberCheckRegex.test(lastNameInput.value)
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

const sumbitBtn = document.querySelector('.btn-primary2');
sumbitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const userName = document.querySelector('#username');
  const pinDigit1 = document.querySelector('.pin-digit1');
  const pinDigit2 = document.querySelector('.pin-digit2');
  const pinDigit3 = document.querySelector('.pin-digit3');
  const pinDigit4 = document.querySelector('.pin-digit4');
  const pinDigits = [
    Number(pinDigit1.value),
    Number(pinDigit2.value),
    Number(pinDigit3.value),
    Number(pinDigit4.value),
  ];
  console.log(pinDigits);
  if (pinDigits.every(pindigit => !isNaN(pindigit))) {
    console.log('Successfully Created');
    const newAccount = {
      owner: `${firstNameInput.value} ${lastNameInput.value}`,
      email: `${emailInput.value}`,
      birthDate: `${birthYearInput.value}`,
      idNumber: `${idNumberInput.value}`,
      movements: [],
      username: `${userName.value}`,
      pin: `${Number(pinDigits.join())}`,
      movementsDates: [],
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
  } else {
    alert(`You have to change pin number to a number`);
  }
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
