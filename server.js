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

        console.log(`---------------------------------------------------------`)
        console.table(results);
        showMainMenu();
    });
};

function viewAllRoles() {
    db.query('SELECT role.id AS id, role.title AS title, department.name as department, role.salary AS salary FROM department JOIN role ON role.department_id = department.id;', (err, results) => {

        console.log(`---------------------------------------------------------`)
        console.table(results);
        showMainMenu();
    });
};

function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, results) => {

        console.log(`---------------------------------------------------------`)
        console.table(results);
        showMainMenu();
    });
};

