let child;
const psTree = require('ps-tree');
const spawn = require('child_process').spawn;
const argv =  process.argv;

argv.shift();
argv.shift();

function startServerChildProcess(){
  console.log("STARTING", process.execPath, "npm", argv);
  child = spawn('npm', argv, {
    cwd: process.cwd(),
    env: process.env
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  console.log("STARTED with PID:", child.pid);
}

startServerChildProcess();

const killServerChildProcess = function (pid, signal, callback) {
  signal = signal || 'SIGKILL';
  callback = callback || function () {};

  var killTree = true;
  if (killTree) {
    psTree(pid, (err, children) => {
      [pid].concat(
        children.map(p => {
          return p.PID;
        })
      ).forEach(function (tpid) {
        try { process.kill(tpid, signal) }
        catch (ex) { }
      });
      callback();
    });
  } else {
    try { process.kill(pid, signal) }
    catch (ex) { }
    callback();
  }
};

setTimeout(() => {killServerChildProcess(child.pid)}, 10000);
