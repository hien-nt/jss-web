// src/utils/getUserInfor.js

const getUserInfor = () => {
  const userString = localStorage.getItem("user"); // Retrieve the user string from localStorage
  if (userString) {
    try {
      const user = JSON.parse(userString);
      // Safely check if the token exists in the user object
      if (user && user.token) {
        // console.log(user);
        return user; // Return the token
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      // Handle parsing error (maybe corrupted data in localStorage)
    }
  }
  return null; // Return null if there is no user string or if token is not available
};

export default getUserInfor;
