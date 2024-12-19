const themeScript = `
  (function() {
    // Immediately set a style block to prevent any flash
    const style = document.createElement('style');
    style.innerHTML = 'html { background: #fff } html.dark { background: rgb(10, 10, 10) }';
    document.head.appendChild(style);

    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
    
    // Apply theme immediately
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.style.backgroundColor = 
      theme === 'dark' ? 'rgb(10, 10, 10)' : 'rgb(255, 255, 255)';
  })()
`

export default themeScript 