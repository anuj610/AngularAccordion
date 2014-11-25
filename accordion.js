angular.module('accordion', [
    
])
.controller('MainCtrl', function(){
    
})
.directive('dirAccordion', function($timeout){
    return {
        scope: {
            activeHeadClass:'@accHeadClass',
            arrowUpClass:'@accArrowUp',
            arrowDownClass:'@accArrowDown'
        },
        restrict: 'A',
        replace: false,
        link: function(scope, elem, attrs) {

            //firing timeout so that directive executes after dom is ready
            $timeout(function() {
            
            var height_arr = new Array();
            var acc_dropdown_temp = elem.children();
            var acc_dropdown = new Array();
            
            //for( prop in acc_dropdown_temp )
            for ( var i=0; i<acc_dropdown_temp.length; i++ ) {
                if( angular.element(acc_dropdown_temp[i]).hasClass('acc-exclude') ) {
                    continue;
                }
                //this plugin assumes that the each accordion element will have 2 children, one containing the heading and the other the content.
                acc_dropdown.push( angular.element(acc_dropdown_temp[i]).children()[0] );
                acc_dropdown.push( angular.element(acc_dropdown_temp[i]).children()[1] );
            }

            var move_unit = 15,
                move_timeout = 20;

            var init_accordion = function(){

                for( var i=1; i<acc_dropdown.length; i+=2 ) {
                    angular.element(acc_dropdown[i]).css('padding', '0px');
                    angular.element(acc_dropdown[i]).css('margin', '0px');
                    angular.element(acc_dropdown[i]).css('overflow', 'hidden');
                    angular.element(acc_dropdown[i]).attr('a_index', (i-1)/2);
                    height_arr.push(acc_dropdown[i].offsetHeight);
                    if( i > 1 ) {
                        angular.element(acc_dropdown[i]).css('height', '0px');
                        angular.element(acc_dropdown[i]).removeClass('acc-active');
                        if( !!scope.activeHeadClass )
                            angular.element(acc_dropdown[i-1]).removeClass(scope.activeHeadClass);
                        
                        if( !!scope.arrowUpClass && !!scope.arrowDownClass )
                            angular.element(acc_dropdown[i-1].getElementsByClassName('acc-arrow')[0]).removeClass(scope.arrowUpClass).addClass(scope.arrowDownClass);
                    }
                    else {
                        angular.element(acc_dropdown[i]).addClass('acc-active');
                        if( !!scope.activeHeadClass )
                            angular.element(acc_dropdown[i-1]).addClass(scope.activeHeadClass);
                        
                        if( !!scope.arrowUpClass && !!scope.arrowDownClass )
                            angular.element(acc_dropdown[i-1].getElementsByClassName('acc-arrow')[0]).removeClass(scope.arrowDownClass).addClass(scope.arrowUpClass);
                    }
                }
            }();

            var animateDown = function(elemObj, fromHeight, toHeight){
                if( fromHeight === toHeight ) {
                    elemObj.style.height = fromHeight+'px';
                    return false;
                }
                else {
                    var unit = ( (toHeight - fromHeight) < move_unit ) ? (toHeight - fromHeight) : move_unit;
                    elemObj.style.height = fromHeight+'px';
                    setTimeout(function(){
                        animateDown( elemObj, fromHeight + unit, toHeight );
                    }, move_timeout);
                }
                
                return true;
            };
            
            var animateUp = function(elemObj, height){
                if( height === 0 ) {
                    elemObj.style.height = height+'px';
                    return false;
                }
                else {
                    var unit = ( height < move_unit ) ? height : move_unit;
                    elemObj.style.height = height+'px';
                    setTimeout(function(){
                        animateUp( elemObj, height - unit );
                    }, move_timeout);
                }
                
                return true;
            };

            var showElement = function(newElem, oldElem){
                var new_elem_height = height_arr[angular.element(newElem).attr('a_index')];
                animateDown(newElem, newElem.offsetHeight, new_elem_height);
                animateUp(oldElem, oldElem.offsetHeight);
            };
            
            elem.children().on('click', function(){

                if( angular.element(this).hasClass('acc-exclude') )
                    return;

                var new_elem = angular.element(this).children()[1],
                    new_elem_head = angular.element(this).children()[0],
                    old_elem = angular.element(this).parent()[0].getElementsByClassName('acc-active')[0],
                    old_elem_head = angular.element(old_elem).parent().children()[0];
                
                if( angular.element(new_elem).hasClass('acc-active') ) {
                    return;
                }
                
                if( !!scope.activeHeadClass ) {
                    angular.element(old_elem_head).removeClass(scope.activeHeadClass);
                    angular.element(new_elem_head).addClass(scope.activeHeadClass);
                }
                
                if( !!scope.arrowUpClass && !!scope.arrowDownClass ) {
                    angular.element(old_elem_head.getElementsByClassName('acc-arrow')[0]).removeClass(scope.arrowUpClass).addClass(scope.arrowDownClass);
                    angular.element(new_elem_head.getElementsByClassName('acc-arrow')[0]).removeClass(scope.arrowDownClass).addClass(scope.arrowUpClass);
                }
                
                angular.element(new_elem).addClass('acc-active');
                angular.element(old_elem).removeClass('acc-active');
                
                showElement(new_elem, old_elem);
            });
            
          }, 100);
        }
    };
});

