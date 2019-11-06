const inquirer = require("inquirer");

function introPrompt() {
    console.log(`WELCOME TO BAMAZON: B(ETTER THAN)AMAZON`);
    //read from DB, print all the items
    inquirer.prompt({
        name: "itemid",
        message: "Which product would you like to buy?"
    }).then(
        function (response, err) {
            if (err) throw err;

            console.log(response.itemid);

            let product = response.itemid;

            inquirer.prompt({
                name: "quantity",
                message: `${product}. How many units?`
            }).then(
                function (response, err) {
                    if (err) throw err;
                
                    let quantity = response.quantity;

                    console.log(`${product}, ${quantity} units`);
            })
    })
}

introPrompt();