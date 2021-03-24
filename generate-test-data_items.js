const dotenv = require('dotenv');
dotenv.config();

// CONFIGURE THESE
const couchDb = process.env.COUCHDB_URL
const nano = require('nano')(couchDb)
const targetDbName = 'db_items'
const dryRun = false
const docAmount = 100

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const oneOf = (items) => {
  return items[Math.floor(Math.random() * items.length)]
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
          createdAt: randomDate(new Date(2012, 0, 1), new Date()).toJSON(),
          template: oneOf(['case', 'vehicle', 'aircraft', 'commercial ship', 'civilian ship']),
          properties: {
            air: oneOf([true, false]),
            tracking_type: oneOf(['Manual', 'Automatic']),
            get_historical_data_since: '-1',
            active: oneOf([true, false]),
            color: oneOf(['#f220ac', '#1c17be', '#6383e6'])
          },
          identifier: oneOf(['VEHICLE_123', 'CASE_098', 'AIRCRAFT_567']),
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

