# jostle-ad-sync
Sync Jostle data with Active Directory and custom Delve Profiles.

## Starting the app
Make sure you have Docker installed and running.

Go to [Jostle](https://revolutionmortgage.jostle.us/) and download the latest Jostle user data. Go to Admin Settings > Extract/Manage All User Data (CSV) and click "Extract & manage user data".  You will need to have admin priviledges in order to do this.

Then, move that file to the root of this project. If the file does not exist or is in a different location the sync code will not work.

Copy the contents of `.env.example` into a `.env` file. Set the `MS_GRAPH_API_TENANT_ID` and `MS_GRAPH_API_CLIENT_ID` to the proper values found in the Azure Portal for either dev or prod. The `MS_GRAPH_API_CLIENT_SECRET` should be a secret generated for your machine in the Azure Portal.

Next, run:
```bash
yarn
yarn jostle-ad-sync:start
yarn worker:start
```

Finally, run the express API. This API is what will trigger the temporal workflow to sync the users from Jostle to AD and Delve.

```bash
yarn api:start
```

## Triggering the Sync code
After starting the app, you can now POST to http://localhost:3000/sync. This will trigger the `syncJostleUsersWorkflow` in temporal. Go to http://localhost:8088 to view the workflow status.