    /**
     * Calculate constructor function to hold all cached elements
     */
     var Calculate = function(obj){
        //Cache all form elements
        this.budget = obj.budget;
        this.minPrice = obj.minPrice;
        this.byToLetForm = '#byToLetForm';
        this.depositPercent = obj.depositPercent;
        this.depositPounds = obj.depositPounds;
        this.interest = obj.annualInterestRate;
        this.btn = '#calculate';
        this.mortgageTerm = obj.mortgageTerm;
        this.results = '.results';
        this.sum = null;
        this.formData = obj;
    };
    /**
     * Grab the value of the By To Let Form
     * @return {[Object]}
     */
     Calculate.prototype.getValue = function( price ){

        return {
            depositPercent :parseInt(this.depositPercent,10),
            depositPounds : parseInt(this.depositPounds,10),
            interest : this.interest/100,
            value : parseInt(price,10),
            term : this.mortgageTerm
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

        var percentageOfEarnings = _pay / this.budget * 100;
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

        price = parseInt(price,10);

        console.log(typeof price);
        //reassign this for scope
        var _this = this,  _formObj;

       
        // Create object with form values;
        _formObj = _this.getValue( price );
        var str = $(_this.byToLetForm).serialize();
        //Append results to DOM element
        return _this.calculated(_formObj);
    };


    //var calc = new Calculate();



