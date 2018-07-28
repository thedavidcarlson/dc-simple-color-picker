class SimpleColorPicker {
    constructor( el, id ) {
        this.el = el;
        this.color = ( el.tagName === 'INPUT' && el.type === 'text' ) ? el.value: '#ffffff';
        this.id = id;

        el.addEventListener( 'change', this.changeListener );
    }
    hexToRgb( hex ) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace( shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        } );

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? {
            r: parseInt( result[ 1 ], 16 ),
            g: parseInt( result[ 2 ], 16 ),
            b: parseInt( result[ 3 ], 16 )
        } : null;
    }
    setColor( color ) {
        this.color = color;

        if( this.el.tagName === 'INPUT' && this.el.type === 'text' ) {
            this.el.value = color;
        }
    }
    changeListener( ev ) {
        var newVal = ev.target.value;

        //@TODO: Add actual validation
        if( newVal && ( newVal.length === 4 || newVal.length === 7 )  ) {
            this.color = newVal;
            console.log( this.color );
        }
    }
}

const initScPicker = function() {
    let scInput = document.querySelector( '.sc-picker' );

    window.scPicker = new SimpleColorPicker( scInput, 0 );

    scInput.setAttribute( 'data-sc-picker-id', 0 );
}

const initScPickers = function() {
    window.scPickers = [];

    let scInputs = document.querySelectorAll( '.sc-picker' );

    for( let i = 0, l = scInputs.length, scInput; i < l; i++ ) {

        scInput = scInputs[ i ];

        scInput.setAttribute( 'data-sc-picker-id', i );

        window.scPickers.push( new SimpleColorPicker( scInput, i ) );

    }
}