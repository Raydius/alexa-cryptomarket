#!/bin/bash
zip -r ../alexa-cryptomarket.zip * -x assets/\\* *.git/*
aws lambda update-function-code --profile personal --function-name myCryptoMarketSkillv2 --zip-file fileb://../alexa-cryptomarket.zip
