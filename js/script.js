(function( $ ){

    $.fn.bounceClasses = function( _class, replace, callback ){
        var $target = $(this);
        if( !$target.hasClass( _class ) ){
            var tmp = _class;
            _class = replace;
            replace = tmp;
        }

        $target
            .removeClass( _class )
            .addClass( replace );

        //Run a callback
        if( callback !== undefined ){
            callback( $(this), replace, _class );
        }
    };


    $.fn.XtndAccordion = function(){
        //get all submenu elements
        var that = this;
        $accordion = this.find( '.submenu' );

        //Object MenuStatus
        var menuStatus = {
            "store" : function( $icon, currentClass, toggleClass ){
                $menu = $icon.parent( '.submenu' );
                if( typeof( Storage ) !== undefined ){
                    if( currentClass == 'minus' ){
                        localStorage.setItem( $menu.attr( 'id'), 'open');
                    } else {
                        localStorage.setItem( $menu.attr( 'id'), 'closed');
                    }
                }
            },
            "check" : function(){
                var $menuLink = $accordion;
                if( typeof( Storage ) !== undefined ){
                    $menuLink.each( function( counter, element ){
                        if( localStorage.getItem( $( element ).attr( 'id' ) ) !== null ){
                            var menuStatus = localStorage.getItem( $( element ).attr( 'id' ) );
                            if( menuStatus === 'open' ){
                                $( element ).children( '.icon' ).trigger( 'click' );
                            }
                        }
                    });
                }
            }
        };

        $.fn.closeSiblings = function ( callback ){
            $that = $( this );

            //Add not-close class to current menu, for query destinction
            $that
                .addClass( 'not-close')
                .parents( 'ul' )
                .addClass( 'not-close');

            //Choose the othe menus
            $otherMenus = $( that ).find( '.submenu + ul:not(.not-close)' );

            //Close every menu is open
            $otherMenus.each( function( counter, menu ){
                var $menu = $( menu ),
                    $icon = $menu.prev( '.submenu' ).children( '.icon');

                //if menu is open ( :visible ), close it
                if( $menu.is( ':visible') ){
                    $icon.bounceClasses( 'add', 'minus', menuStatus.store );
                    $menu.slideToggle( 300 );
                }

                //if there is a callback run it
                if( functionExists( callback ) ){
                    callback( $that, $menu, $icon);
                }

            });

            //Remove temporary class
            $that
                .removeClass( 'not-close')
                .parents( 'ul' )
                .removeClass( 'not-close');

        };


        //if there are submenu elements, attach the event listener
        if( $accordion && $accordion.length > 0){
            $accordion.children( '.icon' ).on( 'click', ToggleSubMenu );
            $accordion.children( '.submenu > a' ).on( 'click', ToggleSubMenu );
        }

        function ToggleSubMenu( evt ){
            var $submenu = $(this).parent( '.submenu' ).next( 'ul'),
                $target = $( this );

            if( $( this )[0].nodeName === 'A' ){
                $target = $( this ).parent( '.submenu' ).children( '.icon' );
            }
            $target.bounceClasses( 'add', 'minus', menuStatus.store );

            $submenu.closeSiblings();
            $submenu.slideToggle( 300 );
        }

        function functionExists( functionName){
            return ( functionName !== undefined ) && ( typeof( functionName ) === "function" );
        }

        menuStatus.check();
    };
})( jQuery );

;( function( $ ){
    //Run functions with the need of jquery support
    $( document ).ready(
        function(){
            $( '.accordion-menu' ).XtndAccordion();
        }
    );
})(jQuery);