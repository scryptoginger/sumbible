// Tap-to-toggle for <IconTooltip> popovers on touch devices.
document.querySelectorAll('.icon-tooltip').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    el.classList.toggle('icon-tooltip-active');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.icon-tooltip-active').forEach((el) => {
    el.classList.remove('icon-tooltip-active');
  });
});
