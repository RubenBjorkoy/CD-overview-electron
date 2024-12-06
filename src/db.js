const mysql = require('mysql');

// Database connection configuration
export default conn = mysql.createConnection({
  host: '', // Insert your MySQL server's IP address
  user: '', // Insert your MySQL username
  password: '', // Insert your MySQL password
  database: 'CDDB', //Database name, you may change if you want
});

// Establishing connection to the database
conn.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Close the connection
conn.end((err) => {
  if (err) {
    console.error('Error closing the connection:', err);
  } else {
    console.log('Database connection closed.');
  }
});
