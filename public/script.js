// source: https://en.wikipedia.org/wiki/Star_Wars
window.text = `
Star Wars is an American epic space opera[1] media franchise created by George Lucas, which began with the eponymous 1977 film[a] and quickly became a worldwide pop culture phenomenon. The franchise has been expanded into various films and other media, including television series, video games, novels, comic books, theme park attractions, and themed areas, comprising an all-encompassing fictional universe.[b] Star Wars is one of the highest-grossing media franchises of all time.

The original 1977 film, retroactively subtitled Episode IV: A New Hope, was followed by the sequels Episode V: The Empire Strikes Back (1980) and Episode VI: Return of the Jedi (1983), forming the original Star Wars trilogy. Lucas later returned to the series to write and direct a prequel trilogy, consisting of Episode I: The Phantom Menace (1999), Episode II: Attack of the Clones (2002), and Episode III: Revenge of the Sith (2005). In 2012, Lucas sold his production company to Disney, relinquishing his ownership of the franchise. This led to a sequel trilogy, consisting of Episode VII: The Force Awakens (2015), Episode VIII: The Last Jedi (2017), and Episode IX: The Rise of Skywalker (2019).

All nine films, collectively referred to as the "Skywalker Saga", were nominated for Academy Awards, with wins going to the first two releases. Together with the theatrical live action "anthology" films Rogue One (2016) and Solo (2018), the combined box office revenue of the films equated to over US$10 billion, making Star Wars the third-highest-grossing film franchise of all time.
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


