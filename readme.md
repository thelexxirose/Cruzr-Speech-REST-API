
This is a tutorial on how to setup and run the dialogflow REST API.

In order to be able to run the API, you have to have NodeJS installed.

After you have cloned the repo, go into the project folder and run this command:
```
npm install
```
This installs node_modules and all necessary dependencies.

Now you have to get an authentiacation key from dialogflow so that you can access dialogflow.
When you have retrived a key, you have to point to that key as an environment variable. Note that you have to use **GOOGLE_APPLICATION_CREDENTIALS** as the variable name.
On Windows powershell:
```
$env:GOOGLE_APPLICATION_CREDENTIALS="<Path to JSON key>"
```
On linux:
```
export GOOGLE_APPLICATION_CREDENTIALS=<Path to JSON key>
```

Now that you've set the key as an environmental variable, you can start the application by running this command:
```
npm test
```

Now go to a browser and type in this address to check if it works:
```
http://localhost:3000
```
Now this text should be popping up in the browser:
```
REST is working
```
