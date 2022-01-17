const autocannon = require("autocannon");
const { PassThrough } = require("stream");

function run(url) {
  const buffer = [];
  const stream = new PassThrough();

  const instance = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(instance, { stream });

  stream.on("data", (chunk) => {
    buffer.push(chunk);
  });

  instance.on("done", () => {
    console.log(Buffer.concat(buffer).toString());
  });
}

console.log("Running test...");
run("http://localhost:8080/info");
