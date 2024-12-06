import fs from 'fs';
const axios = require('axios');

// axios
//   .get('https://www.theaudiodb.com/api/v1/json/523532/search.php?s=Eminem')
//   .then((res) => {
//     console.log(res.data.artists[0]);
//     return axios
//       .get(
//         `https://www.theaudiodb.com/api/v1/json/523532/track-top10.php?s=${res.data.artists[0].strArtist}`
//       )
//       .then((res) => {
//         return console.log(res.data.track[0]);
//       })
//       .catch((err) => {
//         return console.log(err);
//       });
//   })
//   .catch((err) => {
//     return console.log(err);
//   });

let cds = [];
let cdHolder = document.getElementById('cdHolder');
let count = 0;
let highestID = 0;
let sure = false;

startRead();

function startRead() {
  fs.readFile('src/cd.json', (err, data) => {
    if (err) return err;
    cds = JSON.parse(data);
    readFiltered(' ', ' ', ' ', ' ', ' ');
  });
}

function readJson(sorted, order) {
  if (sorted) {
    if (order == 'ascending') {
      cds.sort((a, b) => {
        return a.id - b.id;
      });
      if (sorted == 'id' || sorted == 'year' || sorted == 'position') {
        cds.sort((a, b) => {
          return a[sorted] - b[sorted];
        });
      } else {
        cds.sort((a, b) => {
          return a[sorted].localeCompare(b[sorted]);
        });
      }
    } else if (order == 'descending') {
      if (sorted == 'id' || sorted == 'year' || sorted == 'position') {
        cds.sort((a, b) => {
          return b[sorted] - a[sorted];
        });
      } else {
        cds.sort((a, b) => {
          return b[sorted].localeCompare(a[sorted]);
        });
      }
    }
  } else {
    if (document.getElementById('ascdesc').value == 'ascending') {
      cds.sort((a, b) => {
        return a.artist.localeCompare(b.artist);
      });
    } else {
      cds.sort((a, b) => {
        return b.artist.localeCompare(a.artist);
      });
    }
  }
  readFiltered();
}

function readFiltered(artist, album, year, loc, pos) {
  count = 0;
  cdHolder.innerHTML = '';
  if (document.getElementById('searchAny').value.length > 0) return searchAny();

  let qArtist = artist ? artist : document.getElementById('searchTextArtist').value;
  let qAlbum = album ? album : document.getElementById('searchTextAlbum').value;
  let qYear = year ? year : document.getElementById('searchTextYear').value;
  let qLocation = loc ? loc : document.getElementById('searchTextLocation').value;
  let qPosition = pos ? pos : document.getElementById('searchTextPosition').value;

  if (qArtist == ' ') qArtist = '';
  if (qAlbum == ' ') qAlbum = '';
  if (qYear == ' ') qYear = '';
  if (qLocation == ' ') qLocation = '';
  if (qPosition == ' ') qPosition = '';

  let li = document.createElement('li');
  li.innerHTML =
    '<div class="cdID"><u><b>ID</u></div>' +
    '<div class="cdArtist"><u><b>Artist</u></div>' +
    '<div class="cdAlbum"><u><b>Album</b></u></div>' +
    '<div class="cdYear"><u><b>Year</b></u></div>' +
    '<div class="cdLocation"><u><b>Location</b></u></div>' +
    '<div class="cdPosition"><u><b>Position</b></u></div>';
  document.getElementById('cdHolder').appendChild(li);
  for (let cd of cds) {
    if (highestID <= cd.id) highestID = cd.id;
    if (
      (qArtist === '' || cd.artist.toLowerCase().includes(qArtist.toLowerCase())) &&
      (qAlbum === '' || cd.album.toLowerCase().includes(qAlbum.toLowerCase())) &&
      (qYear === '' || cd.year == qYear) &&
      (qLocation === '' || cd.location.toLowerCase().includes(qLocation.toLowerCase())) &&
      (qPosition === '' || cd.position.toLowerCase().includes(qPosition.toLowerCase()))
    ) {
      let li = document.createElement('li');
      li.innerHTML =
        '<div class="cdID">' +
        cd.id +
        '</div><div class="cdArtist">' +
        cd.artist +
        '</div><div class="cdAlbum">' +
        cd.album +
        '</div><div class="cdYear">' +
        cd.year +
        '</div><div class="cdLocation">' +
        cd.location +
        '</div><div class="cdPosition">' +
        cd.position +
        '</div>';
      count++;
      if (count % 2 == 0) {
        li.className = 'grayOutCD';
      } else {
        li.className = 'notGrayOutCD';
      }
      li.id = `${cd.id}`;
      document.getElementById('cdHolder').appendChild(li);
    }
  }
  document.getElementById('count').innerHTML = 'Returned ' + count + ' CDs';
}

const ul = document.getElementById('cdHolder');

ul.addEventListener('click', (evt) => {
  const ul = evt.target.parentNode;
  const li = Array.from(ul.children)[0].innerHTML;
  let album = cds.filter((e) => e.id == li)[0];
  axios
    .get(
      `https://www.theaudiodb.com/api/v1/json/523532/searchalbum.php?s=${album.artist}&a=${album.album}`
    )
    .then((res) => {
      console.log(res.data.album[0]);
      axios
        .get(
          `https://www.theaudiodb.com/api/v1/json/523532/track.php?m=${res.data.album[0].idAlbum}`
        )
        .then((res) => {
          console.log(res.data.track);
          for (let x of res.data.track) {
            console.log(x.strTrack);
          }
        })
        .catch((err) => {
          console.log(err, 'album tracks');
        });
      console.log('hey');
      console.log(res.data);
    })
    .catch((err) => console.log(err));
});

function searchAny() {
  count = 0;
  cdHolder.innerHTML = '';

  let qAny = document.getElementById('searchAny').value;

  if (qAny == ' ') qAny = '';

  let li = document.createElement('li');
  li.innerHTML =
    '<div class="cdID"><u><b>ID</u></div>' +
    '<div class="cdArtist"><u><b>Artist</u></div>' +
    '<div class="cdAlbum"><u><b>Album</b></u></div>' +
    '<div class="cdYear"><u><b>Year</b></u></div>' +
    '<div class="cdLocation"><u><b>Location</b></u></div>' +
    '<div class="cdPosition"><u><b>Position</b></u></div>';
  document.getElementById('cdHolder').appendChild(li);
  for (let cd of cds) {
    if (highestID <= cd.id) highestID = cd.id;
    if (
      qAny === '' ||
      cd.artist.toLowerCase().includes(qAny.toLowerCase()) ||
      qAny === '' ||
      cd.album.toLowerCase().includes(qAny.toLowerCase()) ||
      qAny === '' ||
      cd.year == qAny ||
      qAny === '' ||
      cd.location.toLowerCase().includes(qAny.toLowerCase()) ||
      qAny === '' ||
      cd.position == qAny
    ) {
      let li = document.createElement('li');
      li.innerHTML =
        '<div class="cdID">' +
        cd.id +
        '</div><div class="cdArtist">' +
        cd.artist +
        '</div><div class="cdAlbum">' +
        cd.album +
        '</div><div class="cdYear">' +
        cd.year +
        '</div><div class="cdLocation">' +
        cd.location +
        '</div><div class="cdPosition">' +
        cd.position +
        '</div>';
      count++;
      if (count % 2 == 0) {
        li.className = 'grayOutCD';
      } else {
        li.className = 'notGrayOutCD';
      }
      document.getElementById('cdHolder').appendChild(li);
    }
  }
  document.getElementById('count').innerHTML = 'Returned ' + count + ' CDs';
}

document.getElementById('searchForm').onsubmit = (evt) => {
  evt.preventDefault();
  document.getElementById('searchAny').value = '';
  readJson(document.getElementById('sortBy').value, document.getElementById('ascdesc').value);
};

document.getElementById('searchAny').oninput = () => {
  searchAny();
};

document.getElementById('addForm').onsubmit = (evt) => {
  evt.preventDefault();
  let location = document.getElementById('addLocation').value
    ? document.getElementById('addLocation').value
    : 'Unsorted';
  let position = location == 'Unsorted' ? 'Unsorted' : document.getElementById('addPosition').value;

  if (document.getElementById('addArtist').value == '') {
    new Notification('Input error', { body: 'Artist name cannot be blank' });
    return console.error('Artist name cannot be blank');
  } else if (document.getElementById('addAlbum').value == '') {
    new Notification('Input error', { body: 'Album name cannot be blank' });
    return console.error('Album name cannot be blank');
  } else if (document.getElementById('addYear').value == '') {
    new Notification('Input error', { body: 'Year cannot be blank' });
    return console.error('Year cannot be blank');
  } else if (
    isNaN(Number(document.getElementById('addYear').value)) ||
    Number(document.getElementById('addYear').value) < 0
  ) {
    new Notification('Input error', { body: 'Year has to be a valid and positive number' });
    return console.error('Year has to be a valid and positive number');
  } else if (!isNaN(Number(location))) {
    new Notification('Input error', { body: 'Location cannot be a number' });
    return console.error('Location cannot be a number');
  }

  let album = {
    id: highestID + 1,
    artist: document.getElementById('addArtist').value,
    album: document.getElementById('addAlbum').value,
    year: Number(document.getElementById('addYear').value),
    location: location,
    position: position,
  };

  if (
    cds.find(
      (cd) =>
        cd.artist === album.artist &&
        cd.album === album.album &&
        cd.year === album.year &&
        cd.location === album.location &&
        cd.position === album.position
    )
  ) {
    return console.log('This CD already exists in the system');
  } else {
    cds.push(album);
    writeFile();
    readFiltered(album.artist, album.album, album.year, album.location, album.position);
  }
};

document.getElementById('deleteForm').onsubmit = (evt) => {
  evt.preventDefault();
  let id = Number(document.getElementById('deleteID').value);
  if (id == '') return false;
  if (sure) {
    cds = cds.filter((e) => e.id != id);
    writeFile();
    readFiltered();
    document.getElementById('iAmSureBox').checked = false;
    sure = false;
  }
};

document.getElementById('deleteID').oninput = (e) => {
  document.getElementById('iAmSureBox').checked = false;
  let id = e.target.value;
  if (id == '') return (document.getElementById('iAmSure').innerText = `I am insecure`);
  let album = cds.filter((e) => e.id == id)[0];
  document.getElementById(
    'iAmSure'
  ).innerText = `I am sure I want to delete album "${album.album}" by artist "${album.artist}" from the year "${album.year}"`;
};

document.getElementById('iAmSureBox').oninput = (e) => {
  if (e.target.checked) sure = true;
};

document.getElementById('sortBy').oninput = () => {
  readJson(document.getElementById('sortBy').value, document.getElementById('ascdesc').value);
};
document.getElementById('ascdesc').oninput = () => {
  readJson(document.getElementById('sortBy').value, document.getElementById('ascdesc').value);
};

document.getElementById('editID').oninput = (y) => {
  let x = y.target.value;
  if (x == '' || x < 0 || x > cds.length - 1) {
    document.getElementById('editTextArtist').value = '';
    document.getElementById('editTextAlbum').value = '';
    document.getElementById('editTextYear').value = '';
    document.getElementById('editTextLocation').value = '';
    document.getElementById('editTextPosition').value = '';
    return;
  }
  for (let album of cds) {
    if (album.id == x) {
      document.getElementById('editTextArtist').value = album.artist;
      document.getElementById('editTextAlbum').value = album.album;
      document.getElementById('editTextYear').value = album.year;
      document.getElementById('editTextLocation').value = album.location;
      document.getElementById('editTextPosition').value = album.position;
      return;
    }
  }
  document.getElementById('editTextArtist').value = '';
  document.getElementById('editTextAlbum').value = '';
  document.getElementById('editTextYear').value = '';
  document.getElementById('editTextLocation').value = '';
  document.getElementById('editTextPosition').value = '';
};

document.getElementById('editForm').onsubmit = (evt) => {
  evt.preventDefault();
  let x = {
    id: evt.target[0].value,
    artist: evt.target[1].value,
    album: evt.target[2].value,
    year: evt.target[3].value,
    location: evt.target[4].value,
    position: evt.target[5].value,
  };
  x.location = x.location ? x.location : 'Unsorted';
  x.position = x.location == 'Unsorted' ? 'Unsorted' : x.position;

  if (x.artist == '') {
    new Notification('Input error', { body: 'Artist name cannot be blank' });
    return console.error('Artist name cannot be blank');
  } else if (x.album == '') {
    new Notification('Input error', { body: 'Album name cannot be blank' });
    return console.error('Album name cannot be blank');
  } else if (x.year == '') {
    new Notification('Input error', { body: 'Year cannot be blank' });
    return console.error('Year cannot be blank');
  } else if (isNaN(Number(x.year)) || Number(x.year) < 0) {
    new Notification('Input error', { body: 'Year has to be a valid and positive number' });
    return console.error('Year has to be a valid and positive number');
  } else if (!isNaN(Number(x.location))) {
    new Notification('Input error', { body: 'Location cannot be a number' });
    return console.error('Location cannot be a number');
  }
  for (let cd of cds) {
    if (cd.id == x.id) {
      cd.artist = x.artist;
      cd.album = x.album;
      cd.year = x.year;
      cd.location = x.location;
      cd.position = x.position;
      readFiltered();
      writeFile();
      return;
    }
  }
  new Notification('Edit error', { body: "Following ID doesn't exist" });
  return console.error("Following ID doesn't exist");
};

document.getElementById('showID').oninput = (x) => {
  let idElem = document.querySelectorAll('.cdID');
  let artistElem = document.querySelectorAll('.cdArtist');
  if (x.target.checked) {
    for (const i of idElem) {
      i.style.display = 'inline-block';
    }
    for (const i of artistElem) {
      i.style.width = '36%';
    }
  } else {
    for (const i of idElem) {
      i.style.display = 'none';
    }
    for (const i of artistElem) {
      i.style.width = '40%';
    }
  }
};

function writeFile() {
  fs.writeFile(
    'src/cd.json',
    JSON.stringify(
      cds.sort((a, b) => {
        return a.id - b.id;
      })
    ),
    (err) => {
      if (err) throw err;
    }
  );
}
