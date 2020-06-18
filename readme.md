
This is a tutorial on how to setup and run the dialogflow REST API.

In order to be able to run the API, you have to have NodeJS installed.

After you have cloned the repo, go into the project folder and run this command:
```
npm install
```
This installs node_modules and all necessary dependencies.

To be able to use the API, you will need an api key from google cloud and from dialogflow. When you have generated the API keys, change the code referenced under so that the method is referencing project names and API keys.

https://github.com/thelexxirose/Cruzr-Speech-REST-API/blob/f152720cbc0544393df89b64cce24e7a69839b83/index.js#L193

You can now open up a terminal, go to your project directory and type this command:

```
npm run start-dev
```

This will start a server using nodemon using port 3000. The great thing about nodemon is that it comes with hot reloading, so you don't have to restart the server manually everytime you make a change.

Now go to a browser and type in this address to check if the server works:
```
http://localhost:3000
```
Now this text should be popping up in the browser:
```
REST is working
```

**Using pm2**

If you want to use this on a server, you probably want the API to run at startup automatically if you have to restart the server or if anything would happen to it. This is where pm2 is great to use, because it does exactly that.

to start the project with pm2 simply use:
```
npm start
```
to stop the project use:
```
npm stop
```
and if you want to delete the project from the daemon list, then use:
```
npm run delete
```
