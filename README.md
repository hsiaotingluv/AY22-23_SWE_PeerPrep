# CS3219-AY22-23-G19

This is PeerPrep by Group 19!

To start using our application locally, please follow the steps below.

## User Service
1. Enter the user-service directory `cd user-service` 
1. Install npm packages using `npm i`.
2. Create a Cloud DB URL using Mongo Atlas.
2. Add the following into a `.env` file
> ENV=DEV<br>
> DB_LOCAL_URI=\<A MongoDB URL\><br>
> SECRET_KEY=\<A Secret Hash\>
5. Run User Service using `npm run dev`.

## Matching Service
1. Enter the matching-service directory `cd matching-service` 
1. Install npm packages using `npm i`.
5. Run Matching Service using `npm run dev`.

## Question Service
1. Enter the question-service directory `cd question-service` 
1. Install npm packages using `npm i`.
2. Get the MongoDB Atlas url from the development team
2. Add the following into a `.env` file
> ENV=DEV<br>
> DB_LOCAL_URI=\<A MongoDB URL\>
5. Run Question Service using `npm run dev`.

## History Service
1. Enter the history-service directory `cd question-service` 
1. Install npm packages using `npm i`.history
2. Create a Cloud DB URL using Mongo Atlas.
2. Add the following into a `.env` file
> ENV=DEV<br>
> DB_LOCAL_URI=\<A MongoDB URL\>
5. Run History Service using `npm run dev`.

## Session Service
1. Enter the session-service directory `cd session-service` 
1. Install npm packages using `npm i`.history
2. Create a Cloud DB URL using Mongo Atlas.
2. Add the following into a `.env` file
> ENV=DEV<br>
> DB_LOCAL_URI=\<A MongoDB URL\>
5. Run Session Service using `npm run dev`.

## Frontend
1. Enter the frontend directory `cd frontend`
1. Install npm packages using `npm i`.
2. Add the following into a `.env` file
> REACT_APP_ENV=DEV<br>
> REACT_APP_RAPID_API_KEY=8a69aec1c3mshe36c3a3f9cd7233p159784jsn36bbc669097a
2. Run Frontend using `npm start`.


Now you can open http://localhost:3000/ to view the application

