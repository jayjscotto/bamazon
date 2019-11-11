# bamazon
Command line Amazon Clone using MySQL, npm Inquirer, npm cli-table3 and Javascript

## bamazonCustomer
Running  `node bamazonCustomer` will log a table of all the items in the store.

The user is prompted to enter an ID of the item they would like to purchase, then the quantity of the item.
If there is enough of the item to complete the order, the user will be notified the order was a success, and prompted to shop again. If there is not enough items to complete the order, the user is notified and is then prompted to shop again.


![image](https://user-images.githubusercontent.com/50807550/68620643-f2501d00-049b-11ea-8488-a03bb2dcc6b5.png)

## bamazonManager
Running `node bamazonManager` will prompt the user with options to manage the store.
![image](https://user-images.githubusercontent.com/50807550/68621320-6ccd6c80-049d-11ea-8d43-176e8a690622.png)


VIEW ALL PRODUCTS:
Shows a table of all products in the store and their quantity in stock.
![image](https://user-images.githubusercontent.com/50807550/68621463-d5b4e480-049d-11ea-9192-5202cf0a481e.png)


VIEW LOW INVENTORY: 
Shows a table of all items with less than 15 left in stock.
![image](https://user-images.githubusercontent.com/50807550/68621491-e6655a80-049d-11ea-9c85-cfde8b929a95.png)


ADD TO INVENTORY:
Prompts the user for an Item ID and then a quantity to add to the amount in stock for that item.
![image](https://user-images.githubusercontent.com/50807550/68621619-36442180-049e-11ea-86c3-1cfcb96ea2cd.png)


ADD NEW PRODUCT:
Prompts the user for an Item Name, Description, Department Name, and Price.
![image](https://user-images.githubusercontent.com/50807550/68621729-7b685380-049e-11ea-8f31-fc37c67e03e4.png)

EXIT:
Exits the program.


## bamazonSupervisor
Running `node bamazonSupervisor` will prompt the user with options to run supervisory capabilities.

VIEW PRODUCT SALES BY DEPARTMENT:
Shows a table of each depatments total product sales.
![image](https://user-images.githubusercontent.com/50807550/68621941-f2055100-049e-11ea-8d47-b5b67f5f4d21.png)


CREATE NEW DEPARTMENT:
Enables user to create new Department.
![image](https://user-images.githubusercontent.com/50807550/68622129-663ff480-049f-11ea-817e-0ba04b22869b.png)



## SETUP
Copy the file `envcopy` file and rename to .env.
Edit your .env file with your database username and database password.

Run either of the three files with node and follow the prompts!
