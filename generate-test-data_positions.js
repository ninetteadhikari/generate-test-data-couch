const dotenv = require('dotenv');
dotenv.config();

// CONFIGURE THESE
const couchDb = process.env.COUCHDB_URL
const nano = require('nano')(couchDb)
const targetDbName = 'db_positions'
const dryRun = true
const docAmount = 10

console.log(`***couch url: ${process.env.COUCHDB_URL}`)

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const oneOf = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

const getRandomNumberInRange = (from, to, fixed) => {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

const generateData = async () => {
  console.log(`${dryRun ? 'DRY RUN' : 'FOR REALSIES'}: Generating ${docAmount} docs(s) to ${couchDb}:`)

  let targetDb
  try {
  targetDb = nano.db.use(targetDbName)
  } catch (e) {
  console.log('Could not open target DB', e)
  }

  let bulkDocs = []

  for (let index = 0; index < docAmount; index++) {
      const doc = {
          _id: `prefix:${Math.round(Math.random()*10e10)}`,
          // Generate a random date between 2012 and now
          lat: getRandomNumberInRange(-180, 180, 15),
          long: getRandomNumberInRange(-180, 180, 15),
          source: 'onefleet',
          identifier: oneOf(['VEHICLE_123', 'CASE_098', 'AIRCRAFT_567']),
          timestamp: randomDate(new Date(2012, 0, 1), new Date()).toJSON(),
      }
      bulkDocs.push(doc)
  }
  if (dryRun) {
      console.log(`Generated ${bulkDocs.length} document(s), here are the first three:`)
      console.log(bulkDocs[0])
      console.log(bulkDocs[1])
      console.log(bulkDocs[2])
  } else {
      try {
          const bulkDocsResponse = await targetDb.bulk({docs: bulkDocs})
          console.log('bulkDocsResponse', bulkDocsResponse)
      } catch (e) {
          console.log('error putting bulkdocs:', e)
      }
  }
}

generateData()

