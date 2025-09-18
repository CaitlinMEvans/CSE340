const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data?.[0]?.classification_name || "Inventory"
  return res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by Inventory ID view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const vehicle = await invModel.getVehicleById(invId)
  if (!vehicle) {
    const err = new Error("Vehicle not found")
    err.status = 404
    throw err
  }
  const detail = await utilities.buildDetailView(vehicle)
  const nav = await utilities.getNav()
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  return res.render("./inventory/detail", { title, nav, detail })
}

module.exports = invCont