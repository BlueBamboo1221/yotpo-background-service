const dotenv = require('dotenv').load();
const request = require('request-promise')

const { parseProfile, parsePosts } = require('./utils/parser')
const { insertObjects } = require('./algolia/insert')


const bodyParser = require('body-parser');
const axios = require('axios');
const yotpoConfig = require('./config.json');

const cron = require("node-cron");

cron.schedule("* * * * *", () => { 

var currentDateTime = new Date();    
var currentDate = currentDateTime.toISOString().substring(0,10);

try{

let postData = []

axios.post('https://api.yotpo.com/oauth/token', yotpoConfig)
.then(({ data }) => {
  axios.get(`https://api.yotpo.com/v1/apps/gzLifCZ7CnkFZTx4G1LaYq2lKf3l5GCCSQy6FivI/products?utoken=${data.access_token}&count=1000`)
    .then(({ data }) => {
      let productData = [];
      productData = data.products;
      postData = productData.filter(rev => rev.updated_at.includes(currentDate));
      insertObjects(postData);
    }).catch(e => res.status(200).send(e));

})
.catch(e => res.status(500).send(e));

  } catch (e) {
    console.log("Error::", e)
  }
});