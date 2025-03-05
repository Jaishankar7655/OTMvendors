// sessionUtils.js
// Set user data in both session storage and local storage
export const setUserSession = (userData) => {
  if (!userData) return;
  
  // Calculate expiry time (10 days from now) if not already set
  if (!userData.expiryTime) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    userData.expiryTime = expiryDate.getTime();
  }
  
  // Store in both storages for persistence
  sessionStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("userData", JSON.stringify(userData));
};

// Get user data from storage with fallback to localStorage
export const getUserSession = () => {
  let userData = sessionStorage.getItem("userData");
  
  // If not in sessionStorage, try localStorage (for page refreshes)
  if (!userData) {
    userData = localStorage.getItem("userData");
    
    // If found in localStorage but not in sessionStorage, restore to sessionStorage
    if (userData) {
      sessionStorage.setItem("userData", userData);
    }
  }
  
  if (!userData) return null;
  
  try {
    const parsedData = JSON.parse(userData);
    
    // Check if token has expired
    if (parsedData.expiryTime && new Date().getTime() > parsedData.expiryTime) {
      clearUserSession();
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Check if user is logged in with valid session
export const isUserLoggedIn = () => {
  return getUserSession() !== null;
};

// Clear user session from both storages (logout)
export const clearUserSession = () => {
  sessionStorage.removeItem("userData");
  localStorage.removeItem("userData");
};

// Update specific user data fields
export const updateUserSession = (updates) => {
  const userData = getUserSession();
  if (userData) {
    const updatedData = { ...userData, ...updates };
    setUserSession(updatedData);
    return updatedData;
  }
  return null;
};

// Extend session duration (call this on activity)
export const refreshUserSession = () => {
  const userData = getUserSession();
  if (userData) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    userData.expiryTime = expiryDate.getTime();
    setUserSession(userData);
  }
};