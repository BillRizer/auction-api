#!/bin/bash

FILE_LOCK="/seed-already-loaded.lock"
SEEDS_PATH="/seeds/*"
#TODO implement real FILE_LOCK current implementation is broken, because run every time that container is started
if [ -f "$FILE_LOCK" ]; then
    echo "OK - Seed files already loaded"
    echo "(remove /seed-already-loaded.lock for ignore this)"
    exit 0
else 
    echo "Running seed files ..."
    for f in $SEEDS_PATH
    do
        echo "Processing $f file..."
        `psql auction -U postgres -d auction -f $f &>> $FILE_LOCK`
        
    done
    echo "Done"        
fi
