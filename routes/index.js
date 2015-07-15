

var fs = require('fs');
var request = require('request');

function requestZooplaData(req,callback){

    var zooplaAPI = 'http://api.zoopla.co.uk/api/v1/property_listings.js?'
    + 'listing_status=sale'
    + '&postcode='+req.param('postcode')
    + '&area='+req.param('area')
    + '&minimum_price=' + req.param('minPrice')
    + '&maximum_price=' + req.param('maxPrice')
    + '&minimum_beds=' + req.param('minRoom')
    + '&maximum_beds=' + req.param('maxRoom')
    + '&page_number=1'
    + '&order_by=price'
    + '&ordering=ascending'
    + '&page_size=100'
    + '&api_key=szrt2hqcqphfny7jm484u5re';

    request(zooplaAPI,function(error,response,body){
        if(!error && response.statusCode == 200){
            callback(body);
        }
    });
}

exports.getData = function(req,res){
    requestZooplaData(req,function(data){
        res.send(data);
        res.end();
    });
};
exports.getDetails = function(req,res){
    request(req.param('url'), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
            res.end();
        }
    });


};

