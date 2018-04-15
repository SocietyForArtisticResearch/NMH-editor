#!/bin/bash

# build the angular app, specify root path
ng build --base-href /text-editor --prod

# remove old build
# rm -r ~/public-dev/mnh-test

# copy new to html folder
# cp -r -v ./dist ~/public-dev/mnh-test 

