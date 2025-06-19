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

let spinning = false;
let angle = 0; // основной угол
let slowRotation = 0;
let slowSpinInterval = null;

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

function startSlowSpin() {
  slowSpinInterval = setInterval(() => {
    slowRotation += 0.002; // медленное вращение
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(-slowRotation); // по часовой
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();
  }, 16); // 60fps
}

function stopSlowSpin() {
  clearInterval(slowSpinInterval);
}

function rotateWheel() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = "";

  stopSlowSpin(); // остановка медленного вращения

  const baseRotation = slowRotation;
  const rotationDegrees = Math.random() * 360 + 720;
  const rotationRadians = rotationDegrees * Math.PI / 180;
  const duration = 5000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    angle = baseRotation + rotationRadians * eased;

    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(-angle); // по часовой
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Стрелка внизу: 270° = 3π/2
      let finalAngle = (angle + 3 * Math.PI / 2) % (2 * Math.PI);
      let index = Math.floor(finalAngle / segmentAngle);
      if (index >= segments.length) index = 0;

      resultDiv.innerHTML = `Вы выиграли: <strong>${segments[index]}</strong>`;

      const winnerData = {
  name: document.getElementById("name").value,
  phone: document.getElementById("phone").value,
  prize: segments[index]
};

fetch("https://script.google.com/macros/s/AKfycbyb9xsq6ISTzzFQBrFklvLp7WEdKK2R4iiYjdNbUdIYAva4-o7C5HT4m3cKlxMuTTQF_g/exec", {
   method: "POST",
  body: JSON.stringify(winnerData),
  headers: {
    "Content-Type": "application/json"
  }
})
.then(res => res.text())
.then(data => {
  console.log("Ответ от скрипта:", data);
})
.catch(err => {
  console.error("Ошибка при отправке:", err);
});

      spinning = false;
      spinBtn.disabled = false;
      document.getElementById("form").reset();

      slowRotation = angle % (2 * Math.PI); // сохранить текущую позицию
      startSlowSpin(); // вернуть медленное вращение
    }
  }

  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", rotateWheel);

drawWheel();
startSlowSpin();
