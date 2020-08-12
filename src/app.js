const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

const accountData = fs.readFileSync("src/json/accounts.json", {
  encoding: "utf8",
});
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync("src/json/users.json", { encoding: "utf8" });
const users = JSON.parse(userData);

app.get("/", function (req, res) {
  res.render("index", { title: "Account Summary", accounts: accounts });
});

app.get("/savings", function (req, res) {
  res.render("account", { account: accounts.savings });
});

app.get("/checking", function (req, res) {
  res.render("account", { account: accounts.checking });
});

app.get("/credit", function (req, res) {
  res.render("account", { account: accounts.credit });
});

app.get("/profile", function (req, res) {
  res.render("profile", { user: users[0] });
});

app.get("/transfer", function (req, res) {
  res.render("transfer");
});

app.post("/transfer", function (req, res) {
  var from = req.body.from;
  var to = req.body.to;
  var amount = req.body.amount;

  accounts[from].balance -= parseInt(amount);
  accounts[to].balance += parseInt(amount);
  var accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync(
    path.join(__dirname, "/json/accounts.json"),
    accountsJSON,
    "utf-8"
  );
  res.render("transfer", { message: "Transfer Completed" });
});

app.get("/payment", function (req, res) {
  res.render("payment", { account: accounts.credit });
});

app.post("/payment", function (req, res) {
  var amount = req.body.amount;
  accounts.credit.balance -= parseInt(amount);
  accounts.credit.available += parseInt(amount);
  var accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync(
    path.join(__dirname, "/json/accounts.json"),
    accountsJSON,
    "utf-8"
  );
  res.render("payment", {
    message: "Payment Successful",
    account: accounts.credit,
  });
});

app.listen(3000, function () {
  console.log("PS Project Running on port 3000!");
});
