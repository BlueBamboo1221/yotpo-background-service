const algolia = require('./algolia');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});

module.exports.insertObjects = async function (data) {

  const index = algolia.initIndex('next-teo-products');
  
  var objects = []; var i;

   for (i = 0; i < data.length; i++) { 
      var indexname = data[i].name;
      var skuname = data[i].external_product_id;
      searchfunction(indexname,skuname,objects,data);
  }

}

async function searchfunction(parameters, skuname,objects, yotpoData){
  const index = algolia.initIndex('next-teo-products');
  index.search({ query: parameters,  }, function(err, content) {
    if (err) throw err;

    objects.push({ objectID: content.hits[0].objectID, name: parameters});
    
    
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
  //  filterData = yotpoData.filter(rev => rev.name.includes(objects[i].name.substr( objects[i].name.length - 10)) && rev.name.includes(objects[i].name.substring(0,3)) && rev.name.length == objects[i].name.length && rev.name.includes(objects[i].name.substring(6,10)) && rev.name.includes(objects[i].name.substring(objects[i].name.length / 2 - 5 ,objects[i].name.length / 2 )));
    filterData = yotpoData.filter(rev => rev.name.toString().match(objects[i].name.toString()));
    console.log('name',objects[i].name);
    console.log('rating',filterData[0].average_score);

  log_file.write(objects[i].name + '\n');

    if(filterData.length > 0 )
    {
    saveData.push({ objectID: objects[i].objectID, rating: filterData[0].average_score, reviews: filterData[0].total_reviews});
    log_file.write( "ID : " + objects[i].objectID + "  rating : " + filterData[0].average_score + "  reviews : " + filterData[0].total_reviews + '\n');
  }
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
