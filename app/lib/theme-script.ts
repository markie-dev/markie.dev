const themeScript = `
  (function() {
    let darkModeOverride = localStorage.getItem('theme');
    if (!darkModeOverride) {
      localStorage.setItem('theme', 'light');
      darkModeOverride = 'light';
    }
    document.documentElement.classList.add(darkModeOverride);
  })()
`

export default themeScript 