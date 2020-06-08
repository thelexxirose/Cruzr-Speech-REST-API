//Project variables is meant to make it easier to use this API for your own language project which uses the google cloud and Dialogflow API.
module.exports = class ProjectVariables {
    constructor(dialogflowProjectName, dialogflowCreds, gCloudProjectName, gCloudCreds) {
        this.dialogflowProjectName = dialogflowProjectName;
        this.dialogflowProjectCreds = dialogflowCreds;
        this.gCloudProjectName = gCloudProjectName;
        this.gCloudProjectCreds = gCloudCreds;
    }

    //Get dialogflow project name/ID
    getDflowProjectName() {
        return this.dialogflowProjectName
    }

    //Get dialogflow project credentials
    getDflowCreds() {
        return this.dialogflowProjectCreds
    }

    //Get google cloud project name/ID
    getGCloudProjectName() {
        return this.gCloudProjectName
    }

    //Get google cloud project credentials
    getGCloudCreds() {
        return this.gCloudProjectCreds
    }
}