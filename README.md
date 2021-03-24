# Generate test data for CouchDB

## Install dependencies
```bash
npm install
```

## Configure variables
### Dry run
- Leave `dryRun` as `true`
### Generate data in database
- Add CouchDB URL
- Add a `targetDbName`. Make sure that the database with this name exists in your CouchDB.
- Change `dryRyn` to `false`
- Change docAmount to however many documents you want to generate

## Run to create test data
```bash
node generate-test-data_items.js
node generate-test-data_positions.js
```
