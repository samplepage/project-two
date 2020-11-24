# Project Two: Virtual Health

This is an application designed to provide a diagnosis in response to given symptom(s). It uses the Infermedica Medical API's "parse" and "diagnosis" endpoints to filter text for symptom keywords, then provide a diagnosis.

## How to set up

1. run `npm i`
2. create a user
3. each user can have many patients associated with it (including the user)
4. using the patient form, enter in necessary information (including symptoms)
5. you'll be returned to the home page after submitting the form. once returned to the homepage, click the patient link in the dropdown, then find and click your name below.
6. you'll be taken to your patient's profile page with a list of condition(s) and the condition's probability

## Technologies Used

- Node, Express w/ EJS, Bootstrap, Postgres, HTML, Infermedica API

## Models

- User.js: a one-to-many relationship with patient.js
- Patient.js: a one-to-one relationship with patient.js

## Heroku Link
