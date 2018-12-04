## Fill the Mysql Database using data scraped from (https://www.ab.gr/)

# First install the requirements

cd to the crawler directory and run:

pip3 install -r requirements.txt

This should install all the python3 modules needed to run crawl.py

Now run sudo apt-get install chromium-chromedriver

This will install the chromedriver needed to run the program

At last open mysql (sudo mysql) and run these two queries:

* ALTER DATABASE DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
* ALTER TABLE Product CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

This allows greek characters in your database (DB_NAME), Table Product.

# Run python3 crawl.py

This program will add a Table `Product` to the database (see [installation instructions](database.md) for the database).
And start filling it with the scraped data.

Product has attributes:
  * `Id` AUTO_INCREMENT
  * `Product_Id` The product Id visible in the website
  * `Name` The product name
  * `Brand` The product Brand Name
  * `Category` A string containing the categories the product belongs to separated by a ','. The last category is the most relevant one.
  * `Price` The product price in €
  * `Description` A short paragraph describing the product
