#!/bin/bash

# build the angular app, specify root path
ng build --base-href /texteditor --prod --build-optimizer=false

# remove old build
# rm -r ~/public-dev/mnh-test

# copy new to html folder
# cp -r -v ./dist ~/public-dev/mnh-test 
rm -rf ../public-dev/*

cp -a dist/. ../public-dev/
