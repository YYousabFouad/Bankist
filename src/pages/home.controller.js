'use strict';

/**
 * Home / Landing page controller — DOM interaction only.
 * All pure logic lives in @/domain and @/utils.
 */

// ================= DOM ELEMENTS =================
const backToTopBtn = document.getElementById('backToTopBtn');
const energyRing = document.getElementById('energyRing');
const btnSumbit = document.querySelector('.form-submit-btn');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Circumference of a circle with r=20
const radius = 20;
const circumference = 2 * Math.PI * radius;

energyRing.style.strokeDasharray = `${circumference} ${circumference}`;
energyRing.style.strokeDashoffset = circumference;

// ================= SCROLL PROGRESS =================
function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrollRatio = scrollTop / scrollHeight;

  if (scrollTop > 100) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }

  const offset = circumference - scrollRatio * circumference;
  energyRing.style.strokeDashoffset = offset;
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// rAF-throttled passive scroll listener
let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

// ================= FORM VALIDATION =================
const nameCheckRegex = /\d/;
const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

btnSumbit.addEventListener('click', function (e) {
  e.preventDefault();
  if (!emailInput.value || !nameInput.value || !messageInput.value) {
    alert('Enter Your Information please');
  } else if (nameCheckRegex.test(nameInput.value)) {
    alert('please Enter the name correctly');
  } else if (!emailCheckRegex.test(emailInput.value.trim())) {
    alert('Enter your email correctly');
  } else {
    alert(`ok ${nameInput.value.split(' ')[0]} we gonna solve your problem`);
  }
});
