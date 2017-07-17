/**
 * Helper module for CoinMarketCap API
 */

// initialize coinmarketcap API
var coinmarketcap = require('coinmarketcap');

var coin = {
	getCoinPrice: function(coinName) {
		coinmarketcap.tickerByAsset(coinName).then(function(coinData) {
			return coinData.price_usd;
		});
	}

};

module.exports = coin;