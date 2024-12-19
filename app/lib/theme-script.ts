const themeScript = `
  (function() {
    // Immediately set a style block to prevent any flash
    const style = document.createElement('style');
    style.innerHTML = 'html { background: #fff } html.dark { background: rgb(10, 10, 10) !important }';
    document.head.appendChild(style);

    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
    
    // Apply theme immediately
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  })()
`

export default themeScript 