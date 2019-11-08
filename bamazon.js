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
let maxNum;

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
        maxNum = productArr.length;
    })
    introPrompt();
};


// function validateInput(num) {
//     if (Number.isInterger(num) && num > -1) {
//         return true;
//     } else {
//         return `Please enter valid number.`
//     }
// }

function introPrompt() {
    inquirer.prompt({
        type: "input",
        name: "itemid",
        message: "Please enter the product ID of the product you would like to buy:",
        validate: function (value) {
            if (!isNaN(value) && value > -1 && value < maxNum) {
                return true;
            } else {
                return `Please enter valid number greater than zero and less than ${maxNum + 1}.`
            }
        }
    }).then(answers => {

            index = parseInt(answers.itemid) - 1
            let product = productArr[index].product_name;
            let productID = productArr[index].item_id;

            inquirer.prompt({
                type: "input",
                name: "quantity",
                message: `OK, ${product}. How many?`,
                validate: function (value) {
                    if (!isNaN(value) && value > -1) {
                        return true;
                    } 
                    ////fix conditionals here
                    else {
                        return `Please enter valid number greater than zero and less than ${productArr.length}.`
                    }
                }
            }).then(answers => {
                
                    let quantity = answers.quantity;

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
            // updateItem(itemID, itemQuantity, number);
                let newQuantity =  (itemQuantity - number)
                console.log(newQuantity);
            connection.query("UPDATE bamazon SET stock_quantity = ? WHERE item_id = ?", [{
                stock_quantity: newQuantity,
                item_id: itemID
            }], function(err, res) {
                console.log(`Quantity Updated!`);
                console.log(res)
                return shopPrompt();
            })
        } else {
            console.log(`Insufficient quantity!`);
            return shopPrompt();
        }
    })

}

function updateItem(item_id, currentQuantity, orderQuantity) {
    newQuantity =  (currentQuantity - orderQuantity)
    console.log(newQuantity);
    connection.query("UPDATE bamazon SET stock_quantity = ? WHERE item_id = ?", [{
        stock_quantity: newQuantity,
        item_id: item_id
    }], function(err, res) {
        console.log(`Quantity Updated!`);
        console.log(res)
        return shopPrompt();
    })
}

function shopPrompt() {
    inquirer.prompt({
        name:"retry",
        type: "list",
        message: "Would you like to shop again?",
        choices: ["YES", "NO"]
    }).then(answers => {
        if (answers.retry === "YES") {
            return readDB();
        } else {
            console.log("Ok! See you soon!");
            return false;
        }
    })
}
