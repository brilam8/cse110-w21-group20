#!/bin/bash

echo "running linters..."

npx htmlhint **/*.html
echo "done running htmlhint!"

npx stylelint **/*.css
echo "done running stylelint!"

npx eslint main.js
echo "done running eslint!"

echo "Ran all checks!"