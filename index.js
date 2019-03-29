require('dotenv').config();
let axios = require('axios');
let Spotify = require('node-spotify-api');
let moment = require('moment');
let fs = require('fs');

// env data
let keys = require('./keys.js');


let action = '';
let name = [];
let args = process.argv;
args.map((item,index) => {
    if (index == 2) { 
        action = item;
    } else if (index > 2){
        name.push(item);
    }
});

switch(action) {
    case 'spotify-this-song':
        spotifyThisSong(name.join(' '));
        break;
    case 'concert-this':
        concertThis(name.join(' '));
        break;
    case 'movie-this':
        movieThis(name.join(' '));
        break;
    default:
        showHelp();
}



////////////////////////////////////////////////////////
//                      SPOTIFY                       //
////////////////////////////////////////////////////////

 
function spotifyThisSong(name) {
    let sQuery = name.length > 0 ? name : 'The Sign';

    if (sQuery.length > 0) {
        let spotify = new Spotify({
            id: keys.key.spotify_key,
            secret: keys.key.spotify_secret
        });
        spotify.search({ type: 'track', query: sQuery }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            
            /*
            Artist(s)
            The song's name
            A preview link of the song from Spotify
            The album that the song is from
            */
           
           console.log(data); 
        });
    }
}



////////////////////////////////////////////////////////
//                    BANDS IN TOWN                   //
////////////////////////////////////////////////////////

function concertThis(name) {

    let bQuery = name.length > 0 ? name : 'Massive Attack';
    let bandsInTownApiUrl = 'https://rest.bandsintown.com/artists/' + encodeURI(bQuery) + '/events?&date=upcoming&app_id=' + keys.key.bit_key;
    let details = '';
    if (bQuery.length > 0){
        // console.log(bandsInTownApiUrl);
        axios.get(bandsInTownApiUrl)
        .then(function(res){
            // console.log(res.data[0]);
            let concerts = res.data;
            if (concerts.length > 0) {
                console.log('\nNext concert dates for ' + bQuery);
                details = '=====================\n';
                for (var i = 0; i < 3;i++) {
                    concertDate = moment(concerts[i].datetime).format('MM/DD/YYYY');
                    details += `
    Next Concert
    Venue: ${concerts[i].venue.name}
    Location: ${concerts[i].venue.city}
    Date: ${concertDate}

=====================
                    `;
                }
            } else {
                details = `
=====================

    Sorry, no upcoming concerts for ${bQuery} were found.

=====================\n
`;

            }
            console.log(details);
            /*
            Name of the venue
            Venue location
            Date of the Event (use moment to format this as "MM/DD/YYYY")
            */
        });
    }
}





////////////////////////////////////////////////////////
//                       OMDB                         //
////////////////////////////////////////////////////////

function movieThis(name) {

    let movieTitle = name.length > 0 ? name : 'Mr. Nobody';
    if (movieTitle.length > 0){
        let omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + keys.key.omdb_key + '&t=' + encodeURI(movieTitle);
        console.log('=====================\r\n');
        console.log(omdbApiUrl);

        axios.get(omdbApiUrl)
            .then(function(res){
                console.log(res.data);
                let movie = res.data;
                let details = '';
                if (movie.length > 0) {
                    details = `
=====================

=====================
                `;
                } else {
                    details = `
=====================
    Sorry, nothing found for ${movieTitle}
=====================
                    `;
                }      
                console.log(details);
    /*
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    */
            });
    }
}

function showHelp() {
    let help = `
    Welcome to LIRIBot\n
    I'm a simple bot but powerful. You can search for movies, songs or bands.\n
    Use the following parameters to get what you are looking for:\n\n

    node index.js spotify-this-song <Song title goes here>\n
    node index.js movie-this <Movie title goes here>\n
    node index.js concert-this <Band name goes here>\n\n

    Have fun!
    `;
    console.log(help);
}