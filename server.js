const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db",
});

connection.connect((err) => {
  if (err) throw err;
  begin();
});

const begin = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add a employee",
        "Update employee",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          break;

        case "View all roles":
          break;

        case "View all employees":
          break;

        case "Add a department":
          break;

        case "Add a role":
          break;

        case "Add a employee":
          break;

        case "Update employee":
          break;

        case "exit":
          break;

        default:
          console.log("That is not a valid choice");
          break;
      }
    });
};
