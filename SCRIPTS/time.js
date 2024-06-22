// Find the element to display time
const timeSpentEl = document.getElementById('timeSpent');


// Start counting from zero
let totalSeconds = 0;

// Function to update the time display
function updateTimeSpent() {
    totalSeconds++; // Increment total seconds

    // Calculate minutes and seconds
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // Update the display
    timeSpentEl.textContent = `Time spent: ${minutes} minutes ${seconds} seconds`;
}

// Update the time spent every second
setInterval(updateTimeSpent, 1000);

// Alert the user after 1 hour (3600 seconds)
setTimeout(() => {
    
    // document.getElementById('cell').classList.add('disabled');
    alert('You have spent an hour on this page. Please take a break.');
    location.href = 'index.html'; // Redirect to homepage
}, 36000000); // 3600000 milliseconds = 1 hour