const algoliasearch = require('algoliasearch')

ALGOLIA_APP_ID="***"
ALGOLIA_API_KEY="***"

const algolia = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY
)

module.exports = algolia
