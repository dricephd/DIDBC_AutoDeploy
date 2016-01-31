var Git = require("nodegit");

const repo = "https://github.com/dricephd/DrIceDiscordBot";
const reponame = "DrIceDiscordBot";

// Clone a given repository into the `./tmp` folder.
Git.Clone(repo, "./repo/" + reponame)
  .catch(function(err) { console.log(err); });