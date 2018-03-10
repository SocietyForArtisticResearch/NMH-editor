#!/bin/bash

# build the angular app, specify root path
ng build --base-href /mnh-test/

# copy to html folder
cp -r -v ./dist ~/public_html/mnh-test 
