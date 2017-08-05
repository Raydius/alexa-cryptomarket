/**
 * Helper module for CoinMarketCap API
 */

// initialize coinmarketcap API
var coinmarketcap = require('coinmarketcap');
global.fetch = require('node-fetch');


function Coin(query) {
	if(query) {
		this.query = query;
	}
}


Coin.prototype = {
	constructor: Coin,

	getData: function() {
		// reset context
		var self = this;

		// look up the value of a single coin
		return new Promise( function (resolve, reject) {

			coinmarketcap.tickerByAsset(self.filteredCoinQuery()).then(function(coinData) {
				self.data = coinData;
				resolve(coinData);
			}).catch(function (err) {
				console.log('getData() error', err);
				reject(err);
			});
		});
	},

	filteredCoinQuery: function() {
		// reset context
		var self = this;

		console.log('processing query: ', self.query);

		// translate common shorthands and misinterpretations
		switch(self.query) {
			case 'light':
			case 'coin':
				return "litecoin";
			case 'or':
				return "bancor";
			case 'bytecoin':
				return 'bytecoin-bcn';
			case 'cloak':
				return "cloakcoin";
			case 'dash coin':
				return "dash";
			case 'classic':
			case 'ethereum classic':
				return "ethereum-classic";
			case 'stellar lumens':
				return "stellar";
			default: return self.query;
		}
	},

	// pronunciation fixes
	sayName: function(name) {
		switch(name) {
			case 'Bitcoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈbɪt.kɔɪn\">Bitcoin</phoneme>";
			case 'Litecoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈlaɪt.kɔɪn\">litecoin</phoneme>";
			case 'EOS': return "E <phoneme alphabet=\"ipa\" ph=\"os\">eos</phoneme>";
			case 'Zcash': return "Z <phoneme alphabet=\"ipa\" ph=\"kæʃ\">cash</phoneme>";
			case 'Qtum': return "Q <phoneme alphabet=\"ipa\" ph=\"tʌm\">cash</phoneme>";
			case 'Siacoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈsia.kɔɪn\">siacoin</phoneme>";
			case 'Dogecoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈdoʒ.kɔɪn\">dogecoin</phoneme>";
			default: return name;
		}
	},

	// helper to better say a money value
	sayPrice: function() {
		// reset context
		var self = this;
		var value = self.data['price_usd'];

		if(value < 0.01) {
			return "less than 1 cent";
		}
		else {
			var dollars = Math.floor(value);
			var cents = Math.round((value - dollars) * 100);

			var dollarlabel = (dollars == 1) ? "dollar" : "dollars";

			return (cents > 0) ? dollars + " " + dollarlabel + " and " + cents + " cents" : dollars + " " + dollarlabel;
		}
	},

	getRank: function() {
		// reset context
		var self = this;
		var rank = self.data['rank'];

		switch(rank) {
			case '1': return "first";
			case '2': return "second";
			case '3': return "third";
			default: return rank + 'th';
		}
	}



};

module.exports = Coin;