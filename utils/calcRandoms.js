const generateRandoms = (number = 10) => {
  const randoms = {};
  for (let i = 0; i < number; i++) {
    const random = Math.random();
    if (randoms[random]) {
      randoms[random]++;
    } else {
      randoms[random] = 1;
    }
  }
  return randoms;
};

process.on("message", (msg) => {
  console.log("Generating randoms: ", msg);
  const randoms = generateRandoms(msg);
  process.send(randoms);
});
