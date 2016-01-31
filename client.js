const repoRemotePath = "https://github.com/dricephd/DrIceDiscordBot";
const repoName = 'DrIceDiscordBot';
const repoLocalPath = __dirname + '/repo/';
const branch = "development";

var simpleGit = require('simple-git')(repoLocalPath);
var fs = require('fs');
var forever = require('forever-monitor');
var async = require("async");

var child = new (forever.Monitor)('./repo/client.js', {
	max: 10,
	silent: true,
	killTree: true,
	watch: false,
	watchDirectory: repoLocalPath,
	args: []
});

//Setup console log function
console.logCopy = console.log.bind(console);
console.log = function(data) {
    this.logCopy(data);
};

if (!fs.existsSync(repoLocalPath)) {
	fs.mkdirSync(repoLocalPath);
	simpleGit.clone(repoRemotePath,repoLocalPath,function (error){
		if (error) console.log(error);
		require('child_process').exec('updatemodules.bat');
	});
}

function updateRepo() {
	simpleGit
		.checkout(branch)
		.pull(function(err,update) {
			if(update && update.summary.changes) {
				console.log("Updating node_modules");
				require('child_process').exec('updatemodules.bat');
			}
			setTimeout(updateRepo,60000);
		});
}
child.on('watch:restart', function(info) {
    console.error('Restaring script because ' + info.file + ' changed');
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
});

child.on('exit', function (info) {
	console.log('client.js has exited');
});
async.waterfall([
	updateRepo,
	child.start()
	], function (error) {
		if (error) console.log(error);
	});
