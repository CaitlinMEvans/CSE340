// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process the add classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process the add inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory by classification_id (JSON)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Process the inventory update
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))

// Process the inventory deletion
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

// Route to build inventory by classification view
router.get("/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to build inventory by invId view
router.get("/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

// Routes that need Employee/Admin access
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", utilities.checkAccountType, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;