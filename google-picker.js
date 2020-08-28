var inkgoGoogle = {
    developerKey: '',

    // The Client ID obtained from the Google API Console. Replace with your own Client ID.
    clientId: "CLIENT_ID",

    // Replace with your own project number from console.developers.google.com.
    // See "Project number" under "IAM & Admin" > "Settings"
    appId: "APP_ID",

    //scope: ['https://www.googleapis.com/auth/drive.readonly'],
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    clientApiLoaded: false,
    oauthToken: '',
    GoogleAuth: {},

    // Use the Google API Loader script to load the google.picker script.
    loadPicker: function() {
        gapi.load('client', {'callback': inkgoGoogle.onClientAuthApiLoad});
        //gapi.load('auth', {'callback': inkgoGoogle.onAuthApiLoad});
        gapi.load('picker', {'callback': inkgoGoogle.onPickerApiLoad});
    },
    onClientAuthApiLoad: function() {
        inkgoGoogle.clientApiLoaded = true;
        if (inkgoGoogle.oauthToken){
            //inkgoGoogle.createPicker(); // fixed double click for close since 2nd modal open
        } else {
            inkgoGoogle.GoogleAuth = window.gapi.auth2.getAuthInstance();

            window.gapi.auth2.authorize({
                'client_id': inkgoGoogle.clientId,
                'scope': inkgoGoogle.scope,
                'immediate': false,
            }, inkgoGoogle.handleAuthResult);
        }
    },
    onAuthApiLoad: function() {
        window.gapi.auth.authorize({
            'client_id': inkgoGoogle.clientId,
            'scope': inkgoGoogle.scope,
            'immediate': false,
        }, inkgoGoogle.handleAuthResult);
    },
    // Create and render a Picker object for searching images.
    createPicker: function() {
        if (inkgoGoogle.pickerApiLoaded && inkgoGoogle.oauthToken) {
            var view = new google.picker.View(google.picker.ViewId.DOCS);
            // change extension here
            view.setMimeTypes("image/vnd.adobe.photoshop,application/x-photoshop,application/photoshop,application/psd,image/psd");
            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(inkgoGoogle.appId)
                .setOAuthToken(inkgoGoogle.oauthToken)
                .setDeveloperKey(inkgoGoogle.developerKey)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setCallback(inkgoGoogle.pickerCallback)
                .build();
            picker.setVisible(true);
        }
    },
    onPickerApiLoad: function() {
        inkgoGoogle.pickerApiLoaded = true;
        if(inkgoGoogle.oauthToken){
            inkgoGoogle.createPicker();
        }
    },
    handleAuthResult: function(authResult) {
        if (authResult && !authResult.error) {
            inkgoGoogle.oauthToken = authResult.access_token;
            inkgoGoogle.createPicker();
        } else {
            const user = inkgoGoogle.GoogleAuth.currentUser.get();
            inkgoGoogle.oauthToken = user.getAuthResponse().access_token;
            inkgoGoogle.createPicker();
        }
    },
    pickerCallback: function(data) {
        if (data.docs != undefined) {
            //addFiles(data.docs, inkgoGoogle.oauthToken);
            //DO SOMETHING HERE
        }
    }
}
