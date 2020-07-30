npm install <br>
    in app.js ---- process.env.MONGO_URI ----> your monogdb connection string <br>
npm start to start server<br>

localhost:3000/user ---> view all user registered. only can be viewed if logged in <br>
localhost:3000/user/register ---> Register user in database <br>
localhost:3000/user/login ---> login page <br>
localhost:3000/user/slug/dashboard  ---> User dashboard only accessible if logged in... example: slug of name 'Ram Kumar' is 'ram-kumar' <br>

If not logged in and try to access protected routes you are redirected to login page <br>
