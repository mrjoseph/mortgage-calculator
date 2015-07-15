(function( $ ){
    //var todoApp = todoApp || {};

//     todoApp.Model = Backbone.Model.extend({
//         defaults : {
//             item : ''
//         }
//     });

// todoApp.Collection = Backbone.Collection.extend({
//    url: "/display",
//     model : new todoApp.Model(),
//     parse: function(response){
//        return response.item;
//     }

// });

//     todoApp.View = Backbone.View.extend({
//         collection : new todoApp.Collection(),
//         el: $('.container'),

//         events : {
//             'click .btn': 'addItem',
//             'click .remove': 'remove',
//             'blur .edit' : 'edit',
//             'click .status' : 'markAsDone',
//             'click .status-undo' : 'markAsUndo'
//         },
//         tempJSONArr : null,
//         initialize : function(){
//             var _this = this;

//             this.collection.on('add', this.render, this);
//             this.collection.on('remove', this.render, this);
//             this.collection.on('edit',this.render,this);

//             //receive data from Node server
//             //and loop through data creating
//             //a model of each one and add it the
//             //the collection

//             this.getData();
//         },
//         render: function(){
//             //Get the collection

//             var data = this.collection.toJSON();

//             //Create a object
//             var result = { _item : data };
//             //Grab our template from the html and pass it our result
//             var template = _.template( $("#template").html(), result );

//             //append our template to our views container
//             this.$el.find('#todoList-container').html( template );

//         },
//         historyUpdate : function(obj){
//             this.collection.set( obj );
//         },
//         updateCollection : function(obj,callback){
//             this.collection.add( obj );

//             if(callback){
//                 callback();
//             }
//         },
//         addItem : function( e ){
//             e.preventDefault();
//             var _this = this;
//             var formField = $('.form-control');
//             var formVal = formField.val();
//             var obj = {
//                 item : formVal,
//                 status:true
//             };
//             if(formVal != ''){
//                 var modelItem = new todoApp.Model( obj );
//                 this.updateCollection( modelItem,function(){
//                     formField.val('');
//                     _this.sendData( {list : _this.collection.toJSON() });
//                     console.log( _this.collection.toJSON() );
//                 });
//             }
//         },
//         remove:function( e ){
//             var elem = $(e.target).parent().data('itemnumber');
//             this.collection.remove(this.collection.models[elem]);
//             this.sendData( {list : this.collection.toJSON() });
//         },
//         edit:function( e ){
//             var itemNo = $(e.target).parent().data('itemnumber');
//             var text = $(e.target).text();
//             this.collection.models[itemNo].set( { item : text,status:true } );
//             this.sendData({list : this.collection.toJSON() });
//         },
//         compareData: function(newObj,currentObj){
//            // console.log(newObj.list);
//            // console.log(currentObj);
//            var varify = [];
//             newObj.list.forEach(function(item){
//                 currentObj.forEach(function(i){
//                     if(item === i){
//                         varify.push(true);
//                     } else {
//                         varify.push(false);
//                     }
//                 });
//             });
//             console.log(varify);
//         },
//         sendData: function(obj){
//             this.compareData(obj,this.collection.toJSON());
//              var _this = this;
//             $.ajax({
//                 url: "/save",
//                 type: "post",
//                 data: obj,
//                 success :function(data){
//                     todoApp.View.tempJSONArr = data.todo;
//                     history.pushState(_this.collection.toJSON(), document.title, document.location.href);
//                 }
//             });
//         },
//         markAsDone: function( e ){
//             $(e.target).parent().addClass('done');
//             $(e.target).text('undo');
//             $(e.target).removeClass('status').addClass('status-undo');
//         },
//         markAsUndo: function( e ){
//             $(e.target).parent().removeClass('done');
//             $(e.target).text('Done');
//             $(e.target).removeClass('status-undo').addClass('status');
//         },
//         getData : function(){
//             var _this = this;
//             $.ajax({
//                 url: '/display',
//                 type: 'GET',
//                 dataType: "JSON",
//                 timeout: 20000,
//                 cache: false,
//                 success: function(data) {
//                     todoApp.View.tempJSONArr = data;
//                     var modelItem;
//                     var arr = [];
//              _.each(data,function(obj){
//                  modelItem = new todoApp.Model( { item : obj.item } );
//                  arr.push(modelItem);
//                 });
//                  _this.updateCollection(arr,function(){
//                     history.replaceState(_this.collection.toJSON(), document.title, document.location.href);
//                  });
//                 },
//                 error: function(e) {
//                     console.log(e,' error');
//                 }
//             });
//         },
//     });

//     $(document).ready(function(){
//         var runApp = new todoApp.View();

//         window.addEventListener("popstate", function (evt) {
//             if (evt.state){
//               //  console.log(history.state);
//                 var modelItem;
//                 var arr = [];
//                 _.each(history.state,function(obj){
//                  modelItem = new todoApp.Model( { item : obj.item } );
//                  arr.push(modelItem);
//                 });
//              runApp.historyUpdate(arr);
//             }
//         });
//     });



})(jQuery);


