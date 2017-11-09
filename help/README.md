# How to install (Detail ver.)

<a name="InstallLibrarytoUseProjectApp"></a>
## Install Library to Use ProjectApp
- Open Script Editor. And please operate follows by click.
    - Resource -> Library
    - Input Script ID to text box. Script ID is **``1l_XfWeEKp-g45lI-ikQ1KFrHX9YWlR2rWpaVMVs8miaa3J6PUYQqDo5C``**.
    - Add library
    - Please select latest version
    - Developer mode ON (If you don't want to use latest version, please select others.)
    - Identifier is "**``ProjectApp``**". This is set under the default.

[If you want to read about Libraries, please check this.](https://developers.google.com/apps-script/guide_libraries).

<a name="RetrieveclientIDandclientsecret"></a>
## 1. Retrieve client ID and client secret
- Open script editor.
    - Open Resources -> Cloud Platform project
    - Click the link below "This script is currently associated with project:".
- At Google Cloud Platform
    - Click Enable APIs and get credentials like keys at Getting Started.
    - Click Credentials at the left side.
    - Select OAuth client ID from Create credentials.
    - Select Web Application.
    - Please input Name. You can freely give it by yourself.
    - "Authorized JavaScript origins" is not required to be inputted.
    - In current stage, "Authorized redirect URIs" is not required to be inputted yet.
    - Click Create button.
    - Copy client ID and client secret.
    - After copied them, click OK button.

**At this time, please don't close "Google Cloud Platform". For the created credential with client ID and client secret, "Authorized redirect URIs" retrieved at a next step is required to be added.**

<a name="DeployWebApps"></a>
## 2. Deploy Web Apps
- Please copy and paste the following script to the script editor installed the library. After copied and pasted it, input client ID and client secret which were retrieved above step. And push save button on the script editor.

~~~javascript
function doGet(e) {
  var Properties = PropertiesService.getScriptProperties();
  var pa = ProjectApp.init(Properties);
  pa.setProp(
    "", // <--- Input client_id
    "" // <--- Input client_secret
  );
  return pa.getAccesstoken(e);
}
~~~

- Deploy and launch Web Apps for retrieving redirect uri. The detail information is [here](https://developers.google.com/apps-script/guides/web).
    - On the Script Editor
        - Publish -> Deploy as Web App
        - Please input project version. You can freely give it by yourself.
        - At Execute the app as, select **"Me (your account)"**
        - At Who has access to the app, select **"Only myself"**
        - Click "Deploy"
        - When clicked "Deploy", if the authorization is required, please do it.
        - At "Test web app for your latest code.", click **"latest code"**
            - By this click, it launches the authorization process.
            - If an error occurs, please reopen the script editor. For example, if you use spreadsheet bound script, please reopen spreadsheet and open the script editor. After this, click **"latest code"** again.
        - When you see "Please push this button after set redirect_uri to 'https://script.google.com/macros/s/#####/usercallback'", it means that the authorization process works fine.
            - <u>Please copy the redirect URI shown in the browser.</u> Redirect URI is like ``https://script.google.com/macros/s/#####/usercallback``.
                - At this time, please don't close this window.
            - Please go back to "Google Cloud Platform" which has already opened. Please click the created credential.
            - Please input the copied ``https://script.google.com/macros/s/#####/usercallback`` to "Authorized redirect URIs".
            - **Click save button. And click save button more.**

<a name="RetrieveAuthorizedredirectURIsandAccessToken"></a>
## 3. Retrieve "Authorized redirect URIs" and Access Token
- Please go back to the window with "Please push this button after set redirect_uri to ``'https://script.google.com/macros/s/#####/usercallback'``".
- Click Get access token button.
- Do authorization.
- If you see <u>"The state token is invalid or has expired. Please try again."</u>, please close window. And click **"latest code"** again.
- When you see "Retrieving access token and refresh token was succeeded!", please close the window. The access token and refresh token are saved to ``ScriptProperties``. The install is completed. You can use ProjectApp.

<a name="AddotherscopestoManifests"></a>
## Add other scopes to Manifests
By adding ``oauthScopes`` to Manifests, you can use access token with the added scopes. **But if you want to use some methods (for example, it is SpreadsheetApp.), which is required other scopes, in your script, please add the scopes to Manifests.** You can confirm and add such scopes by the following method.

1. Back up Manifests (appsscript.json).
1. Remove ``oauthScopes`` from Manifests.
1. Save the modified Manifests.
1. On the script editor.
    1. File -> Project properties
    1. Scopes tab.
    1. Copy scopes shown at Scopes tab.
1. Restore the backed-up Manifests.
1. Add the scopes you copied to ``oauthScopes``.
1. Save the modified Manifests.
