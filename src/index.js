// Select DOM elements
const dogBar = document.getElementById("dog-bar");
const dogInfo = document.getElementById("dog-info");
const filterButton = document.getElementById("good-dog-filter");

// Variable to track the filter state
let filterGoodDogs = false;

// Step 2: Fetch all pups from the API and add to dog bar
fetch("http://localhost:3000/pups")
  .then(response => response.json())
  .then(pups => {
    // Loop through the pups and add each pup's name to the dog bar
    pups.forEach(pup => {
      const span = document.createElement("span");
      span.textContent = pup.name;
      span.addEventListener("click", () => displayDogInfo(pup));
      dogBar.appendChild(span);
    });
  });

// Step 3: Display pup info when clicked
function displayDogInfo(pup) {
  // Clear current dog info
  dogInfo.innerHTML = "";

  // Create elements for dog image, name, and button
  const img = document.createElement("img");
  img.src = pup.image;
  
  const h2 = document.createElement("h2");
  h2.textContent = pup.name;
  
  const button = document.createElement("button");
  button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";

  // Add an event listener to toggle "Good Dog" or "Bad Dog"
  button.addEventListener("click", () => toggleGoodDog(pup, button));

  // Append the elements to the dog info section
  dogInfo.appendChild(img);
  dogInfo.appendChild(h2);
  dogInfo.appendChild(button);
}

// Step 4: Toggle Good Dog status and update the database
function toggleGoodDog(pup, button) {
  // Toggle the isGoodDog status
  const newStatus = !pup.isGoodDog;
  pup.isGoodDog = newStatus;
  
  // Update the button text accordingly
  button.textContent = newStatus ? "Good Dog!" : "Bad Dog!";

  // Send a PATCH request to update the pup's status in the API
  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      isGoodDog: newStatus
    })
  });
}

// Step 5: Filter good dogs when the button is clicked
filterButton.addEventListener("click", () => {
  // Toggle the filter state
  filterGoodDogs = !filterGoodDogs;

  // Update the button text
  filterButton.textContent = filterGoodDogs ? "Filter good dogs: ON" : "Filter good dogs: OFF";

  // Clear the dog bar and re-fetch the pups
  dogBar.innerHTML = "";

  fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(pups => {
      // Filter pups if needed
      const filteredPups = filterGoodDogs ? pups.filter(pup => pup.isGoodDog) : pups;

      // Re-populate the dog bar with the (filtered) pups
      filteredPups.forEach(pup => {
        const span = document.createElement("span");
        span.textContent = pup.name;
        span.addEventListener("click", () => displayDogInfo(pup));
        dogBar.appendChild(span);
      });
    });
});