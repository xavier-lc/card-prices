var MkmParser = function () {};

MkmParser.prototype._host = 'https://es.magiccardmarket.eu/';
MkmParser.prototype._cards = [];
MkmParser.prototype._cardLimit;

MkmParser.prototype.readFirstPage = function () {
    console.log('a');
    
    var page = require('webpage').create();
    var self = this;
    console.log('b');
    page.open(this._host + 'index.php?mainPage=browseUserProducts&idCategory=1&idUser=103227', function () {
//    page.open(this._host + 'index.php?mainPage=browseUserProducts&idCategory=1&idUser=1854330', function () {
        console.log('c');
        // dummy div
        var div = document.createElement('div');
        div.innerHTML = page.content;

        var cardRows = div.querySelectorAll('.MKMTable tbody tr');
        console.log(cardRows.length);
        
        self._cardLimit = cardRows.length;
        
        for(var i = 0; i < self._cardLimit; i++) {
            var name = cardRows[i].children[2].children[0].innerHTML;
            var href = this._host + cardRows[i].children[2].children[0].href;
            
            var langPattern = /showMsgBox\('[^']+/;
            var lang = langPattern.exec(cardRows[i].children[6].innerHTML)[0];
            lang = lang.substr("showMsgBox('".length, lang.length - "showMsgBox('".length);
            
            var condPattern = /cardstateicons\/\w{2}/;
            var condition = condPattern.exec(cardRows[i].children[6].innerHTML)[0];
            condition = condition.substr(condition.length - 2, 2);
            
            var foil = cardRows[i].children[7].innerHTML === '' ? false : true;
            var priceText = cardRows[i].children[9].innerHTML;
            
            self._cards.push({
                name: name,
                href: href,
                language: lang,
                condition: condition,
                foil: foil,
                myPrice: priceText,
            });
        }
    });
    
    page.close();
    
    this.addCardsToFile();
    
    phantom.exit();
};

MkmParser.prototype.addCardsToFile = function () {
    var fs = require('fs');
    var file = 'list.json';

    for(var i = 0; i < this._cards.length; i++) {
        fs.write(file, this._cards[i], 'a');
    }
};

MkmParser.prototype.readCardPage = function (card, i) {
    var page = require('webpage').create();
    var self = this;
    console.log(new Date().getTime() - self._start + ': ' + 
        'launch: ' + i + '-' + card.href);
    
    page.open(this._host + card.href, function () {
        // dummy div
        var div = document.createElement('div');
        div.innerHTML = page.content;
        
        self._cards[card.name].avg = div.querySelector('.availTable .cell_2_1').innerHTML;
        console.log(new Date().getTime() - self._start + ': ' + self._cards[card.name].avg);
//        var avgPrice = avgPrice.substr(0, avgPrice.length - 2);
        
        if(i === (self._cardLimit - 1)) {
            self.printCards();

            phantom.exit();
        }
        
        console.log(new Date().getTime() - self._start + ': ' + 
            'closing: ' + i + '-' + card.href);
        console.log('---');
        
        page.close();
    });
};

MkmParser.prototype.printCards = function () {
    console.log('CARD | MY PRICE | AVG');
    
    for(var i in this._cards) {
        console.log(i + ' ' + this._cards[i].price + ' ' + this._cards[i].avg);
    }
};

var mkm = new MkmParser();
mkm.readFirstPage();

//var txt = fs.read('patilladesList.html');
//
////var parser=new DOMParser();
////var DOM = parser.parseFromString(txt, "text/xml");
////
////console.log(DOM);
//
//var div = document.createElement('div');
//div.innerHTML = txt;
//var cardRows = div.querySelectorAll('.MKMTable tbody tr');
//    console.log(cardRows.length);
//    
//    
//    phantom.exit();