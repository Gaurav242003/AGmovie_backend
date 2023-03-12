# Project Title

The title of our project is - Movie Voting Platform, which is named as "AGmovies". It is a website on which users can sign up to nominate at most 5 movies in a contest which runs for 24 hours everyday. Users can search for movies, watch trailer, see the movies nominated by them and also the leaderboard for current contest. After every 24 hours, a new contest begins with a new leaderboard.

# Screenshots


# Hosted URL

# Features Implemented
## Frontend

1) In the home page, we can see movies by genre such as - Trending, Romance, Action and Animation.
2) We also have a search bar to search for one's favourite movie to nominate.
3) Users can watch trailer through a button provided in the description of each movie.
4) Users can both nominate(atmost 5 movies) and de-nominate the movies using a button.
5) We also have a Nominated page, which shows the movies nominated by the logged in user.
6) We also have a Leaderboard page, which shows the top three movies in the on-going contest.
7) We have a timer to display the time remaining for the contest to end.

## Backend

1) The signup data is saved in the backend, which is used to verify the user while he/she tries to login.
2) All the movies nominated by a particular user is saved in the database.
3) Number of votes for a particular movie is also saved in the database to show the top 3 movies in the leaderboard page.
4) The backend also has a timer, which deletes the Nominations and Leaderboard data after every 24 hours.

# Technologies/Libraries/Packages

1) Technologies - Java Script, Mongoose, Express, React, Node
2) Packages - react-icon, react-loading-skeleton, react-responsive-carousel, JSON Web Tokens 

# Local Setup

## Frontend

1) Clone the repo
2) Install the NPM Packages using command -
   npm install
3) Create a .env file and add values accordingly.
4) To run the server, enter this command -
   npm start

## Backend

1) Clone the repo
2) Install the NPM Packages using command -
   npm install
3) Create a .env file and add values accordingly.
4) To run the server, enter this command -
   node app.js

# Team Members

Our team consists of two members -

1) Akhand Pratap Mall , Roll No - 2021IMG-003
2) Gaurav Kumar , Roll No - 2021IMG-024

YOU CAN FIND FRONTEND REPO HERE-https://github.com/Gaurav242003/AGmovie_frontend