# Flowers care app: back-end

## Desktop
![FlowersCareApp](https://user-images.githubusercontent.com/125073360/230791706-b947b694-5358-454b-b3e0-fee4cc212b8f.gif)

## Mobile
![mobileapp](https://user-images.githubusercontent.com/125073360/230792691-f6411f37-d10f-4cb7-b672-6da4cf582fc9.gif)

## Table of contents
* [Demo](#demo)
* [General info](#general-info)
* [Technologies](#technologies)

## Demo
Here is a working live demo: https://yourflowerscare.networkmanager.pl


## General info
A server side application, made to take care of your flowers.<br>
Front-end repository - https://github.com/kowalskika/flowers-care-app-front <br>

The application stores user data and plant care information (mysql2, express).

Users of YourFlowersCare app can create their own accounts on the application (jwt, bcrypt), allowing them to store and track their plant care data across multiple devices. The application can be accessed through both PCs and mobile devices, making it a versatile and convenient tool for plant lovers.

Moreover, the application features a reminder system that will send users email notifications if they forget to water their plants at the right time (at 16:00 every other day via node-cron and nodemailer). Additionally, users can store photos (cloudinary) of their plants and track their growth over time.


## Technologies
Server side application is created with i.a.:
* bcrypt: 5.0.1,
* cloudinary: 1.35.0,
* express: 4.18.1,
* jsonwebtoken: 9.0.0,
* mysql2: 2.3.3,
* node-cron: 3.0.2,
* nodemailer: 6.9.1,

