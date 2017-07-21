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
var Coin = require('./coin.js');

const APP_ID = undefined;

const states = {
	WELCOME: '_WELCOME'
};

// new session handlers
const handlers = {

	// new session
	'Start': function() {
		this.handler.state = states.WELCOME;
		this.emitWithState('MainPrompt');
	},

	// ask about a coin price by name
	'CoinPriceIntent': function() {
		var coinQuery = this.event.request.intent.slots['Cryptocurrency'].value;
		var coin = new Coin(coinQuery);

		coin.getData().then((coinData) => {
			this.emit(':tell', "The current price of " + coin.sayName() + " is " + coin.sayPrice());
		}, (error) => {
			console.log(error);
			this.emit(':tell', "Sorry, either " + coinQuery + " is not a recognized crypto currency or the market API is not reachable.  Please try saying a different name or try again later.");
		});
	},

	'Unhandled': function() {
		this.emit(':tell', "Sorry, I didn't understand that command" );
	}
};

// these handlers apply when you have engaged with the app
const welcomeHandlers = {

	// open/talk to/main menu
	'MainPrompt': function() {
		this.emit(':ask', 'What do you want to know about the crypto market?', 'Try saying "price of bitcoin" to get the current price ' +
			'of bitcoin');
	},

	'CoinPriceIntent': function() {
		var coinQuery = this.event.request.intent.slots['Cryptocurrency'].value;
		var coin = new Coin(coinQuery);

		coin.getData().then((coinData) => {
			this.emit(':tell', "The current price of " + coin.sayName() + " is " + coin.sayPrice());
		}, (error) => {
			console.log(error);
			this.emit(':tell', "Sorry, either " + coinQuery + " is not a valid crypto currency or the market API is not reachable.  Please try saying a different name or try again later.");
		});
	},

	'AMAZON.CancelIntent': function() {
		this.emit(':tell', 'Goodbye!');
	},

	'ExitIntent': function() {
		this.emit(':tell', 'Goodbye!');
	}
};

// export this module
exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers, welcomeHandlers);
	alexa.execute();
};