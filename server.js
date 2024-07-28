const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve registration page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Add user data to data.json
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('An error occurred.');
    }

    let users = JSON.parse(data || '[]');
    // Check if the username is unique
    if (users.some(user => user.username === username)) {
      return res.status(400).send('This username is already taken.');
    }

    users.push({ username, password });

    fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send('An error occurred.');
      }
      res.send('Successfully registered.');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}.`);
});
