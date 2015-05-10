CSCI E-3 Introduction to Web Programming Using Javascript
Spring 2015
Alos Diallo
Final Project: To create an app that lets users track their whiskey purchases. 

***User Help***
To load the site make sure you have an http server running then navigate to: http://127.0.0.1:8000/
If you have python and want to start up server: python -m SimpleHTTPServer
Deleting the whole db command: new PouchDB('whiskeyLibrary').destroy()
The GIT repository for the site is: https://github.com/alosdiallo/Whiskey-Tracker

***Plotting***
I used Google Chart APi to help with the plotting of data. I found this easier to use than D3.
https://developers.google.com/chart/interactive/docs/reference
***PouchDB***
The database will be built and handled using PouchDB.  Documentation can be found:
http://pouchdb.com/
My reasoning for choosing PouchDB is that depending on the browser the system will
automatically choose between Web SQl, IndexedDB, or Local Storage.  This is great as 
not every browser supports the same DB architecture. 
PouchDB Browser Support:
Firefox 29+
Chrome 30+
Safari 5+
Internet Explorer 10+
Opera 21+
Android 4.0+
iOS 7.1+
Windows Phone 8+

***CSS***
Table design learned from http://www.smashingmagazine.com/ "Top 10 CSS Table Designs"
Here is the link to the tutorial:http://www.smashingmagazine.com/2008/08/13/top-10-css-table-designs/ 

To help me style the form I used the html tutorial:
http://www.freshdesignweb.com/css-registration-form-templates.html