// Tap-to-toggle for <LangNote> popovers on touch devices.
document.querySelectorAll('.lang-note').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    el.classList.toggle('lang-note-active');
    const popover = el.querySelector('.lang-note-popover');
    if (popover) popover.classList.toggle('!block');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.lang-note-active').forEach((el) => {
    el.classList.remove('lang-note-active');
    el.querySelector('.lang-note-popover')?.classList.remove('!block');
  });
});
