const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin");
const resultDiv = document.getElementById("result");

const segments = [
  "Скидка 500 ₽",
  "Консультация",
  "Скидка 1000 ₽",
  "Сертификат"
];

const colors = ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#BBDEFB"];
const segmentAngle = 2 * Math.PI / segments.length;

let angle = 0;
let spinning = false;

function drawWheel() {
  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, i * segmentAngle, (i + 1) * segmentAngle);
    ctx.lineTo(200, 200);
    ctx.fill();

    // Надписи
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(i * segmentAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(segments[i], 180, 10);
    ctx.restore();
  }
}

drawWheel();

function rotateWheel() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = "";

  const rotationDegrees = Math.random() * 360 + 720;
  const rotationRadians = rotationDegrees * Math.PI / 180;
  const duration = 5000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    angle = rotationRadians * eased;

    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(-angle); // колесо вращается по часовой
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Стрелка внизу: угол = 270° = 3π/2
      let finalAngle = (angle + 3 * Math.PI / 2) % (2 * Math.PI);
      let index = Math.floor(finalAngle / segmentAngle);
      if (index >= segments.length) index = 0;

      resultDiv.innerHTML = `Вы выиграли: <strong>${segments[index]}</strong>`;
      document.getElementById("tryAgain").addEventListener("click", () => {
        resultDiv.textContent = "";
      });

      spinning = false;
      spinBtn.disabled = false;
      document.getElementById("form").reset();
    }
  }

  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", () => {
  rotateWheel();
});
