const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors()); //enable Access-Control-Origin from all sources using cors package

const port = process.env.port || 5000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.REACT_APP_MONGODBURL);
}

const financeSchema = new mongoose.Schema({
  //define a Schema for database objects
  amount: Number,
  date: String,
  type: String,
  notes: String,
});

const expenses = mongoose.model("expenses", financeSchema);
const incomes = mongoose.model("incomes", financeSchema);

app.post("/api/expenses", (req, res) => {
  //save expense data coming from the front end forms to database
  let expenseData = req.body;

  let expenseObj = new expenses({
    amount: expenseData.amount,
    date: expenseData.date,
    type: expenseData.type,
    notes: expenseData.notes,
  });

  expenseObj.save();
});

app.post("/api/income", (req, res) => {
  //save income data coming from the front end forms to database
  let incomeData = req.body;

  let incomeObj = new incomes({
    amount: incomeData.amount,
    date: incomeData.date,
    type: incomeData.type,
    notes: incomeData.notes,
  });

  incomeObj.save();
});

app.get("/api/expenses", (req, res) => {
  expenses.find({}).then((query) => res.send(query)); //get expense data from the database
});

app.get("/api/income", (req, res) => {
  incomes.find({}).then((query) => res.send(query)); //get income data from the database
});

app.delete("/api/deleteexpenses", (req, res) => {
  let deleteDataId = req.body.id; //delete data in database for a specific ID
  //console.log("fetch delete done", deleteDataId);
  expenses
    .deleteOne({ _id: new ObjectId(deleteDataId) })
    .then(console.log("deleted"));
});

app.delete("/api/deleteincome", (req, res) => {
  let deleteDataId = req.body.id; //delete data in database for a specific ID
  //console.log("fetch delete done", deleteDataId);
  incomes
    .deleteOne({ _id: new ObjectId(deleteDataId) })
    .then(console.log("deleted"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
