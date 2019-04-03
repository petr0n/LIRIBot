require('dotenv').config();
const axios = require('axios');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

// keys
const keys = require('./keys.js');

if (process.argv) {
	let args = process.argv;
	let name = args.slice(3, args.length);
	// console.log(name);
	start(process.argv[2], name.join(' '));
}


function start(action, name){
	switch(action) {
		case 'spotify-this-song':
			spotifyThisSong(name);
			break;
		case 'concert-this':
			concertThis(name);
			break;
		case 'movie-this':
			movieThis(name);
			break;
		case 'do-what-it-says':
			let line = getRandomLine();
			line = line.split(' ');
			name = line.slice(1, line.length);
			start(line[0], name.join(' '));
			console.log(name.join(' '));
			break;
		default:
			showHelp();
	}

	// write to log 
	let now = new Date();
	logger(moment(now).format('YYYY-MM-DD h:mm:ssA') + ' - ACTION: ' + action + ' QUERY: ' + name);

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
		   //console.log(data.tracks.items);
		   let items = data.tracks.items;
		   if (items.length > 0) {
				details = `Song: ${chalk.bold.cyanBright(sQuery)}
					Artist: ${data.tracks.items[0].album.artists[0].name} 
					Album: ${data.tracks.items[0].album.name}
					Preview URL: ${data.tracks.items[0].preview_url}`;
			   
				console.log(buildMessage('success', details));                
				logger('RESULT: success');                
			} else {
				console.log(buildMessage('fail', 'No matching tracks found'));
				logger('RESULT: fail');
			}
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
			// console.log(res.data);
			let concerts = res.data;
			if (concerts.length > 0) {
				
				totalConcerts = concerts.length < 3 ? concerts.length : 3;
				console.log(chalk.bold.cyanBright('\nNext three concert dates for ' + bQuery + ' '));
				for (var i = 0; i < totalConcerts;i++) {
					concertDate = moment(concerts[i].datetime).format('MM/DD/YYYY');
					details += `Venue: ${concerts[i].venue.name}
						Location: ${concerts[i].venue.city}
						Date: ${concertDate}
						-----------------------\n`;
				}

				logger('RESULT: success');
				console.log(buildMessage('success', details));
			} else {
				details = `Sorry, no upcoming concerts for ${bQuery} were found.\n`;

				logger('RESULT: fail');
				console.log(buildMessage('fail', details));
			}
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
		// console.log(omdbApiUrl);

		axios.get(omdbApiUrl)
			.then(function(res){
				// console.log(res.data);
				if (res.data.Response == 'False') {
					details = `${movieTitle}\n${res.data.Error}`;

					console.log(buildMessage('fail', details));
					logger('RESULT: fail');
				} else {
					let movie = res.data;
					let rottenToms = '';
					if (movie.Ratings.length > 1) {
						rottenToms = '\nRotten Tomatoes Rating: ' + movie.Ratings[1].Value;
					}
					try {
						let details = `${chalk.bold.cyanBright(movie.Title)}
								Release year: ${movie.Year}
								IMDB Rating: ${movie.Ratings[0].Value}${rottenToms}
								Origin: ${movie.Country}
								Language: ${movie.Language}
								Actors: ${movie.Actors}
								Plot: ${movie.Plot}`;
						console.log(buildMessage('success', details));
						logger('RESULT: success');
					}
					catch(err) {
						console.log(err.message);
					}
				}
			});
	}
}

function getRandomLine(){
	let data = fs.readFileSync('random.txt', 'utf8');
	var lines = data.split('\n');
	// console.log(lines[Math.floor(Math.random()*lines.length)]);
	return lines[Math.floor(Math.random()*lines.length)]
}

function showHelp() {
	let help = `
	${chalk.bold.cyanBright('Welcome to LIRIBot')}
	I'm a simple bot but powerful. You can search for movies, songs or bands.
	Use the following parameters to get what you are looking for:\n

	node index ${chalk.black.bgCyanBright('spotify-this-song')} <Song title goes here>
	node index ${chalk.black.bgCyanBright('movie-this')} <Movie title goes here>
	node index ${chalk.black.bgCyanBright('concert-this')} <Band name goes here>

	Or get something random
	node index ${chalk.black.bgCyanBright('do-what-it-says')} \n

	Have fun!
	`;
	console.log(help);
}

function buildMessage(successFail, message) {
	const seperator = '=====================\n';
	let ret = seperator;
	if (successFail == 'success') {
		ret += `SUCCESS
		${message}
		`;
		ret += seperator;
		ret = chalk.yellow(ret.replace(/\t/g, ''));
	} else {
		ret += `FAIL
		${message}
		`;
		ret += seperator;
		ret = chalk.red(ret.replace(/\t/g, ''));
	}
	return ret;
}

function logger(message) {
	fs.appendFileSync('log.txt', message + '\n');
}