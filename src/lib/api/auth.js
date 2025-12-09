const login = 'auth/login'
const logout = 'auth/logout'
const getUserInfo = 'auth/info'
const validateToken = 'auth/validateToken'
const refreshToken = 'auth/refreshToken'

const setLocale = 'auth/setLocale'
const requestRegistration = 'requestRegistration'
const passwordResetRequest = 'passwordResetRequest'
const passwordResetRequestCheck = 'passwordResetRequestCheck'
const passwordResetRequestExec = 'passwordResetRequestExec'

export {
  login as apiLogin,
  logout as apiLogout,
  getUserInfo as apiGetUserInfo,
  validateToken as apiValidateToken,
  refreshToken as apiRefreshToken,
  setLocale as apiSetLocale,
  requestRegistration as apiRequestRegistration,
  passwordResetRequest as apiPasswordResetRequest,
  passwordResetRequestCheck as apiPasswordResetRequestCheck,
  passwordResetRequestExec as apiPasswordResetRequestExec
}
