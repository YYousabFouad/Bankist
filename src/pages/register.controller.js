'use strict';

/**
 * Registration page controller — DOM interaction only.
 * Pure logic imported from @/domain, @/storage.
 */

import { validateNationalId, calculateAge } from '../domain/calculations.js';
import { getAccounts, addAccount, findAccount } from '../storage/account.repository.js';
import { showFeedback, clearFeedback } from '../utils/feedback.js';

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
const registrationFeedback = document.querySelector('[data-feedback="registration"]');
const setupFeedback = document.querySelector('[data-feedback="setup"]');
const refuseRegistration = (title, message, suggestion, target = registrationFeedback) =>
  showFeedback(target, { title, message, suggestion });

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
  clearFeedback(registrationFeedback);
  if (
    !firstNameInput.value ||
    !lastNameInput.value ||
    !emailInput.value ||
    !birthYearInput.value ||
    !idNumberInput.value ||
    idCardInput.files.length === 0 ||
    !checkBoxInput.checked
  ) {
    refuseRegistration('Some details are missing', 'We could not verify the application because one or more required fields are empty.', 'Complete every field, upload your ID, and accept the terms before continuing.');
  } else if (
    numberCheckRegex.test(firstNameInput.value) ||
    numberCheckRegex.test(lastNameInput.value)
  ) {
    refuseRegistration('Check your name', 'Names cannot contain numbers.', 'Enter your first and last name as they appear on your ID.');
  } else if (!emailCheckRegex.test(emailInput.value)) {
    refuseRegistration('Email address looks incomplete', 'We need a valid email to secure your account and send updates.', 'Use an address in the format name@example.com.');
  } else if (!validateNationalId(idNumberInput.value)) {
    refuseRegistration('National ID could not be verified', 'The ID number must contain a valid 14-digit Egyptian National ID.', 'Check the number against your ID card and try again.');
  } else if (!Number.isFinite(calculateAge(birthYearInput.value))) {
    refuseRegistration('Birth date is missing or invalid', 'We could not calculate your age from the date entered.', 'Choose your full date of birth from the date picker.');
  } else if (calculateAge(birthYearInput.value) < 21) {
    refuseRegistration('You are not eligible yet', 'Applicants need to be at least 21 years old.', `You can apply in about ${Math.trunc((21 - calculateAge(birthYearInput.value)) * 12)} months. Please return once you meet the age requirement.`);
  } else {
    // Validate file types
    let filesValid = true;
    if (idCardInput.files.length === 1) {
      if (idCardInput.files[0].type !== 'application/pdf') {
        refuseRegistration('Unsupported document format', 'The selected single file is not a PDF.', 'Upload one PDF, or upload two PNG images showing both sides of your ID.');
        filesValid = false;
      }
    } else if (idCardInput.files.length === 2) {
      if (
        idCardInput.files[0].type !== 'image/png' ||
        idCardInput.files[1].type !== 'image/png'
      ) {
        refuseRegistration('We could not read these images', 'When uploading two files, both must be PNG images.', 'Choose two PNG files, one for each side of your ID, or upload a single PDF.');
        filesValid = false;
      }
    } else {
      refuseRegistration('Please review your ID files', 'We accept one PDF or two PNG images.', 'Remove extra files and use one of the supported formats.');
      filesValid = false;
    }
    if (filesValid) {
      registrationReady = true;
      clearFeedback(setupFeedback);
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
  clearFeedback(setupFeedback);
  if (!registrationReady) {
    refuseRegistration('Personal details need attention', 'Account setup is locked until your application details are verified.', 'Return to the first step and complete each required field.', setupFeedback);
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
      refuseRegistration('We could not create your account', error.message, 'Please try again. If this continues, contact support.', setupFeedback);
      createUserName(firstNameInput.value, lastNameInput.value);
      return;
    }
    window.location.href = '../HTMLs/login.html';
  } else {
    refuseRegistration('Your PIN is incomplete', 'A secure PIN must contain exactly four digits.', 'Fill all four boxes using numbers from 0 to 9.', setupFeedback);
  }
});

// ================= BACK BUTTON =================
backBtn.addEventListener('click', function (e) {
  e.preventDefault();
  clearFeedback(setupFeedback);
  registrationReady = false;
  document.querySelector('.form-card-first-one').classList.remove('hidden');
  document.querySelector('.form-card-second-one').classList.add('hidden');
  document.querySelector('.step1').classList.add('step-active');
  document.querySelector('.step2').classList.remove('step-active');
});
