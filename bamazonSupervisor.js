require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table3");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    supervisorPrompt();
});

function supervisorPrompt() {
    inquirer.prompt({
        name: "supervisor",
        type: "list",
        message: "Please select an option from the following: ",
        choices: ["View Product Sales By Department", "Create New Department", "Exit"]
    }).then(answer => {
        switch(answer.supervisor) {
            case "View Product Sales By Department":
                return readSales();
            case "Create New Department":
                return createDepartment();
            case "Exit":
                console.log("Logged out.");
                return connection.end();
            default:
                console.log("Please enter a valid option");
                return supervisorPrompt();
        }
    })
}

//reads from DB, returns each item listing
function readSales() {
    console.log(`BAMAZON PRODUCT SALES:`);
    //create new table object
    var table = new Table({
        head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]
    });

    //query to read all items
    var query = "SELECT d.department_id, d.department_name, d.overhead_costs, SUM(b.product_sales) as product_sales ";
    query += "FROM departments as d ";
    query += "INNER JOIN bamazon as b ON d.department_name = b.department_Name ";
    query += "GROUP BY d.department_name";

    connection.query(query, function (err, res) {
        if (err) throw err;
        //new line
        console.log(`\n`);

        //iterates over response length, pushes each item to the table array 
        for (let i = 0; i < res.length; i++) {
            let departmentID = res[i].department_id;
            let departmentName = res[i].department_name;
            let overheadCost = parseInt(res[i].overhead_costs);
            let productSales = res[i].product_sales;
            let totalProfit = (productSales - overheadCost)

            //push the data for each item into the table row
            table.push([departmentID, departmentName, overheadCost, productSales, totalProfit])
        }
        //log the table to the console
        console.log(table.toString());
        return returnMain();
    })
};

function createDepartment() {
    inquirer.prompt({
        name: "departmentName",
        type: "text",
        message: "Please enter the name of the depatment you'd like to create: ",
    }).then(answer => {
        let deptName = answer.departmentName;

        inquirer.prompt({
            name: "departmentOverhead",
            type: "number",
            message: "Please enter the overhead costs for this department (Do not use symbols): "
        }).then(answer => {
            
            let deptOverhead = answer.departmentOverhead;

            var query = "INSERT INTO departments SET ?"
            connection.query(query,[{department_name: deptName, overhead_costs: deptOverhead}], function (err, res) {
                if (err) throw err;

                console.log(`${deptName} has been added to Departments. Thank you!`);
                return returnMain();
            })
        })
    })
}

//option to return back to the main menu without distorting UI.
function returnMain () {
    inquirer.prompt({
        name: "return",
        message: "Press any key and [Enter] to return to the main menu."
    }).then(answer => {
        if (answer) {
            supervisorPrompt();
        }
    })
}