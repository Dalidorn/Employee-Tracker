const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
// Import and require Inquirer
const inquirer = require("inquirer");
// Import Library for handling table display in console
const cTable = require('console.table')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // MySQL username,
        user: "root",
        // TODO: Add MySQL password here
        password: "MySQL123",
        database: "employee_db"
    },
    console.log("Connected to the employee_db database.")
);

//-------------------------------------------------------------------------


// ---HOME PAGE LOGIC---

function showHomePage() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an option to get started!",
            name: "homePage",
            choices: ["View All Employees", "View All Roles", `View All Departments`, "Add Employee", "Add Role", `Add Department`, "Update Employee Role", `Quit`]
        }
    ]).then((response) => {
        switch (response.homePage) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Roles":
                viewAllRoles();
                break;

            case "View All Departments":
                viewAllDepartments();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Quit":
                process.exit();
        }
    })
};


// ---VIEW SCREENS LOGIC---

function viewAllEmployees() {
    db.query(`SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name as department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON employee.manager_id = m.id ORDER BY employee.id;`, (err, results) => {

        console.log("---------------------------------------------------------")
        console.table(results);
        showMainMenu();
    });
};

function viewAllRoles() {
    db.query(`SELECT role.id AS id, role.title AS title, department.name as department, role.salary AS salary FROM department JOIN role ON role.department_id = department.id;`, (err, results) => {

        console.log("---------------------------------------------------------")
        console.table(results);
        showMainMenu();
    });
};

function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, results) => {

        console.log("---------------------------------------------------------")
        console.table(results);
        showMainMenu();
    });
};

// ---CREATE LOGIC---

//employee
function addEmployee() {
    //set up choices in arrays for use in the prompt
    let roles = [];
    let roleIDs = [];
    let managers = [];
    let managerIDs = [];

    //query db for role info
    db.query(`SELECT id, title FROM role`, (err, results) => {
        results.forEach(role => {
            roles.push(role.title);
            roleIDs.push(role.id);
        });
    });

    //query db for manager info
    db.query(`SELECT first_name, last_name, id FROM employee`, (err, results) => {
        results.forEach(employee => {
            managers.push(`${employee.firstName} ${employee.lastName}`);
            managerIDs.push(employee.id);
        });
        //add option for no manager
        managers.push("No Manager")
    });

    //start prompt
    inquirer.prompt([
        {
            type: "input",
            message: "What's the new employee's first name?",
            name: "firstName",
        },
        {
            type: "input",
            message: "And their last name?",
            name: "lastName",
        },
        {
            type: "list",
            message: "Now, what is the employee's role?",
            name: "role",
            choices: roles
        },
        {
            type: "list",
            message: "Finally, who is the new employee's manager?",
            name: "manager",
            choices: managers
        }
    ]).then((response) => {
        //determine if no manager was selected
        let managerID = 0;
        if(response.manager === "No Manager") {
            managerID = null;
        } else {
            managerID = managerIDs[managers.indexOf(response.manager)]
        };

        //insert everything into the db
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', ${roleIDs[roles.indexOf(response.role)]}, ${managerID})`, (err, results) => {
            showMainMenu();
        });
    });
};

//role
function addRole() {
    //set up choices in arrays for use in the prompt
    let departments = []
    let departmentIDs = []

    //query db for department info
    db.query("SELECT id, name FROM department", (err, results) => {
        results.forEach(dept => {
            departments.push(dept.name);
            departmentIDs.push(dept.id);
        });
    });

    //start prompt
    inquirer.prompt([
        {
          type: "input",
          message: "What's the name of this role?",
          name: "role",
        },
        {
          type: "input",
          message: "And the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "Finally, which department does the role belong to?",
          name: "department",
          choices: departments
        },
    ]).then((response) => {
        //insert everything into the db
        db.query(`INSERT INTO role (title, salary, department_id) VALUE ("${response.role}", "${response.salary}", "${departmentIDs[departments.indexOf(response.department)]}")`, (err, results) => {
            showMainMenu();
        });
    });
};

//department
function addDepartment() {
    //start prompt
    inquirer.prompt([
        {
        type: "input",
        message: "What's the name of the new department?",
        name: "newDepartment",
        }
    ]).then((response) => {
        //insert everything into the db
        db.query(`INSERT INTO department (name) VALUE ("${response.newDepartment}")`, (err, results) => {
            showMainMenu();
        });
    });
};

