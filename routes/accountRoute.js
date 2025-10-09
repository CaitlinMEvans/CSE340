// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account route - delivers account management view (protected)
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// Route to build account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Process account info update
router.post(
  "/update-account",
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdate,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router;