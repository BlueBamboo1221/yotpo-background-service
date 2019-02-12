const algoliasearch = require('algoliasearch')

ALGOLIA_APP_ID="CUDCYZHOXL"
ALGOLIA_API_KEY="0688032a3dfc48a81a666ae598b66c90"

const algolia = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY
)

module.exports = algolia
