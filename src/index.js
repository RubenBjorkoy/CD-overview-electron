import { pool } from './mysql-pool';

let studentList = document.getElementById('studentList');

// Perform select-query that fetches all the Students table rows from the database
pool.query('SELECT * FROM Students', (error, results) => {
  if (error) return console.error(error); // If error, show error in console (in red text) and return

  for (let student of results) {
    let li = document.createElement('li');
    li.innerText = student.name + ', ' + student.email;
    studentList.appendChild(li);
  }
});
