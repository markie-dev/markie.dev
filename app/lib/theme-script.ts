const themeScript = `
  let darkModeOverride = localStorage.getItem('theme');
  if (!darkModeOverride) {
    localStorage.setItem('theme', 'light');
  }
  let isDark = darkModeOverride === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
`

export default themeScript 