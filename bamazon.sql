--DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazondb;

use bamazon;

CREATE TABLE bamazon (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price int NOT NULL,
    stock_quantity int NOT NULL
    PRIMARY KEY (item_id)
);

INSERT INTO bamazon (product_name, department_name, price, stock_quantity)
VALUES ("IPhone XS Max","Electronics",900,100),
("Pixel 4","Electronics",850,100),
("Macbook Pro","Electronics",1700,100),
("Macbook Air","Electronics",1600,100),
("Microsoft Surface Pro 6","Electronics",1400,100),
("Asus 27in. Curved Monitor", "Electronics",500,100),
("Wine Glass (Set of 4)","Kitchen",25,100),
("Pint Glasses (Set of 2)","Kitchen",15,100),
("Coffee Mugs (2)","Kitchen",12,100),
("Vitamix Blender","Kitchen",300,100),
("Manilla Folders (100 Pack)","Office Products",10,100),
("Bic Blue Ballpoint Pens (30 Pack)","Office Products",12,100),
("Bamazon Basics Legal Notepad 8-1/2 by 11 Wide Ruled (12 Pack)","Office Products",11,100),
("EXPO Dry Erase Markers (5-Pack, Assorted)","Office Products",6,100);
