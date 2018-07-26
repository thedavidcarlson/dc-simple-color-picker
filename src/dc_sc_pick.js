class SimpleColorPicker {
    constructor( color ) {
        this.color = color;
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
}

const initScPicker = function() {
    let scInput = document.querySelector( '.sc-picker' );

    window.scPicker = new SimpleColorPicker( scInput.value );
}

const initScPickers = function() {
    window.scPickers = [];

    let scInputs = document.querySelectorAll( '.sc-picker' );

    for( let i = 0, l = scInputs.length, scInput; i < l; i++ ) {

        scInput = scInputs[ i ];

        scInput.setAttribute( 'data-sc-picker-id', i );
        window.scPickers.push( new SimpleColorPicker( scInput.value ) );

    }
}