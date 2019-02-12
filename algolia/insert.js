const algolia = require('./algolia');

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
  for (i = 0; i < objects.length; i++) { 
    var filterData = [];
    filterData = yotpoData.filter(rev => rev.name.includes(objects[i].name.substr( objects[i].name.length - 10)) );
    console.log('name',objects[i].name);
  //  console.log('2222222222222',objects[i].name.substr( objects[i].name.length - 10));

    if(filterData.length > 0 )
    saveData.push({ objectID: objects[i].objectID, rating: filterData[0].average_score, reviews: filterData[0].total_reviews});
  }
  console.log('0000000000000',saveData);


  // const index = algolia.initIndex('next-teo-products');
  // index.partialUpdateObjects(saveData, function(err, content) {
  //   if (err) throw err;
  
  //   console.log('result-ok',content);
  // });

}
