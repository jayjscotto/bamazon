require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table3");
let maxNum = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    managePrompt();
});

//option prompt for manager
function managePrompt() {
    inquirer.prompt({
        name: "manager",
        type: "list",
        message: "Please select an option from the following: ",
        choices: ["View All Products", "View Low Inventory(<15)", "Add To Inventory", "Add New Product", "Exit"]
    }).then(answer => {
        console.log(answer.manager);
        switch(answer.manager) {
            case "View All Products":
                return readDB();
            case "View Low Inventory(<15)":
                return readLowQuantity();
            case "Add To Inventory":
                return addInventory();
            case "Add New Product":
                return addNewProduct();
            case "Exit":
                console.log("Logged out.")
                return connection.end();
            default:
                console.log("Please enter a valid option");
                return managePrompt();
        }
    })
}

//reads from DB, returns each item listing
function readDB() {
    console.log("WELCOME TO BAMAZON: B(ETTER THAN)AMAZON");
    //create new table object
    const table = new Table ({
        head: ["Item ID", "Product Name", "Price", "Department", "Quantity"]
    })
    //query to read all items
    var query = "SELECT * FROM bamazon"
    connection.query(query, function (err, res) {
        if (err) throw err;
        //new line
        console.log(`\n`)
        //iterates over response length, pushes each item to the array 
        for (let i = 0; i < res.length; i++) {
            let itemID = res[i].item_id;
            let productName = res[i].product_name;
            let price = parseInt(res[i].price);
            let department = res[i].department_name;
            let quantity = res[i].stock_quantity

            //push the data for each item into the table row
            table.push([itemID, productName, `$${price}.00`, department, quantity]);
        }
        //log the table to the console
        console.log(table.toString());
    })
    returnMain();
};

//reads DB and returns items with less than 15 in stock
function readLowQuantity() {
    console.log("Fetching all items with a quantity of less than 15 items...");
    //create new table object
    var table = new Table({
        head: ["Item ID", "Product Name", "Quantity In Stock", "Department"]
    });
    //query to read all items with quantity of less than 15
    var query = "SELECT * FROM bamazon WHERE stock_quantity<=14"
    connection.query(query, function (err, res) {
        if (err) throw err;
        //new line
        console.log(`\n`)
        //iterates over response length, pushes each item to the array 
        for (let i = 0; i < res.length; i++) {
            const itemID = res[i].item_id;
            const productName = res[i].product_name;
            const department = res[i].department_name;
            const quantity = res[i].stock_quantity

            //push the data for each item into the table row
            table.push([itemID, productName, quantity, department]);
        }
        maxNum = res.length;
        //log the table to the console
        console.log(table.toString());
    })
    returnMain();
}

function addInventory() {
    //prompt the user to enter an item id
    inquirer.prompt({
        type: "number", 
        name: "itemPrompt",
        message: `Please enter in a valid Item ID to add inventory for a specific item:`,
        validate: function (value) {
            if (!isNaN(value) && value > -1) {
                return true;
            } else {
                return `Please enter valid number greater than zero and less than ${maxNum + 1}.`
            }
        }
    }).then(answer => {
        let requestedItem = answer.itemPrompt;
        
        var query = "SELECT * FROM bamazon WHERE item_id = ?";

        connection.query(query, [requestedItem], function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                console.log("Oops! Looks like we don't have any matching Item ID for that item! Try Again.")
                return addInventory();
            } 

            let focusID = res[0].item_id;
            let focusProduct = res[0].product_name;
            let originalCount = res[0].stock_quantity;

            let item
            
            //new table object
            var table = new Table({
                head: ["Item ID", "Product Name", "Quantity Currently In Stock"]
            });

            table.push([focusID, focusProduct, originalCount]);
            //log new table object so user can see/confirm the item they will add quantity to
            console.log(table.toString());

            //continue prompting for # of invetory to add
            inquirer.prompt({
                type: "number",
                name: "addQuantity",
                message: `Please enter the stock quantity to add for ItemID: ${focusID} Item: ${focusProduct}`
            }).then(answer => {
                let newCount = originalCount + answer.addQuantity;

                console.log(`\r\nOK! Updating stock quantity for ItemID: ${focusID} Item: ${focusProduct}`);
                //db query
                const query = "UPDATE bamazon SET ? WHERE ?";
                connection.query(query, [
                    {
                    stock_quantity: newCount
                    },
                    {
                    item_id: focusID
                    }
                ], function (err, res) {
                    //log update confirmation
                    console.log(`Inventory for ${focusProduct} successfully updated.`);
                    console.log(res.message);
                    return returnMain();
                })
            })
        })
    })
}

//add a new product
function addNewProduct() {
    console.log("---ADD NEW BAMAZON ITEM---");

    //prompt user for pertinent product information
    inquirer.prompt([{
        name: "newItemName",
        type: "text",
        message: "Please enter the name of the product you would like to add:"
    },
    {
        name: "newItemPrice",
        type: "text",
        message: "Please enter listing price per unit:"
    },
    {
        name: "newItemDepartment",
        type: "text",
        message: "Please enter the department the item will list under:"
    },
    {
        name: "newItemStock",
        type: "text",
        message: "Please enter the quantity of the item in stock:"
    }]).then(answers => {

        var query = "INSERT INTO bamazon SET ?";

        connection.query(query, [
            {
                product_name: answers.newItemName,
                price: answers.newItemPrice,
                department_name: answers.newItemDepartment,
                stock_quantity: answers.newItemStock
            }
        ], function (err, res) {
            console.log(`${answers.newItemName} will be listed under Item ID: ${res.insertId}`);
            return returnMain();
        });
    })
}

//option to return back to the main menu without distorting UI.
function returnMain () {
    inquirer.prompt({
        name: "return",
        message: "Press any key and 'Enter' to return to the main menu."
    }).then(answer => {
        if (answer) {
            managePrompt();
        }
    })
}