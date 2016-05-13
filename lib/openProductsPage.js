/* global phantom */

var webpage = require('webpage');

var USER_CARDS_URI = 'index.php?mainPage=browseUserProducts&idCategory=1&idUser=1854330&resultsPage=';

function openProductsPage(host, userCards, pageNum, openCb, closeCb) {
  var page = webpage.create();
  
  // TODO: call the next page once this one is read
  page.onClosing = closeCb;
  
  page.open(
    host + USER_CARDS_URI + pageNum, 
    openCb.bind(this, host, userCards, page)
  );
}

module.exports = openProductsPage;