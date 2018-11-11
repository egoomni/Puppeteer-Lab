const amp = 50;
const step = 0.001;

for (let theta = 0; true; theta += step) {
  let offset = Math.floor(amp * Math.sin(theta) + amp);
  console.log(" ".repeat(offset) + "hello");
}
