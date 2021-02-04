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
          viewDepartments();
          break;

        case "View all roles":
          viewAllRoles();
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
          connection.end();
          break;

        default:
          console.log("That is not a valid choice");
          break;
      }
    });
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    console.log(`All Departments:`);
    res.forEach((department) => {
      console.log(`ID:${department.id}, Name: ${department.name}`);
    });
    begin();
  });
};

const viewAllRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    console.log(`All Roles:`);
    res.forEach((role) => {
      console.log(
        `ID: ${role.id}, Title: ${role.title}, Salary: $${role.salary}K, Department ID: ${role.department_id}`
      );
    });
    begin();
  });
};
