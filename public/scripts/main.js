const peopleList = document.getElementById('people-list');

// Fetch and display people
const fetchPeople = async () => {
    try {
        const response = await fetch('http://localhost:5000/get-people');
        const people = await response.json();

        // Clear the current list
        peopleList.innerHTML = '';

        // Create a card for each person
        people.forEach(person => {
            const personCard = document.createElement('div');
            personCard.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded', 'flex', 'justify-between', 'items-center');

            personCard.innerHTML = `
                <div>
                    <h2 class="text-xl font-bold">${person.name}</h2>
                    <p class="text-gray-700">Age: ${person.age}</p>
                    <p class="text-gray-700">Favorite Foods: ${person.favoriteFoods.join(', ')}</p>
                </div>
                <button class="bg-red-500 text-white px-4 py-2 rounded"data-id="${person._id}"> Delete
                </button>
            `;

            // Add the card to the list
            peopleList.appendChild(personCard);

            // Attach event listener to the delete button
            personCard.querySelector('button').addEventListener('click', () => deletePerson(person._id));
        });
    } catch (err) {
        console.error(err);
        alert('Failed to fetch data');
    }
};

// Delete a person
const deletePerson = async (personId) => {
    try {
        const response = await fetch(`http://localhost:5000/delete-person/${personId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Error deleting person:', error.message);
            alert(`Failed to delete: ${error.message}`);
            return;
        }

        const result = await response.json();
        if (result.message === 'Person deleted successfully') {
            // Refresh the data after deletion
            fetchPeople(); // Corrected function name to fetchPeople
        }
    } catch (error) {
        console.error('Error deleting person:', error);
        alert('An error occurred while deleting the person.');
    }
};

// Fetch people when the page loads
fetchPeople();

// Handle form submission
document.getElementById('submit-btn').addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const favoriteFoods = document.getElementById('foods').value.split(',');

    const person = { name, age, favoriteFoods };

    try {
        const response = await fetch('http://localhost:5000/create-person', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(person),
        });

        if (response.ok) {
            alert('Person added successfully!');
            document.getElementById('person-form').reset();
            fetchPeople(); // Refresh the list
        } else {
            alert('Error adding person');
        }
    } catch (err) {
        console.error(err);
        alert('Failed to connect to the server');
    }
});
