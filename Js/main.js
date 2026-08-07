'use strict';
//Buttons
const backToTopBtn = document.getElementById('backToTopBtn');
const energyRing = document.getElementById('energyRing');
const btnSumbit = document.querySelector('.form-submit-btn');
//Form Inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
// Circumference of a circle with r=20 is 2 * PI * 20 ≈ 125.66
const radius = 20;
const circumference = 2 * Math.PI * radius;

// Set initial stroke array values
energyRing.style.strokeDasharray = `${circumference} ${circumference}`;
energyRing.style.strokeDashoffset = circumference;

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  // Calculate scroll ratio (0.0 to 1.0)
  const scrollRatio = scrollTop / scrollHeight;

  // Show/Hide button depending on scroll position
  if (scrollTop > 100) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }

  // Calculate energy ring offset
  const offset = circumference - scrollRatio * circumference;
  energyRing.style.strokeDashoffset = offset;
}

// Scroll to top smooth click handler
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Listen to scroll events
window.addEventListener('scroll', updateScrollProgress);
//================Form===================

const nameCheckRegex = /\d/;
const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
btnSumbit.addEventListener('click', function (e) {
  //prevent the page from reload when sumbit
  e.preventDefault();
  //Validate the form in contact section
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
