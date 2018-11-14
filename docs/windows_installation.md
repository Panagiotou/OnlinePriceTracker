https://nodejs.org/en/ και εγκατάσταση του Node.js 11.1.0 (+ τα έξτρα πακέτα)
https://git-scm.com/ και εγκατάσταση του git 2.19.1 (Desktop, Notepad++, 3rd option, lanch)
Στο bash που άνοιξε:
$ node -v
v11.1.0
$ npm -v
6.4.1
https://bootstrap.pypa.io/get-pip.py αποθήκευση και άνοιγμα με python.exe
Στη γραμμή εντολών:
pip
pip install nodeenv
Φτιάχνουμε φάκελο εργασίας, π.χ. "C:/softeng/"
Στη γραμμή εντολών:
cd C:/softeng/
nodeenv env
cd C:/softeng/env/Scripts
activate.bat
Στο https://github.com/georgevidalakis/OnlinePriceTracker Fork
Στη γραμμή εντολών:
git clone https://github.com/georgevidalakis/OnlinePriceTracker.git (ή giotakaratza)
Το φάκελο που φτιάχνεται (OnlinePriceTracker) μέσα στο Scripts το μεταφέρουμε στο C:/softeng/
Στη γραμμή εντολών:
cd C:/softeng/env/Scripts/
activate.bat
cd C:/softeng/OnlinePriceTracker/
npm install

MySQL Database:
https://dev.mysql.com/downloads/file/?id=480824 κατέβασμα χωρίς εγγραφή/σύνδεση
Εγκατάσταση (αγνόηση απαιτούμενων, ****)
Από την έναρξη ανοίγουμε το MySQL 8.0 Command Line Client
CREATE DATABASE LOO;
CREATE USER 'George'@'localhost' IDENTIFIED BY '****';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON LOO.* TO 'George'@'localhost';
ALTER USER 'George'@'localhost' IDENTIFIED WITH mysql_native_password BY '****'
exit;
Φτιάχνουμε μέσα στο OnlinePriceTracker ένα αρχείο ".env" ίδιο με το "sample.env", αλλά με συμπληρωμένα στοιχεία (ο κωδικός είναι χρήστη).
Στη γραμμή εντολών:
cd C:/softeng/env/Scripts/
activate.bat
cd C:/softeng/OnlinePriceTracker/
npm start
Όσο λείπουν πακέτα κάνουμε npm install όνομα_πακέτου και δοκιμάζουμε πάλι το npm start
Όταν τρέξει πρέπει να βγάλει "Database connection established" στη γραμμή εντολών.
Τότε ανοίγουμε σε έναν browser τη διεύθυνση localhost:8000 και πρέπει να λέει "Hello World"
ΤΕΛΟΣ.