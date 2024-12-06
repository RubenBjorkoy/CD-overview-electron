import conn from './dbprivate.js';

class db {
  getAll = async () => {
    return new Promise((resolve, reject) => {
      conn.query('SELECT * FROM CDs', (err, results) => {
        if (err) {
          console.error('Error fetching data:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
}

export default new db();
