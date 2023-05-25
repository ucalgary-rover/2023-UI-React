// Function to read a CSV file (purely for simulation purposes)
function readCSVFile(fileUrl, callback) {
    fetch(fileUrl)
        .then(response => response.text())
        .then(csvData => {
            const dataArray = [];
            // Split the CSV data into rows
            const rows = csvData.split('\n');
            // Iterate over each row
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                // Split the row into columns
                const columns = row.split(',');
                // Add the columns to the data array
                dataArray.push(columns);
            }
            // Invoke the callback with the data array
            callback(dataArray);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const fileUrl = 'angle_values.csv'; // Replace with the URL or relative path to your CSV file
let finalAngleValues = [];

readCSVFile(fileUrl, function (dataArray) {
    // Display the extracted data array
    finalAngleValues = dataArray.map(row => parseFloat(row[0])); // Assuming the angles are in the first column of each row

    //Just keep appending the finalAngleValue array
    //Under that call startAnimating with the desirable fps

    // Starting the animation
    startAnimating(5)
});

//responsible for calling the main animate function and setting up the fps
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate(0);
}

function animate(index) {

    // requesting another frame
    requestAnimationFrame(() => animate(index));

    // calculate elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame (better than setting up delay)
    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var lineLength = canvas.height / 2;
        var angle = finalAngleValues[index] * Math.PI / 180; // Convert angle to radians

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw reference line (y-axis)
        ctx.beginPath();
        ctx.moveTo(0, lineLength);
        ctx.lineTo(canvas.width, lineLength);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Draw reference line (x-axis)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, centerY - lineLength);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // Draw rotating line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        var x = centerX + lineLength * Math.sin(angle);
        var y = centerY - lineLength * Math.cos(angle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'blue';
        ctx.stroke();

        // Increase index and loop back to 0 when end of finalAngleValues is reached
        index = (index + 1) % finalAngleValues.length;
    }
}
