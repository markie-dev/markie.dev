const themeScript = `
  (function() {
    function getTheme() {
      let theme = localStorage.getItem('theme');
      if (!theme) {
        theme = 'light';
        localStorage.setItem('theme', theme);
      }
      return theme;
    }
    
    // Immediately set a style block to prevent flash
    let style = document.createElement('style');
    let theme = getTheme();
    style.innerHTML = theme === 'dark' ? 
      'html { background: black; color: white; }' : 
      'html { background: white; color: black; }';
    document.head.appendChild(style);
    
    // Then set the class
    document.documentElement.classList.add(theme);
    
    // Remove the style block after a short delay
    setTimeout(() => {
      style.remove();
    }, 0);
  })()
`

export default themeScript 