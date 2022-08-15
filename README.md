Welcome to my application. There is a backend repo as well as a front end (sorry about that!). The application was made using Express.js, cors, Request, and Multer. The front end was made using React.js, Axios, and Crypto-JS.

**Exclaimer**
The application isn't fully functioning right now. This was my first experience using the Request and Crypto-JS (I have never calculated hashes before) as well as my first experience uploading files. I would love to ask some questions if you have time!

All of the GET routes work, but I am having an issue where the POST route successfully posts to the MetaDefender API, but it is giving an error stating an empty request body was sent. I did some research, and tried to use Multer to fix it, but I have also never used Multer (lol).

As for front end issues, there's the uploading the file bug associated with the backend issue detailed above. Also, there's an issue when repeatedly pulling on the 'data_id' to retrieve results where it does not stop pulling on the 'data_id' as it is stuck in a loop.


**TESTING**
After cloning the repos, you can just do an "npm -i" to install all of the packages.

You can insert your API key in the backend in the 'server.js' file on line 14. The server is running on port 3003, but you can change that on line 66 (NOTE: all of the GET and POST request on the front end are to http://localhost:3003)

To test, since the file upload isn't currently working, you can uncomment line 132 in /src/App.js in the front end.
