export function showFeedback(element, { title, message, suggestion, type = 'error' }) {
  if (!element) return;
  element.className = `feedback feedback--${type}`;
  element.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = title;
  const detail = document.createElement('span');
  detail.textContent = message;
  const nextStep = document.createElement('span');
  nextStep.className = 'feedback__suggestion';
  nextStep.textContent = suggestion;
  element.append(heading, detail, nextStep);
  element.hidden = false;
}

export function clearFeedback(element) {
  if (!element) return;
  element.hidden = true;
  element.replaceChildren();
}
