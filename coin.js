/**
 * Helper module for CoinMarketCap API
 */

// initialize coinmarketcap API
var coinmarketcap = require('coinmarketcap');
global.fetch = require('node-fetch');

var coin = {
	getCoinPrice: function(coinName) {
		return new Promise( function (resolve, reject) {
			coinmarketcap.tickerByAsset(coinName).then(function(coinData) {
				resolve(coinData["price_usd"]);
			});
		});
	}

};

module.exports = coin;