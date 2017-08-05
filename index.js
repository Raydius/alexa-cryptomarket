/**
 * Alexa Skill for Reporting on the Current State of the Cryptocurrency Market
 *
 * Data is derived from accepted 3rd party aggregation source coinmarketcap.com
 *
 * @author Ray Dollete <contact@raydollete.com>
 */

// initialize Alexa SDK
const Alexa = require('alexa-sdk');

// initialize helper
const Coin = require('./coin.js');

const APP_ID = "amzn1.ask.skill.6cc3e8fd-b9a0-4d1c-8566-87ee46152723";

const states = {
	WELCOME: '_WELCOME'
};

// new session handlers
const handlers = {

	// new session
	'LaunchRequest': function() {
		this.handler.state = states.WELCOME;
		this.emitWithState('MainPrompt');
	},

	// single shot, ask about a coin price by name
	'CoinPriceIntent': function() {

		let coinQuery = this.event.request.intent.slots['Cryptocurrency'].value;

		// handle the misunderstood "help" intent
		if(coinQuery == 'help') {
			this.handler.state = states.WELCOME;
			this.emitWithState('AMAZON.HelpIntent');
		}
		else {

			let coin = new Coin(coinQuery);

			coin.getData().then((coinData) => {
				this.emit(':tell', "The current price of " + coin.sayName(coinData.name) + " is " + coin.sayPrice());
			}, (error) => {
				console.log(error);
				this.emit(':tell', "Sorry, either " + coinQuery + " is not a recognized crypto currency or the market API is not reachable.  Please try again.");
			});
		}

	},

	'AMAZON.HelpIntent': function() {
		this.handler.state = states.WELCOME;
		this.emitWithState('AMAZON.HelpIntent');
	},

	'SessionEndedRequest': function() {
		// do nothing (no response to SessionEndedRequest)
	},

	'Unhandled': function() {
		this.handler.state = states.WELCOME;
		this.emitWithState('MainPrompt');
	}
};

// these handlers apply when you have engaged with the app
const welcomeHandlers = Alexa.CreateStateHandler(states.WELCOME, {

	// open/talk to/main menu
	'MainPrompt': function() {
		this.emit(':ask', 'What cryptocurrency do you want to know about?', 'What cryptocurrency do you want to know about? Try saying ethereum.');
	},

	'CoinPriceIntent': function() {
		let coinQuery = this.event.request.intent.slots['Cryptocurrency'].value;

		// handle the misunderstood "help" intent
		if(coinQuery == 'help') {
			this.handler.state = states.WELCOME;
			this.emitWithState('AMAZON.HelpIntent');
		}
		else {
			let coin = new Coin(coinQuery);

			coin.getData().then((coinData) => {
				this.emit(':ask', "The current price of " + coin.sayName(coinData.name) + " is " + coin.sayPrice() + '. Do you want me to look up another cryptocurrency?');
			}, (error) => {
				console.log(error);
				this.emit(':ask', "Sorry, either " + coinQuery + " is not a valid crypto currency or the market API is not reachable.  Do you want me to try a different cryptocurrency?");
			});
		}
	},

	'AMAZON.YesIntent': function() {
		this.emitWithState('MainPrompt');
	},

	'AMAZON.NoIntent': function() {
		this.emitWithState('ExitIntent');
	},

	'AMAZON.HelpIntent': function() {
		let coin = new Coin();

		this.emit(':ask',
			'If you say the name of a cryptocurrency like '+ coin.sayName('Bitcoin')+', I can tell you the current market value in US dollars.  What cryptocurrency do you want to know about?',
			'What cryptocurrency do you want to know about?  Try saying Bitcoin.');
	},

	'AMAZON.StopIntent': function() {
		this.emitWithState('ExitIntent');
	},

	'AMAZON.CancelIntent': function() {
		this.emitWithState('ExitIntent');
	},

	'SessionEndedRequest': function() {
		// do nothing (no response to SessionEndedRequest)
	},

	'ExitIntent': function() {
		this.emit(':tell', 'Goodbye');
	},

	'Unhandled': function() {
		let coin = new Coin();

		this.emit(':ask', "Sorry, I didn't understand that command.  What cryptocurrency do you want to know about?", 'What cryptocurrency do you want to know about? Try saying '+ coin.sayName('Bitcoin') + '.');
	}
});

// export this module
exports.handler = function(event, context, callback) {
	let alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(handlers, welcomeHandlers);
	alexa.execute();
};