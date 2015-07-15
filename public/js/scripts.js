(function( $, window, undefined ){
    var App = App || {};

    //Model ------------>
    App.Model = Backbone.Model.extend({
        defaults: {
            items : ''
        }
    });

    //Collection ------------>
    App.Collection = Backbone.Collection.extend({
       url: "/display",

       model : new App.Model(),
       parse: function(response){
           return response.item;
       }
   });

    //View --------------->
    App.View = Backbone.View.extend({
        collection : new App.Collection(),
        utils : new Utils(),
        el: $('.container'),

        events : {
            'click .btn': 'addItem',
            'click .js-ajax-details': 'getDetails'
        },
        tempJSONArr : null,
        initialize : function(){
            var _this = this;
            this.collection.on('add', this.render, this);

            //Format the price adding '£' of any imput with the class'js-formatPrice'
            _this.utils.formatPrice();

            _this.utils.DisabledFieldChecker();
        },
        render: function(){
            var _this = this;
            //Get the collection
            var data = this.collection.toJSON();
            //Get instance of calculate
            var cal = new Calculate();
            var num;
            var mortgageVal = [];
            //Loop over each price and apply the calculate function
            _.each(data[0].listing,function(elem){
                //Grab the price from the zoopla object
                //and calculate the monthly replayments
                elem.repayments_deposit = cal.init(elem.price);
            });

            //Create a object
            var result = { _item : data[0].listing };

           // console.log(result._item);
            //Grab our template from the html and pass it our result
            var template = _.template( $("#template").html(), result );
            console.log(result);
            //append our template to our views container
            this.$el.find('#results-container').html( template );

            //Masony
            var container = document.querySelector('#results-container');
            var msnry = new Masonry( container, {
                // options
                "columnWidth": 60,
                itemSelector: '.item'
            });

            imagesLoaded( container, function() {
                msnry.layout();
            });
            $('html, body').animate({
                scrollTop: $("#results-container").offset().top
            }, 2000);
        },
        getDetails : function( e ){
            e.preventDefault();
            var zooplaURL = {
                url :$(e.target).parent().attr('href')
            };

            this.ajax('/details','text','get',zooplaURL,'sendZooplaUrlToNode');
        },

        ajax : function(url,dataType,type,data,task){
            var _this = this;
            if(task ==="buildApp"){
                _this.utils.ajaxLoader().show();
            }
            var modelItem;
            $.ajax({
                url: url,
                type: type,
                dataType: dataType,
                data: data,
                timeout: 20000,
                cache: false,
                success: function(data) {
                    switch(task){
                        case 'buildApp':
                        modelItem = new App.Model( data );
                        _this.collection.set(modelItem);
                        _this.utils.ajaxLoader().hide();
                        break;
                        case 'sendZooplaUrlToNode':
                        $('.details-content').html($(data).find('table.stripe')[2]);

                    }
                },
                error: function(e) {
                    console.log(e,' error');
                    _this.utils.ajaxLoader().hide();
                }
            });
        },
        addItem:function( e ){
            var _this = this;
            var submit = false;
            e.preventDefault();
            _this.utils.formatPrice($(".js-formatPrice"));
            var elem = $(e.target).parent().data('itemnumber');

            if(typeof $('#minPrice').data('value') ==='undefined'){
                $('#minPrice').data( "value", 0 );
            }

            if(_this.utils.validPostcode( $('#postcode').val())){
                submit = true;
            }

            var obj = {
                postcode : $('#postcode').val(),
                area : $('#area').val(),
                minPrice : $('#minPrice').data('value'),
                maxPrice : $('#maxPrice').data('value'),
                minRoom : $('#minRoom').val(),
                maxRoom : $('#maxRoom').val()
            };
            if(submit){
                this.ajax('/send','JSON','GET',obj,'buildApp');
            } else {
                console.log('error on form');
            }

        }
    });
$(document).ready(function(){
    var initApp = new App.View();


});
})(jQuery,window);


