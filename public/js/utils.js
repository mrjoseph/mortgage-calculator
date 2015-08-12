var Utils = function(){};

/**
 * Formats the price adding in '£'
 * @param  Array | arr | A jquery array of all the inputs with the class '.js-formatPrice'
 * @return {[object]}     [description]
 */
 Utils.prototype.formatPrice = function(arr){
    var _num;
    var $priceField = $( ".js-formatPrice" );
    var i;

    var _formatField = function(_this){
        var valu;
        if(_this.val().length){
            //reformat the number
            valu = _this.val().replace(/£/g,'').replace(/,/g,'');

            //save the value to a data object
            _this.data('value',valu);

            //format the value adding ',' and '£'
            valu = parseInt(valu,10).toLocaleString();
            _this.val('£'+ valu);
        }
    };

    //Loop over all the fields that need to be formatted.
    if(arr){
        for(i=0;i<arr.length;i++){
            _formatField($(arr[i]));
        }
    }

    //Make sure the user doesn't put in letters where you actually want numbers
    $priceField.on('keydown',function(e){
    // Allow only backspace and delete and tab
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                 // Allow: Ctrl+A
                 (e.keyCode == 65 && e.ctrlKey === true) ||
                 // Allow: home, end, left, right, down, up
                 (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                 return;
             }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

    //Once you have left the input field format the number adding '£'
    $priceField.on('blur',function(){
     _formatField($(this));
 });

    return {
        formatField: _formatField
    };
};

/**
 * When performing the ajax to the node server show and hide the overlay
 */

 Utils.prototype.ajaxLoader = function(){
    var $overlay = $('.ajax-loader');
    var $searchArea = $('.searchArea');
    var $area;
    var $postcode = $('#postcode').val();
    /**
     * Show the overlay. This function runs when performing a ajax
     */
     var show = function(){
        var _windowHeight = $(window).height();
        $overlay.css('height', _windowHeight);
        $overlay.css('display', 'block');
        populateSearchArea();
    };
    /**
     * Hides the overlay
     */
     var hide = function(){
        $overlay.removeAttr("style");
    };

    var populateSearchArea = function(){
        var $area = $('#area').val();
        if($area !== ''){
            $searchArea.html($area);
        } else {
            $searchArea.html($postcode);
        }
    };
    return{
        show:show,
        hide:hide
    };
};
/**
 * [DisabledFieldChecker description]
 */
 Utils.prototype.DisabledFieldChecker = function(){
    var _input = $('.js-isEmpty input');

    var _checkWhichIsEmptyAndDisable = function(element){

        var arr = $(element).parent().parent().find('input');
        var i;
        for(i=0;i<arr.length;i++){

            if(arr[i].value.length >= 1){
                arr[i].disabled = false;
            } else {
                arr[i].disabled = true;
            }
            if (arr[0].value.length === 0 && arr[1].value.length === 0 ){
                arr[i].disabled = false;
            }
        }
    };
    _input.on('keyup',function(e){
        _checkWhichIsEmptyAndDisable(this);
    });
    _input.on('blur',function(e){
        _checkWhichIsEmptyAndDisable(this);
    });
};

/**
 * Validate postcode
 * @param  {[sting]} postcode postcode passed from input fiels
 * @return {[boolean]}   return true or false
 */
 Utils.prototype.validPostcode = function(postcode) {
    var fullPostcode = /^[a-z]{2}\d{1,2}\s*\d[a-z]{2}$/i;
    var halfPostcode = /^[a-z]{2}\d{1,2}/i;
    if(halfPostcode){
        return true;
    } else {
        return false;
    }
};

Utils.prototype.init = function(){

};

