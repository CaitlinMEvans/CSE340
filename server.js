/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")  

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// 404 catch-all (must be AFTER all routes)
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: `This page hit 88 mph and vanished into another timeline. <br> <a href="/">Return to 1985 (Home)</a>.`
  })
})

//  test route for 500 error
app.get("/error-test", utilities.handleErrors(async (req, res) => {
  throw new Error("Intentional crash for testing 500 flow")
}))

/* ***********************
 * Express Error Handler (last)
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)
  const nav = await utilities.getNav()
  const status = err.status || 500
  const message =
    status === 404
      ? err.message
      : `Flux capacitor misfire. Our timeline diverged.<br><a href="/">Return to 1985 (Home)</a>.`

  res
    .status(status)
    .render("errors/error", {
      title: status === 404 ? "Great Scott! 404" : "Uh-oh! 500",
      message,
      nav
    })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})