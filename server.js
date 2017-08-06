const express = require('express');
const app = express();
const cheerio = require('cheerio');
const request = require('request');

//serve the files on local server
app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 3000);


//API route

app.get('/wikiroute', function(req, res){

let count = 0; //number of loops

let visitedLinks = []; //array of links we went to

let obj = {}; //our response object

var wiki = req.query.wiki;

getToPhilosophy(wiki);

//recursive function to call itself with a new url after each loop
function getToPhilosophy(url){

  request(url, function(err, resp, body) {
  	if (!err && resp.statusCode == 200) {

  		if(count === 100){
  			obj.success = false;
  			obj.loops = count;
  			obj.path = visitedLinks;
  			obj.failReason = 'After searching 100 links we decided to stop. Please enter another URL';
        res.send(obj);
  			return;

  		}

  	    let $ = cheerio.load(body);

  	    //to determine if we are on the philosophy page
  	    let title = $('title').text();

  	    let origUrl = url.replace("https://en.wikipedia.org/", "");

  	    if(title === 'Philosophy - Wikipedia'){
  	    	obj.success = true;
  	    	obj.loops = count;
  	    	obj.path = visitedLinks;
  	    	obj.failReason = null;
          res.send(obj);
    			return;

  	    }

  	  	let text = $('#mw-content-text p');


  	  	$(text).find('a').each(function() {

  		    let link = ($(this).attr('href'));


  		    //ingore citations, helper articles etc.
  		    if(link !== origUrl && link.indexOf('#cite') < 0 && link.indexOf('Help') < 0 && link.indexOf('wiktionary') < 0){

  		    	//text surrounding the link -- we will use this to determine
  		    	//if our link is in parens
  				let text = $(this).parent().text();

  				//text in anchor tags
  				let linkText = $(this).text();

  				//make sure we don't visit the same link twice
  				//and get caught up in an endless loop !!!
  				if(visitedLinks.indexOf(linkText) > -1){
  					console.log('double visit');
  					obj.success = false;
  					obj.loops = count;
  					obj.path = visitedLinks;
  					obj.failReason = 'This path led us down an endless loop. Oops!';
            res.send(obj);
      			return false;
  				}

  				//check if link is in this text in parens
  				var hasParens = new RegExp("\\((.*?" + linkText + ".*?)\\)");

  				//go to next link if this one is in parens
  				if(text.match(hasParens) || linkText.indexOf('[') > -1){
  					return
  				}

  		    	console.log("LINK: " + link)

  		    	count++;
  		    	visitedLinks.push(linkText);

  		    	getToPhilosophy("https://en.wikipedia.org" + link);
  		    	return false;

  		    }

  		});
  	    }else{
  	    	obj.success = false;
  	    	obj.loops = 0;
  	    	obj.path = null;
  	    	obj.failReason = "Hey, that's not a valid wiki URL. Try https://en.wikipedia.org/wiki/Plato";
          res.send(obj);
    			return;
  	    }
  	});
  }

});
