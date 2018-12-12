# OnlinePriceTracker - Όνομα ομάδας (όπως αναγράφεται στην "κατάσταση" του μαθήματος) untitled1 #
Ένα διαδικτυακό παρατηρητήριο τιμών, το οποίο επιτρέπει στους χρήστες να καταγράφουν ηλεκτρονικά τις τιμές προϊόντων σε διάφορα καταστήματα. Η υλοποίηση γίνεται στα πλαίσια του μαθήματος Τεχνολογία Λογισμικού, εαρινό εξάμηνο 2018-2019.

# Μέλη (Αλφαβητικά):
  * Βαλίαδης Ιωάννης ΑΜ: 03115197
  * Βιδαλάκης Γεώργιος ΑΜ: 03115052
  * Καρατζά Παναγιώτα ΑΜ: 03115211
  * Καρατζογλίδη Μαρία ΑΜ: 03115157
  * Μουζάκης Οδυσσέας ΑΜ: 03115097
  * Παναγιώτου Εμμανουήλ ΑΜ: 03115079
  * Σουλίωτης Στέφανος ΑΜ: 03115119

# Documentation

  * [Contributing](docs/contributing.md)
  * [Installation](docs/installation.md)
  * [Setup Mysql Database](docs/database.md)
  * [Usage](docs/usage.md)
  * [Windows Installation](docs/windows_installation.md)
  * [Fill](docs/FillDatabase.md) the database with test data
  * Project [structure](docs/structure.md)


# Deadlines:
  * Πρώτο παραδοτέο ως Δευτέρα 26/11/2018 [εδώ](https://courses.softlab.ntua.gr/softeng/2018b/project.html) .

(Κατάθεση ενδιάμεσων παραδοτέων στο σύνολο της διάρκειας του εξαμήνου, οι
προθεσμίες των οποίων θα ανακοινώνονται κατά τη διάρκεια του μαθήματος)


# Στόχοι (Τεχνικές Προδιαγραφές) :

1. Το παρατηρητήριο θα αποτελείται από (α) ένα back-end και (β) ένα front-end υποσύστημα, τα
οποία μπορούν να υλοποιηθούν σε γλώσσα Java (το back-end υποσύστημα) ή/και JavaScript (για
το front-end ή/και το back-end υποσύστημα). :heavy_check_mark:
  -(Απάντηση:)
 Χρησιμοποιείται JavaScript στο front-end και το back-end. Στο front-end χρησιμοποιείται η Pug αντί για HTML, διότι είναι πιο συμβατή με  την JavaScript. 

2. Η γλώσσα των χρηστικών διεπαφών και των δεδομένων της πλατφόρμας θα πρέπει να είναι η
ελληνική. :heavy_check_mark:
 -(Απάντηση:)
 Σε όλα τα πεδία χρησιμοποιείται η ελληνική γλώσσα.

3. Η εργασία θα υλοποιηθεί με χρήση του συστήματος διαχείρισης εκδόσεων git. Ειδικότερα, θα
πρέπει να γίνει χρήση κάποιας ηλεκτρονικής υπηρεσίας φιλοξενίας του git repository της
εργασίας (Github, Bitbucket, GitLab). Το repository θα πρέπει να είναι ιδιωτικό (private) και να
έχουν πρόσβαση μόνο τα μέλη της ομάδας και οι διδάσκοντες.  :heavy_check_mark:

4. Η ομάδα θα πρέπει να κάνει χρήση ενός εργαλείου αυτοματισμού του «χτισίματος» του
λογισμικού (build automation), το οποίο θα είναι της επιλογής σας.  :x:

5. Η ομάδα θα πρέπει να κάνει χρήση ενός εργαλείου αυτοματισμού του ελέγχου και δοκιμής των
λειτουργιών του παρατηρητηρίου, το οποίο θα είναι της επιλογής σας. :x:

6. Το παρατηρητήριο θα πρέπει να παρέχει κατάλληλο RESTful Web API για τη διασύνδεσή του με
τρίτες εφαρμογές. Το RESTful API θα προδιαγραφεί λεπτομερώς από τους διδάσκοντες κατά τη
διάρκεια υλοποίησης της εργασίας και θα είναι κοινό για όλες τις ομάδες.  :x:

7. Θα πρέπει να υποστηρίζονται οι εξής τρεις ρόλοι χρηστών στην πλατφόρμα:
  * Εγγεγραμμένος χρήστης – Εθελοντής πληθοπορισμού: χρήση του front-end
  υποσυστήματος ή/και του RESTful API τόσο για την πλοήγηση, αναζήτηση και ανάκτηση
  των δεδομένων, όσο και για την ενημέρωσή τους.
  * Διαχειριστής: χρήση του back-end υποσυστήματος για τη διαχείριση των λογαριασμών χρήστη (ανάθεση και ανάκληση ρόλων, κλείδωμα χρήστη).
  * Αναγνώστης: χρήση του front-end υποσυστήματος μέσω web σε desktop ή φορητή συσκευή, ή σε φορητή συσκευή μέσω εφαρμογής, για την αναζήτηση τιμών με κριτήρια όπως θεματική ταξινόμηση, χρόνος και θέση.  :x:


8. Θα πρέπει να υποστηρίζεται το πρωτόκολλο HTTPS για όλες τις σελίδες και χρηστικές ή
προγραμματιστικές διεπαφές της πλατφόρμας μέσω self-signed certificate. :x:

9. Η χωρική απεικόνιση των δεδομένων θα πρέπει να γίνεται μέσω διαλειτουργικότητας της
πλατφόρμας με μια online υπηρεσία χαρτών (π.χ. Google Maps ή αντίστοιχη) με χρήση
κατάλληλης βιβλιοθήκης javascript (openlayers, mapbox ή άλλο).  :x:

10. Θα πρέπει να παρέχεται responsive design για τις σελίδες των ρόλων Ανώνυμος και Εθελοντής,
έτσι ώστε η πλατφόρμα να είναι πλήρως λειτουργική και χρηστική με ομοιόμορφο τρόπο σε
Desktop, Tablet και Mobile συσκευές.  :x:
