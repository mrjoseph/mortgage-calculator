    /**
     * Calculate constructor function to hold all cached elements
     */
     var Calculate = function(){
        // Cache all form elements
        this.budget = '#budget';
        this.minPrice = '#minPrice';
        this.byToLetForm = '#byToLetForm';
        this.depositPercent = '#depositPercent';
        this.depositPounds = '#depositPounds';
        this.interest = '#annualInterestRate';
        this.btn = '#calculate';
        this.mortgageTerm = '#mortgageTerm';
        this.results = '.results';
        this.sum = null;
    };
    /**
     * Grab the value of the By To Let Form
     * @return {[Object]}
     */
     Calculate.prototype.getValue = function( price ){

        return{
            depositPercent :parseInt($(this.depositPercent).val(),10),
            depositPounds : parseInt($(this.depositPounds).data('value'),10),
            interest : $(this.interest).val()/100,
            value : parseInt(price,10),
            term : $(this.mortgageTerm).val()
        };
    };
    /**
     * Calculate the percentage if the user has filled in the (%)
     * part of the form else just use the (£)
     * @param  object, formObject Object {depositPercent: NaN, depositPounds: 60000, interest: 0.05, value: 389950, term: "25"}
     * @return string, the calculated (%)
     */
     Calculate.prototype.calculatePercentage = function( formObject ){
        var _percent;
        if(isNaN(formObject.depositPercent)){
            _percent = formObject.depositPounds;
        } else {
            _percent = formObject.value / 100 * formObject.depositPercent;
        }
        return _percent;
    };

    /**
     * Calculate the monthly repayments
     * @param  {[type]} obj
     * @return {[type]}
     */
     Calculate.prototype.calculated = function( formObject ){

        var _percentage = this.calculatePercentage(formObject);

        //Morgtgage after deposit deducted
        var _value = formObject.value - _percentage;
        var _interest = formObject.interest / 12;
        var _term  = formObject.term * 12;
        var _pay = Math.floor((_value * _interest) / (1 - Math.pow(1 + _interest, -_term)));

        var percentageOfEarnings = _pay / $(this.budget).data('value') * 100;
        return {
            repayments:_pay,
            budget: percentageOfEarnings,
            depositPercent:this.calculatePercentage(formObject)
        };
    };
    /**
     * Initalize function
     * @return {[type]}
     */
     Calculate.prototype.init = function( price ){
        //reassign this for scope
        var _this = this,
        // cache form object
        _formObj;
        // Create object with form values;
        _formObj = _this.getValue( price );
        var str = $(_this.byToLetForm).serialize();
        //Append results to DOM element
        return _this.calculated(_formObj);
    };


    var calc = new Calculate();



