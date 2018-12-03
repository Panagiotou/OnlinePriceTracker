## Setup the Mysql Database

# Install Mysql (run mysql first in a command line to see if it is already installed)
<ul>
<li>sudo apt-get update</li>
<li>sudo apt-get install mysql-server</li>
 <li>sudo mysql_secure_installation</li>
</ul>




# Connect to your MySQL database:

$ sudo mysql

# Create a database:

$ mysql> CREATE DATABASE DB_NAME;

# Create a user called DB_USER, exclude Symbols: ( e.g. @#$% ) and Ambiguous Characters ( e.g. (){}[]) for the password but include a '!' to the password to satisfy the current policy requirements (to see the password requirements run SHOW VARIABLES LIKE 'validate_password%'; ):

$ mysql> CREATE USER 'DB_USER'@'localhost' IDENTIFIED BY 'my-strong-password-here';

# Grant this user DB_USER the permission to access your DB_NAME database:

$ mysql> GRANT SELECT, INSERT, REFERENCES, UPDATE, DELETE, CREATE, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON DB_NAME.* TO 'DB_USER'@'localhost';

exit;

# After you are done, run (While beign inside the OnlinePriceTracker folder):

gedit .env

# Configure the .env file accordingly (see [sample.env](../sample.env))
