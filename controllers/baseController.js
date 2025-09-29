const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // Flash message added for session and messages week 4 - removed 
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController