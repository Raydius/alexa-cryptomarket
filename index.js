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
		var price = coin.getCoinPrice('bitcoin');
		this.emit(':tell', "The current average trading price of Bitcoin is "+price+" dollars.");
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