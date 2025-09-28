Smart Library Website

Recording link: https://rmiteduau-my.sharepoint.com/:v:/g/personal/s3978450_rmit_edu_vn/EWoeUB32baFGlujkdqiUruQBHoddyEtONXZZ5I83jTFVeg?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=YLyAm5

Tech Stack

Frontend: React + Vite

Backend: Node.js (Express) + MySQL2 (Promise)

Database: MySQL 8.x (InnoDB, FK constraints)

Auth: JWT (requireAuth / requireRole middleware)

Node.js ≥ 18

MySQL ≥ 8.0 (ensure InnoDB)

Git (optional for cloning)

To run the program, run the following from the ROOT:

npm --prefix frontend install
npm --prefix backend install
npm --prefix backend install mongodb
npm --prefix backend run mongo:fix
npm run db:reset
npm --prefix backend run create-admin

Then split into 2 terminals and run:

first terminal do:
npm run dev:web

second terminal do:
npm run dev:api

Then go to http://localhost:5173/