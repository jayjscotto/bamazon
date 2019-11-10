require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table3")

//mysql connection object
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazondb"
});

//make the connection
connection.connect(function (err) {
    if (err) throw err;
    //read the database
    readDB();
});

//global variables (product list and highest product id)
const productArr = [];
let maxNum;

//reads from DB, returns each item listing
function readDB() {
    console.log(`WELCOME TO BAMAZON: B(ETTER THAN)AMAZON`);
    //create new table object
    var table = new Table({
        head: ["Item ID", "Product Name", "Price", "Department"]
    });
    //query to read all items
    const query = "SELECT * FROM bamazon"
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

            //push the data for each item into the table row
            table.push([itemID, productName, `$${price}.00`, department])
      
            //push each product to the item array
            productArr.push(res[i]);
        }
        //log the table to the console
        console.log(table.toString());
        //reassign to length of product array
        maxNum = productArr.length;
    })
    idPrompt();
};

//prompts for item-ID
function idPrompt () {
    inquirer.prompt({
        type: "input",
        name: "itemid",
        message: "Please enter the product ID of the product you would like to buy:",
        validate: function (value) {
            if (!isNaN(value) && value > -1 && value < (maxNum + 1)) {
                return true;
            } else {
                return `Please enter valid number greater than zero and less than ${maxNum + 1}.`
            }
        }
    }).then(answers => {

        //index number of the item
        index = parseInt(answers.itemid) - 1
        //product name 
        let product = productArr[index].product_name;
        //product id
        let productID = productArr[index].item_id;

        //prompts for number of units
            inquirer.prompt({
                type: "input",
                name: "quantity",
                message: `OK, ${product}. How many?`,
                validate: function (value) {
                    if (!isNaN(value) && value > -1) {
                        return true;
                    }
                    else {
                        return `Please enter valid number greater than zero. Try Again`
                    }
                }
            }).then(answers => {
                    //quantity of order
                    let quantity = answers.quantity;

                    console.log(`Ok... checking invetory for ${product}, ${quantity} units`);
                    //attempt to make the purchase
                    makePurchase(productID, quantity);
            })
    })
}

//attempt to make the purchase
function makePurchase(item, number) {

    const query = "SELECT * FROM bamazon WHERE item_id = ?";

    connection.query(query, [item], function(err, res) {

        const itemID = res[0].item_id;
        const itemQuantity = res[0].stock_quantity;

        //if we have enough items to meet the order quantity
        if (itemQuantity > number) {
            console.log(`Purchase made! Package being shipped now....`);
            updateItem(itemID, itemQuantity, number);
        } else {
            console.log(`Insufficient quantity!`);
            return shopPrompt();
        }
    })

}

//update the DB inventory minus the number of items ordered
function updateItem(item_id, currentQuantity, orderQuantity) {
    let newQuantity =  (currentQuantity - orderQuantity)
    const query = "UPDATE bamazon SET ? WHERE ?"
    connection.query(query, [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: item_id
            }
        ], function(err, res) {     
            if (err) throw err;
            console.log(`Quantity Updated!`);
            //prompt the customer to continue shopping
            return shopPrompt();
        })
}

//prompt to continue shopping
function shopPrompt() {
    inquirer.prompt({
        name:"retry",
        type: "list",
        message: "Would you like to continue shopping?",
        choices: ["YES", "NO"]
    }).then(answers => {
        if (answers.retry === "YES") {
            return readDB();
        } else {
            console.log("Ok! See you soon!");
            return connection.end();
        }
    })
}
