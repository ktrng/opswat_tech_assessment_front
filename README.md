Welcome to my application. There is a backend repo as well as a front end (sorry about that!). The application was made using Express.js, cors, Request, and Multer. The front end was made using React.js, Axios, and Crypto-JS.

**Exclaimer**
The application isn't fully functioning right now. This was my first experience using the Request and Crypto-JS (I have never calculated hashes before) as well as my first experience uploading files. I would love to ask some questions if you have time!

All of the GET routes work, but I am having an issue where the POST route successfully posts to the MetaDefender API, but it is sending an empty request body. I did some research, and tried to use Multer to fix it, but I have also never used Multer (lol).

As for front end issues, there's the uploading the file bug associated with the backend issue detailed above. Also, there's an issue when repeatedly pulling on the 'data_id' to retrieve results where it does not stop pulling on the 'data_id' as it is stuck in a loop.


**TESTING**
After cloning the repos, you can just do an "npm -i" to install all of the packages.

To test, you can simply upload a file, and the associated information should show up below it.
