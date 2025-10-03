// Clear all authentication and app data
localStorage.clear();
sessionStorage.clear();

// Force redirect to login page
window.location.href = '/sign-in';