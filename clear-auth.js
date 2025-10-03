// Clear authentication data to start from login page
if (typeof window !== 'undefined' && window.localStorage) {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('admin_info');
  localStorage.removeItem('currentHotelId');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('hotel_admins');
  console.log('✅ All authentication data cleared. Please refresh the page to start from login.');
} else {
  console.log('❌ localStorage not available');
}