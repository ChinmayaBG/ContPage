const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const port = 3000;

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://chinmayabg12:Demo123@democluster.c9hlvb4.mongodb.net/?retryWrites=true&w=majority&appName=demoCluster';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = new Message({
        name,
        email,
        message
    });

    try {
        await newMessage.save();
        console.log(`Received message from ${name} (${email}): ${message}`);
        res.sendFile(path.join(__dirname, 'public', 'response.html'))
    } catch (error) {
        console.error('Error saving message to the database:', error);
        res.status(500).json({ status: 'error', message: 'Failed to save your message. Please try again later.' });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages from the database:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch messages. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
