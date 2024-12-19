const themeScript = `
  (function() {
    // Block rendering until we've done our work
    document.documentElement.style.visibility = 'hidden';

    function getTheme() {
      let theme = localStorage.getItem('theme');
      if (!theme) {
        theme = 'light';
        localStorage.setItem('theme', theme);
      }
      return theme;
    }
    
    // Set theme class and initial styles
    let theme = getTheme();
    document.documentElement.classList.add(theme);
    
    // Set initial background color
    const style = document.createElement('style');
    style.textContent = theme === 'dark' 
      ? 'html { background-color: rgb(10, 10, 10); color: rgb(250, 250, 250); }' 
      : 'html { background-color: rgb(255, 255, 255); color: rgb(10, 10, 10); }';
    document.head.appendChild(style);

    // Unblock rendering
    requestAnimationFrame(() => {
      document.documentElement.style.visibility = '';
    });
  })()
`

export default themeScript 