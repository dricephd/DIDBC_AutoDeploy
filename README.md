# DIDBC_AutoDeploy
Attempts to pull every 30 seconds, if repository is out of date it will update the files and run `npm install`. Keeps client.js of fetched repository up 24/7 using forever.js library unless a significant failure happens.
