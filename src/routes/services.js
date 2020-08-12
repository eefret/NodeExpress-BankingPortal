const express = require("express");
const router = express.Router();

const { accounts, writeJSON } = require("../data");

router.get("/transfer", function (req, res) {
  res.render("transfer");
});

router.post("/transfer", function (req, res) {
  var from = req.body.from;
  var to = req.body.to;
  var amount = req.body.amount;

  accounts[from].balance -= parseInt(amount);
  accounts[to].balance += parseInt(amount);
  writeJSON();
  res.render("transfer", { message: "Transfer Completed" });
});

router.get("/payment", function (req, res) {
  res.render("payment", { account: accounts.credit });
});

router.post("/payment", function (req, res) {
  var amount = req.body.amount;
  accounts.credit.balance -= parseInt(amount);
  accounts.credit.available += parseInt(amount);
  writeJSON();
  res.render("payment", {
    message: "Payment Successful",
    account: accounts.credit,
  });
});

module.exports = router;
