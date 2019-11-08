require('dotenv').config();

const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    readDB();
});

const productArr = [];



function readDB() {
    console.log(`WELCOME TO BAMAZON: B(ETTER THAN)AMAZON`);

    const query = connection.query("SELECT * FROM bamazon", function (err, res) {
        if (err) throw err;
        console.log(`\n`)
        for (let i = 0; i < res.length; i++) {
            let price = parseInt(res[i].price);

            let itemListing = `ItemID: ${res[i].item_id}, Product Name: ${res[i].product_name}, Price: $${price}.00, Department: ${res[i].department_name}, Quantity: ${res[i].stock_quantity}`;

            productArr.push(res[i]);

            console.log(itemListing);
        }
    })
    introPrompt();
};


function introPrompt() {
    inquirer.prompt({
        name: "itemid",
        message: "Please enter the product ID of the product you would like to buy:"
    }).then(
        function (res, err) {
            if (err) throw err;

            let product = productArr[res.itemid].product_name;
            let productID = productArr[res.itemid].item_id;

            inquirer.prompt({
                name: "quantity",
                message: `OK, ${product}. How many?`
            }).then(
                function (res, err) {
                    if (err) throw err;
                
                    let quantity = res.quantity;

                    console.log(`Ok... checking invetory for ${product}, ${quantity} units`);
                    makePurchase(productID, quantity);
            })
    })
}

function makePurchase(item, number) {
    
    connection.query("SELECT * FROM bamazon WHERE item_id = ?", [item], function(err, res) {
        const itemID = res[0].item_id;
        const itemQuantity = res[0].stock_quantity;

        if (itemQuantity > number) {
            console.log(`Purchase made! Package being shipped now....`);
            updateItem(itemID, itemQuantity, number);
        } else {
            console.log(`Insufficient quantity!`);
            return shopPrompt();
        }
    })

}

function updateItem(item_id, currentQuantity, orderQuantity) {
    connection.query("UPDATE bamazon SET stock_quantity = ? WHERE item_id = ?", [{
        newQuantity: (currentQuantity - orderQuantity),
        item_id: item_id
    }], function(err, res) {
        console.log(`Quantity Updated!`);
        readDB();
    })
}


function shopPrompt() {
    inquirer.prompt({
        name:"retry",
        type: "list",
        message: "Would you like to shop again?",
        choices: ["YES", "NO"]
    }).then(function (err, res) {
        if (res.retry === "yes") {
            return readDB();
        } else {
            console.log("Ok! See you soon!");
            return false;
        }
    })
}