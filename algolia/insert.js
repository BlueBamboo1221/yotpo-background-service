const algolia = require('./algolia');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});

module.exports.insertObjects = async function (data) {

  const index = algolia.initIndex('next-teo-products');
  
  var objects = []; var i;

   for (i = 0; i < data.length; i++) { 
      var indexname = data[i].name;
      searchfunction(indexname,objects,data);
  }

}

async function searchfunction(parameters, objects, yotpoData){
  const index = algolia.initIndex('next-teo-products');
  index.search({ query: parameters }, function(err, content) {
    if (err) throw err;

    objects.push({ objectID: content.hits[0].objectID, name: content.hits[0].name});

    if(yotpoData.length == objects.length)
       updateToAlgolia(objects, yotpoData)
   });
}


async function updateToAlgolia(objects, yotpoData){

  var saveData = []; var i;
  var currentDateTime = new Date();    
  log_file.write(currentDateTime.toISOString() + '\n');

  for (i = 0; i < objects.length; i++) { 
    var filterData = [];
    filterData = yotpoData.filter(rev => rev.name.includes(objects[i].name.substr( objects[i].name.length - 10)) );
    console.log('name',objects[i].name);

  log_file.write(objects[i].name + '\n');

  //  console.log('2222222222222',objects[i].name.substr( objects[i].name.length - 10));

    if(filterData.length > 0 )
    saveData.push({ objectID: objects[i].objectID, rating: filterData[0].average_score, reviews: filterData[0].total_reviews});
    log_file.write( "ID : " + objects[i].objectID + "  rating : " + filterData[0].average_score + "  reviews : " + filterData[0].total_reviews + '\n');
  }
  console.log('0000000000000',saveData);

  log_file.write('*********************************************' + '\n');


   const index = algolia.initIndex('next-teo-products');
   index.partialUpdateObjects(saveData, function(err, content) {
     if (err) throw err;
  
     console.log('result-ok',content);
     log_file.write('******************SUCCESS***********************' + '\n');

   });

}
