/**
 * Helper module for CoinMarketCap API
 */

// initialize coinmarketcap API
var coinmarketcap = require('coinmarketcap');
global.fetch = require('node-fetch');


function Coin(query) {
	this.query = query;
}


Coin.prototype = {
	constructor: Coin,

	getData: function() {
		// reset context
		var self = this;

		// look up the value of a single coin
		return new Promise( function (resolve, reject) {

			console.log('filteredCoinQuery', self.filteredCoinQuery());

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

		console.log('running filteredCoinQuery');

		// translate common shorthands and misinterpretations
		switch(self.query) {
			case 'ethereum classic': return "ethereum-classic";
			default: return self.query;
		}
	},

	sayName: function() {
		// reset context
		var self = this;

		switch(self.data.name) {
			case 'Litecoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈlaɪt.kɔɪn\">litecoin</phoneme>";
			case 'EOS': return "E <phoneme alphabet=\"ipa\" ph=\"os\">eos</phoneme>";
			case 'Zcash': return "Z <phoneme alphabet=\"ipa\" ph=\"kæʃ\">cash</phoneme>";
			case 'Qtum': return "Q <phoneme alphabet=\"ipa\" ph=\"tʌm\">cash</phoneme>";
			case 'Siacoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈsia.kɔɪn\">siacoin</phoneme>";
			case 'Dogecoin': return "<phoneme alphabet=\"ipa\" ph=\"ˈdoʒ.kɔɪn\">dogecoin</phoneme>";
			default: return self.data.name;
		}
	},

	// helper to better say a money value
	sayPrice: function() {
		// reset context
		var self = this;
		var value = self.data['price_usd'];

		var dollars = Math.floor(value);
		var cents = Math.round((value - dollars) * 100);

		return (cents > 0) ? dollars+" dollars and "+cents+" cents" : dollars + " dollars";
	},

	sayRank: function() {
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