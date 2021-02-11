#!/bin/bash

npm run test

npx htmlhint ./index.html
echo "done running htmlhint!"

npx stylelint ./style.css
echo "done running stylelint!"

npx eslint main.js
echo "done running eslint!"

echo "Ran all checks!"