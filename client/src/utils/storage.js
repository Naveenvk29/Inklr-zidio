const USER_KEY = "userInfo";
const EXPIRY_KEY = "expirationTime";

const saveUserInStorage = (user, rememberMe) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const expirationTime = rememberMe
    ? Date.now() + 7 * 24 * 60 * 60 * 1000
    : Date.now() + 24 * 60 * 60 * 1000;

  localStorage.setItem(EXPIRY_KEY, expirationTime.toString());
};

const getUserFromStorage = () => {
  const user = localStorage.getItem(USER_KEY);
  const expire = localStorage.getItem(EXPIRY_KEY);

  if (expire && Date.now() > parseInt(expire)) {
    clearUserFromStorage();
    return null;
  }
  return user ? JSON.parse(user) : null;
};

const clearUserFromStorage = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

export { saveUserInStorage, getUserFromStorage, clearUserFromStorage };
