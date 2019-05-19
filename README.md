# LIRIBot
A music and movie Language Interpretation and Recognition Interface Bot. LIRIBot is a simple but powerful bot. You can search for movies, songs or bands.

Github: https://github.com/petr0n/LIRIBot

Use the pass parameters to get what you are looking for:

* `node index spotify-this-song <song title goes here>`
* `node index movie-this <movie title goes here>`
* `node index concert-this <band name goes here>`

Or get something random
* `node index do-what-it-says` 

EXTRA function 
* `node index help` <-Outputs the available commands

### Additional Notes 
The function *do-what-it-says* reads the random.txt and pulls out a random line from it and runs it.


------------------------

## Dependencies
* NodeJS
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Node Spotify API](https://www.npmjs.com/package/node-spotify-api)
* [MomentJS](http://momentjs.com)
* [Chalk](https://www.npmjs.com/package/chalk) - Adds additional coloring options in CLI


Have fun!

------------------------

## Examples

### spotify-this-song

![alt text](https://raw.githubusercontent.com/petr0n/LIRIBot/master/images/spotify-this-song-example.gif "Spotify This Song")

### concert-this

![alt text](https://raw.githubusercontent.com/petr0n/LIRIBot/master/images/concert-this-example.gif "Concert This")

### movie-this

![alt text](https://raw.githubusercontent.com/petr0n/LIRIBot/master/images/movie-this-example.gif "Movie This")


### do-what-it-says

![alt text](https://raw.githubusercontent.com/petr0n/LIRIBot/master/images/do-what-it-says-example.gif "Do What It Says")

------------

### BONUS
### Help - to help users

![alt text](https://raw.githubusercontent.com/petr0n/LIRIBot/master/images/help-example.gif "Help")
