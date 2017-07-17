/**
 * Helper module for CoinMarketCap API
 */

// initialize coinmarketcap API
var coinmarketcap = require('coinmarketcap');
global.fetch = require('node-fetch');

var coin = {

	// helper to get intent variables from Alexa
	getSlotValue: function(alexa, slot) {
		return (alexa.event.request.intent.slots[slot].value)
			? alexa.event.request.intent.slots[slot].value
			: null;
	},

	// helper to better say a money value
	sayPrice: function(value) {
		var dollars = Math.floor(value);
		var cents = Math.round((value - dollars) * 100);

		var phrase = dollars + " dollars";

		if (cents > 0) {
			phrase += " and " + cents + " cents";
		}

		return phrase;
	},

	// look up the value of a single coin
	getCoinPrice: function(coinName) {
		return new Promise( function (resolve, reject) {
			coinmarketcap.tickerByAsset(coinName).then(function(coinData) {
				resolve(coinData["price_usd"]);
			});
		});
	}

};

module.exports = coin;