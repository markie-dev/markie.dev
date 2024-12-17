const themeScript = `
  let darkModeOverride = localStorage.getItem('theme');
  let isDark = darkModeOverride === 'dark' || (!darkModeOverride && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
`

export default themeScript 