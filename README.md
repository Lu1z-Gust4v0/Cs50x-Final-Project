# Cs50 Final Project - Crypto Quiz

My cs50 project is a website that cover topics related to the cryptocurrencies universe providing a funny way of learning and competing
with friends to get high positions at the leaderboard.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Video Demo](#Video-demo)
- [Files Content](#Files-Content)
  - [Aplication.py](#Aplication.py)
  - [Helpers.py](#Helpers.py)
  - [My_app.db](#My_app.db)
  - [Main.js](#Main.js)
  - [Profile.js](#Profile.js)
  - [Quiz.js](#Quiz.js)
  - [Styles.css](#Styles.css)
  - [Layout.html](#Layout.html)
  - [Apology.html](#Apology.html)
  - [Index.html](#Index.html)
  - [Login.html](#Login.html)
  - [Register.html](#Register.html)
  - [Home.html](#Home.html)
  - [Learn.html](#Learn.html)
  - [Quiz.html](#Quiz.html)
  - [Leaderboard.html](#Leaderboard.html)
  - [Profile.html](#Profile.html)
  - [Cryptocurrencies.html](#Cryptocurrencies.html)
  - [Smart-Contracts.html](#SmartContracts.html)
  - [Web-Three.html](#Webthree.html)
  - [Blockchain.html](#Blockchain.html)
  - [Wallets.html](#Wallets.html)
  - [Requirements.txt](#Requirements.txt)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)



## Overview

### The challenge

  In my opinion is not easy to decide what to create, there are thousands of possible projects that I could have done for the Cs50 final
project, at first I could not decide what to do, it took me some weeks to come up with the initial ideas. I can say that it was the first
issue that I encountered. The first ideia was to code a blog that talked about cryptocurrencies, however It was getting good enough for me,
in the middle of the project I realize that I could code a quiz, and that ideia seemed amazing, so I decide to rewrite the entire project.

  I am secure to say that I have spent more than 50% of the time coding the CSS of my project. Since I did not know how to use css frameworks
decided to use vanilla css, another path that I could have taken would have been to learn how to use one, however I was not confident enough
about this. At least I can say that the long time I spent on it made me learn more about CSS and its weirdnesses.

  When I finish the prototype of my final project I moved all the files to the Cs50 IDE, another issue. After finish all the cs50 challenges
and exercises I started to code some small projects to practice and improve my coding skills, in those I used the visual studio code, microsoft's
code editor, and I got used to all its useful features to turn the development faster. However, Cs50 IDE does not have many of visual studio
features, so I had to get used to code without them.

  The last part of the development was to set up the back-end, It did not take me much time, but I had to look up many code example of features
that I wanted to implement in my project. I was planing to implement more things, like allowing the user change their password, see others profiles,
and some other small things, but I found better to not do so. In general, coding it and turn my idea into a real world website was an amazing experience,
dispite all the issues and the hours spent solving errors.


### Video Demo

  ![Video URL](https://youtu.be/OeIdqiukqwU)

## Files Content

### Aplication.py

  It contains functions used for the server-side logic of my application. The server side was written with the Flask framework.

  - index()

    Implements the path for the index page of the application.

  - register()

    Implements the logic of registering an account and makes sure It fulfills the minimum requirements for It.

  - login()

    It reads the application data base and logs the user in if It is already registered.

  - home()

    Implements the path for the home page of the application.

  - learn()

    Implements the path for the learn page of the application.

  - articles()

    Implements the path for the articles page of the application.

  - quiz()

    Implements the logic for the Quiz, which is storing the results into the database and calculates the user's actual position in
    the leaderboard.

  - data()

    returns the quiz's correct answers through the json format.

  - leaderboard()

    returns the path to the leaderboard page and set users' positions taking in consideration their score and the time they took to solve
    the quiz.

  - profile()

    returns the path to the profile page, displays user's stats and allows they to change their pictures and informations.

  - logout()

    log the users out and redirects to the index page.

### Helpers.py

  Implements useful functions in a file apart to maintain the code neat.

### My_app.db

  The SQL database used to store users' data.

  - schema

  CREATE TABLE users (
    id INTENGER NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    description TEXT,
    picture TEXT,
    position INTENGER,
    highest_score INTENGER,
    creation_date TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE UNIQUE INDEX username ON users(username);

  CREATE TABLE quiz (
      id INTENGER NOT NULL,
      user_id INTENGER NOT NULL,
      score INTENGER NOT NULL,
      correct INTENGER NOT NULL,
      incorrect INTENGER NOT NULL,
      duration NUMBER NOT NULL,
      FOREIGN KEY(user_Id) REFERENCES users(id)
  );

### Main.js

  It implements the client side logic for all the pages of the application:

  - Dark Mode

  - Nav Bar Animations

  - Forms' Animations

  - Alert Messages

### Profile.js

  It implements the logic for the profile page which includes:

  - Send the changes to the server side through json format

  - Allows the user to change their profile picture and other informations

  - Prevents the users from changing their informations to invalid values

### Quiz.js

  It implements the logic for the quiz:

  - Changes the color of the option when it is selected by the user

  - Track the time the user took to solve the quiz

  - Send the user's results to the server side

  - Calculates user's score

  - Allows users to change their answers

  - Prevents the users from go to the next step without choosing an option.


### Styles.css

  It is the global style sheet of the application, there you can find:

  - CSS custom properties to set the colours.

  - CSS code used for the design of all the pages and sections.

  - helpers classes to facilitate the implementation of the dark mode

  - @supports rule for cross-browser support

  - CSS code for responsible layout

  All the designs, fonts and sections were coded by myself. I took some inspiration from Youtube videos and images on the internet.

  [The styles may not work properly in browsers in old browsers like Internet Explorer, so you should access the project using a
  modern browser.]


### Layout.html

  Layout of the HTML pages

### Apology.html

  Page return in case of some Error.

### Index.html

  The HTML code for the index page of the application

### Login.html

  HTML code for the Login Form

### Register.html

  HTML code for the Register Form

### Home.html

  HTML code for the Home Page. There you can see a little introduction to the application's purpose

### Learn.html

  HTML code for the learn page. From here you can access the links to the articles.

### Quiz.html

  HTML code for the quiz page. The quiz is the main part of the application, in it you test you knowledge and compete to get
  high positions.

### Leaderboard.html

  HTML code for the leaderboard page - the leaderbord give each player a position on it, based on their score in the quiz.

### Profile.html

  HTML code for the profile page. The profile page display the user's stats and informations, there you can see the user's attemp
  history, their highest score, the creation date of the account and their progress.

### Cryptocurrencies.html

  HTML code for the article that explains cryptocurrencies.

### Smartcontracts.html

  HTML code for the article that explains smart contracts.

### Webthree.html

  HTML code for the article that explains the web 3.0.

### Blockchain.html

  HTML code for the article that explains the blockchain tecnology

### Wallets.html

  HTML code for the article that explains the wallets for cryptocurrencies.

### Requirements.txt

  Libraries required to run the application in your machine.

## My process

### Built with

- Mobile-first workflow
- CSS custom properties
- Semantic HTML
- Flexbox
- Grid Layout
- Javascript
- Flask
- SQLite

### What I learned

  I learned how complex and how long it takes to build a simple full stack project. At first i thought It would take me few days, however It took me weeks, I struggled a lot due to my lack of code knoledge. Despite all the hard work and knowing I could have done way more, seeing
  the project finally finished made me so happy that I can describe the feeling.

  When It comes to code, I have learned how to code asyncronously to allow the client side interact with the server side and how to make a
  cool design.


### Useful resources

- [Kevin Powell's Channel](https://www.youtube.com/user/KepowOb)
  His CSS tutorials and Videos helped me to improve my CSS skills.

- [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog)
  Inspiration for future projects.


## Author

- GitHub - [@Lu1z-Gust4v0](https://github.com/Lu1z-Gust4v0)

## Acknowledgments

- Kevin Powell

Thanks to Mr. Powell I could learn many things about flex-box, Design, Grid, etc. I would recomend you to take a look at his Youtube Channel.

- Cs50 team

I would like to thank you for teaching me for free and made me code applications that I have never thought that I was capable of,
for sure taking cs50 course was a life-changing experience.