// source: https://en.wikipedia.org/wiki/Star_Wars
window.text = `
It is a period of civil war.
Rebel spaceships, striking
from a hidden base, have won
their first victory against
the evil Galactic Empire.

During the battle, Rebel
spies managed to steal secret
plans to the Empire's
ultimate weapon, the DEATH
STAR, an armored space
station with enough power to
destroy an entire planet.

Pursued by the Empire's
sinister agents, Princess
Leia races home aboard her
starship, custodian of the
stolen plans that can save
her people and restore
freedom to the galaxy....
`

const canvases = {
    vectorize: document.getElementById('gauge-vectorize'),
    openai: document.getElementById('gauge-openai')
}
const contexts = {
    vectorize: canvases.vectorize.getContext('2d'),
    openai: canvases.openai.getContext('2d')
}

function updateGauge(version, gaugeValue) {
    //const gaugeValue = gaugeValueInput.value;
    drawGauge(version, gaugeValue);
    //updateGaugeRange(gaugeValue);
}

function drawGauge(version, value) {
    const canvas = canvases[version]
    const ctx = contexts[version]

    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radius = canvas.width / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gauge background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 25;
    ctx.strokeStyle = '#ddd';
    ctx.stroke();

    // Draw gauge value
    const startAngle = Math.PI;
    const endAngle = (value / 100) * Math.PI + startAngle;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 24;
    ctx.strokeStyle = getColor(value);
    ctx.stroke();

    // Draw pointer
    const pointerLength = radius - 40;
    const pointerX = centerX + pointerLength * Math.cos(endAngle);
    const pointerY = centerY + pointerLength * Math.sin(endAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointerX, pointerY);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#333';
    ctx.stroke();
}

function getColor(value) {
    if (value < 20) {
        return '#00ff00'; // Low - Green
    } else if (value < 40) {
        return '#66ff33'; // Low to Moderate - Light Green
    } else if (value < 60) {
        return '#ffff00'; // Moderate - Yellow
    } else if (value < 80) {
        return '#ff9900'; // Moderate to High - Orange
    } else {
        return '#ff0000'; // High - Red
    }
}

function updateGaugeRange(value) {
    if (value < 20) {
        gaugeRangeText.innerText = 'Low';
    } else if (value < 40) {
        gaugeRangeText.innerText = 'Low to Moderate';
    } else if (value < 60) {
        gaugeRangeText.innerText = 'Moderate';
    } else if (value < 80) {
        gaugeRangeText.innerText = 'Moderate to High';
    } else {
        gaugeRangeText.innerText = 'High';
    }
}

// Initial draw with default value
updateGauge();


