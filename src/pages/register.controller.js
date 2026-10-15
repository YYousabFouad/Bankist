'use strict';

/**
 * Registration page controller — DOM interaction only.
 * Pure logic imported from @/domain, @/storage.
 */

import { validateNationalId, calculateAge } from '@/domain/calculations';
import { getAccounts, addAccount, findAccount } from '@/storage/account.repository';

// ================= DOM ELEMENTS =================
const firstNameInput = document.querySelector('.form-input-firstName');
const lastNameInput = document.querySelector('.form-input-lastName');
const emailInput = document.querySelector('.form-input-email');
const birthYearInput = document.querySelector('.form-input-birthdate');
const idNumberInput = document.querySelector('.form-input-IdNumber');
const idCardInput = document.querySelector('.file-input');
const checkBoxInput = document.querySelector('.custom-checkbox');
const sumbitButton = document.querySelector('.btn-primary1');
const sumbitBtn = document.querySelector('.btn-primary2');
const backBtn = document.querySelector('.btn-secondary');
const numberCheckRegex = /\d/;
const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let registrationReady = false;

// ================= USERNAME GENERATION =================
function createUserName(firstName, lastName) {
  const userName = document.querySelector('#username');
  const accounts = getAccounts();
  const initials = `${firstName.trim()[0]}${lastName.trim()[0]}`.toLowerCase();
  let candidate;
  do {
    candidate = `${initials}${Math.trunc(Math.random() * 9000) + 1000}`;
  } while (findAccount(accounts, candidate));
  userName.value = candidate;
}

// ================= STEP 1 VALIDATION =================
sumbitButton.addEventListener('click', function (e) {
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
  } else if (!validateNationalId(idNumberInput.value)) {
    alert('Enter Your National id number correctly');
  } else if (!Number.isFinite(calculateAge(birthYearInput.value))) {
    alert('Enter a valid birth date');
  } else if (calculateAge(birthYearInput.value) < 21) {
    alert(
      `You need to be at least 21 years old. You have to wait ${Math.trunc(((21 - calculateAge(birthYearInput.value)) * 12))} months`,
    );
  } else {
    // Validate file types
    let filesValid = true;
    if (idCardInput.files.length === 1) {
      if (idCardInput.files[0].type !== 'application/pdf') {
        alert('You have to add a pdf file');
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
    if (filesValid) {
      registrationReady = true;
      alert(`Ok ${firstNameInput.value} we gonna navigate you to account setup section`);
      document.querySelector('.form-card-first-one').classList.add('hidden');
      document.querySelector('.form-card-second-one').classList.remove('hidden');
      document.querySelector('.step1').classList.remove('step-active');
      document.querySelector('.step2').classList.add('step-active');
      createUserName(firstNameInput.value, lastNameInput.value);
    }
  }
});

// ================= STEP 2: CREATE ACCOUNT =================
sumbitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (!registrationReady) {
    alert('Complete and validate your personal information first');
    return;
  }
  const userName = document.querySelector('#username');
  const pinDigit1 = document.querySelector('.pin-digit1');
  const pinDigit2 = document.querySelector('.pin-digit2');
  const pinDigit3 = document.querySelector('.pin-digit3');
  const pinDigit4 = document.querySelector('.pin-digit4');
  const pin = [pinDigit1, pinDigit2, pinDigit3, pinDigit4]
    .map(input => input.value)
    .join('');
  if (/^\d{4}$/.test(pin) && userName.value) {
    const newAccount = {
      owner: `${firstNameInput.value} ${lastNameInput.value}`,
      email: emailInput.value,
      birthDate: birthYearInput.value,
      idNumber: idNumberInput.value,
      movements: [2000],
      username: userName.value,
      pin: Number(pin),
      movementsDates: [new Date().toISOString()],
      interestRate: 1.2,
      currency: 'EGP',
      locale: 'en-EG',
    };
    let accounts = getAccounts();
    try {
      addAccount(accounts, newAccount);
    } catch (error) {
      alert(error.message);
      createUserName(firstNameInput.value, lastNameInput.value);
      return;
    }
    alert('You are Gonna Go To login page to go to your account');
    window.location.href = '../HTMLs/login.html';
  } else {
    alert('Enter all four PIN digits');
  }
});

// ================= BACK BUTTON =================
backBtn.addEventListener('click', function (e) {
  e.preventDefault();
  registrationReady = false;
  document.querySelector('.form-card-first-one').classList.remove('hidden');
  document.querySelector('.form-card-second-one').classList.add('hidden');
  document.querySelector('.step1').classList.add('step-active');
  document.querySelector('.step2').classList.remove('step-active');
});
