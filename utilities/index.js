const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = ""
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="/inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + " " + vehicle.inv_model +
        ' details"><img src="' + vehicle.inv_thumbnail +
        '" alt="Image of ' + vehicle.inv_make + " " + vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' +
        vehicle.inv_make + " " + vehicle.inv_model + ' details">' +
        vehicle.inv_make + " " + vehicle.inv_model + "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* Build vehicle detail HTML */
Util.buildDetailView = function (v) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD"
  }).format(v.inv_price)
  const miles = new Intl.NumberFormat("en-US").format(v.inv_miles)

  let html = ''
  html += '<section id="vehicle-detail" aria-labelledby="veh-title">'
  html +=   '<div class="vehicle-hero">'
  html +=     `<img src="${v.inv_image}" alt="Image of ${v.inv_year} ${v.inv_make} ${v.inv_model}" />`
  html +=   "</div>"
  html +=   '<div class="vehicle-specs">'
  html +=     `<h2 id="veh-title">${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>`
  html +=     `<p class="veh-price">${price}</p>`
  html +=     '<ul class="veh-meta">'
  html +=       `<li><strong>Mileage:</strong> ${miles}</li>`
  html +=       `<li><strong>Color:</strong> ${v.inv_color}</li>`
  html +=       `<li><strong>Classification:</strong> ${v.classification_name}</li>`
  html +=     '</ul>'
  html +=     `<p class="veh-desc">${v.inv_description}</p>`
  html +=   "</div>"
  html += "</section>"
  return html
}

module.exports = Util