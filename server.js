const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import CORS
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for all origins (you can also limit this to specific origins if needed)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

// Routes

// Create a new person
app.post('/create-person', async (req, res) => {
    try {
        const { name, age, favoriteFoods } = req.body;
        const newPerson = new Person({ name, age, favoriteFoods });
        const savedPerson = await newPerson.save();
        res.status(201).json(savedPerson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all people
app.get('/get-people', async (req, res) => {
    try {
        const people = await Person.find();
        res.status(200).json(people);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a person by ID
app.delete('/delete-person/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPerson = await Person.findByIdAndDelete(id);
        
        if (!deletedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
