class SimpleColorPicker {
    constructor( color ) {
        this.color = color;
    }
}

const initScPicker = function() {
    window.scPickers = [];

    let scInputs = document.querySelectorAll( '.sc-picker' );

    for( let i = 0, l = scInputs.length, scInput; i < l; i++ ) {

        scInput = scInputs[ i ];

        scInput.setAttribute( 'data-sc-picker-id', i );
        window.scPickers.push( new SimpleColorPicker( scInput.value ) );

        console.log( 'Simple Color Picker #' + ( i + 1 ) + ': ' + window.scPickers[ i ].color );
    }
}

initScPicker();