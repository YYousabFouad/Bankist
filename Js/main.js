//1. Button Navigation
//2. Authentication Check
//3. Session Timeout
//4. Dark / Light Mode

const backToTopBtn = document.getElementById('backToTopBtn');
const energyRing = document.getElementById('energyRing');

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
