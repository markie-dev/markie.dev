const themeScript = `
  (function() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
    
    // Apply theme immediately
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;

    // Set background color immediately
    document.documentElement.style.backgroundColor = 
      theme === 'dark' ? 'rgb(10, 10, 10)' : 'rgb(255, 255, 255)';
  })()
`

export default themeScript 