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
          addRole();
          break;

        case "Add a employee":
          addEmployee();
          break;

        case "Update employee":
          updateEmployee();
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

const addRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    inquirer
      .prompt([
        {
          name: "roleName",
          type: "input",
          message: "What is the name of the new role?",
        },
        { name: "salary", type: "input", message: "What is the salary?" },
        {
          name: "department",
          type: "list",
          message: "What department are you adding this role to?",
          choices: function () {
            var departments = [];
            res.forEach((res) => {
              departments.push(res.name);
            });
            return departments;
          },
        },
      ])
      .then((answer) => {
        console.log(answer);
        const department = answer.department;
        console.log(department);
        connection.query("SELECT * FROM department", (err, res) => {
          for (let i = 0; i < res.length; i++) {
            if (department == res[i].name) {
              var id = res[i].id;
              var salary = parseInt(answer.salary);
              console.log(salary, typeof salary);
              console.log(id, typeof id);
              let query =
                "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
              let values = [answer.roleName, salary, id];
              console.log(values, "hello");
              connection.query(query, values, (err, res) => {
                if (err) throw err;
                console.log("you have successfully added a role");
              });
            }
          }
        });
        begin();
      });
  });
};

const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the Employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name",
        },
        {
          name: "roleTitle",
          type: "list",
          message: "What role is this employee in?",
          choices: function () {
            roles = [];
            res.forEach((res) => {
              roles.push(res.title);
            });
            return roles;
          },
        },
      ])
      .then((answer) => {
        console.log(answer);
        const roleTitle = answer.roleTitle;
        connection.query("SELECT * FROM role", (err, res) => {
          for (let i = 0; i < res.length; i++) {
            if (roleTitle == res[i].title) {
              console.log(roleTitle);
              var id = res[i].id;
              var query =
                "INSERT INTO employee (first_name,last_name, role_id) VALUES (?,?,?)";
              var values = [answer.firstName, answer.lastName, id];
              console.log(values);
              connection.query(query, values, (err, res) => {
                console.log("You have successfully added a new employee!");
              });
              viewAllEmployees();
            }
          }
        });
      });
  });
};

const updateEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Which employee's role is being updated?",
          choices: function () {
            employees = [];
            res.forEach((res) => {
              employees.push(res.first_name);
            });
            return employees;
          },
        },
      ])
      .then((answer) => {
        console.log(answer);
        const name = answer.employeeName;
        connection.query("SELECT * FROM role", (err, res) => {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: function () {
                  roles = [];
                  res.forEach((res) => {
                    roles.push(res.title);
                  });
                  return roles;
                },
              },
            ])
            .then((answer) => {
              console.log(answer);
              const role = answer.role;
              console.log(role);
              connection.query(
                "SELECT * FROM role WHERE title = ?",
                role,
                (err, res) => {
                  if (err) throw err;
                  console.log(res);
                  var roleId = res[0].id;
                  console.log(roleId);
                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE first_name = ?",
                    [roleId, name],
                    (err, res) => {
                      if (err) throw err;
                      console.log(`You have successfully updated ${name}!`);
                    }
                  );
                  begin();
                }
              );
            });
        });
      });
  });
};
