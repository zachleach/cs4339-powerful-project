# I'm too lazy to run a bunch of commands, so this is for QoL
# You should run this in the project root

# Cleaning out node_modules because node_modules keeps interfering with the test cases
rm -rf node_modules
npm i
# Similarly, I need to do the loadDatabase.js thing

node loadDatabase.js
cd test
rm -rf node_modules
npm i
npm test