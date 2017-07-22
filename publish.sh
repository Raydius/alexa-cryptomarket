#!/bin/bash
zip -r ../alexa-cryptomarket.zip * -x assets/\\* *.git/*
aws lambda update-function-code --function-name myCryptoMarketSkill --zip-file fileb://../alexa-cryptomarket.zip
