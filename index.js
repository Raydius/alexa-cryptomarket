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

// in-app states
const states = {
	// main/welcome
	WELCOME: '_WELCOME',
	// per exchange queries
	EXCHANGE: '_EXCHANGE',
	// per coin queries
	COIN: '_COIN'
};

// new session handlers
const handlers = {

	// new session
	'Start': function() {
		this.handler.state = states.WELCOME;
		this.emitWithState('MainPrompt');
	},

	// get the top 10
	'TopTenIntent': function() {
		coin.getCoinPrice('bitcoin').then((price) => {
			this.emit(':tell', "The current price of bitcoin is " + price + " dollars.");
		}, (error) => {
			this.emit(':tell', "Sorry that has been an error.");
		});
	},

	'OneCoinIntent': function() {
		var coinName = coin.getSlotValue(this, 'Cryptocurrency');

		coin.getCoinPrice(coinName).then((price) => {
			this.emit(':tell', "The current price of " + coinName + " is " + price + " dollars.");
		}, (error) => {
			this.emit(':tell', "Sorry that has been an error.");
		});
	}
};

var welcomeHandlers = Alexa.CreateStateHandler(states.WELCOME, {

	// main welcome without specified intent
	'MainPrompt': function() {
		this.emit(':tell', 'What do you want to know about the current state of the crypto currency market?');
	}

});

// export this module
exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers, welcomeHandlers);
	alexa.execute();
};