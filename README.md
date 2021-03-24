# Generate test data for CouchDB

## Install dependencies
```bash
npm install
```

## Configure variables
### Dry run
- Add CouchDB URL
- Add a `targetDbName`
- Leave `dryRun` as `true`
### Generate data in database
- Change `dryRyn` to `false`
- Change docAmount to however many documents you want to generate

## Run to create test data
```bash
node generate-test-data_items.js
node generate-test-data_positions.js
```
