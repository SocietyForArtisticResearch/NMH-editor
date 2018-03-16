#!/bin/bash

# build the angular app, specify root path
ng build --prod --build-optimizer --base-href /mnh-test/

# remove old build
rm -r ~/public_html/mnh-test

# copy new to html folder
cp -r -v ./dist ~/public_html/mnh-test 
