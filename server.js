const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db",
});

// figlet("Employee Tracker!!", async (err, transformed) => {
//   if (err) throw err;
//   console.log(transformed);
// });

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
          viewAllEmployees();
          break;

        case "Add a department":
          addDepartment();
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
          connection.end();
          console.log("Have a nice day!");
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

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    console.log(`All Employees:`);
    res.forEach((employee) => {
      console.log(
        `ID: ${employee.id}, Name: ${employee.first_name} ${employee.last_name}, Role ID: ${employee.role_id}, Manager ID: ${employee.manager_id}`
      );
    });
    begin();
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the department you would like to add?",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        answer.department,
        (err, res) => {
          console.log(
            `you successfully added ${answer.department.toUpperCase()}`
          );
        }
      );
      begin();
    });
};
