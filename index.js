/**
 * Alexa Skill for Reporting on the Current State of the Cryptocurrency Market
 *
 * Data is derived from accepted 3rd party aggregation source coinmarketcap.com
 *
 * @author Ray Dollete <contact@raydollete.com>
 */

// initialize Alexa SDK
var Alexa = require('alexa-sdk');

// initialize helper
var coin = require('./coin.js');

const APP_ID = undefined;

// new session handlers
const handlers = {

	// ask about a coin price
	'OneCoinIntent': function() {
		var coinName = coin.getSlotValue(this, 'Cryptocurrency');

		coin.getCoinPrice(coinName).then((price) => {
			this.emit(':tell', "The current price of " + coinName + " is " + coin.sayPrice(price));
		}, (error) => {
			this.emit(':tell', "Sorry, I wasn't able to get the price of " + coinName + ", please try again later.");
		});
	}
};

// export this module
exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};