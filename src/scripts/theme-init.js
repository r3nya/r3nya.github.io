// Apply the saved preference before paint; CSS follows the system otherwise.
try {
  const theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
  }
} catch {
  // Storage may be unavailable; the system theme still works.
}
