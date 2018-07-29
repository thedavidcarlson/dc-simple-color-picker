class SimpleColorPicker {
    constructor( el ) {
        if( !window.scPickers ) {
            window.scPickers = [];
        }

        if( el.hasAttribute( 'data-sc-picker-id' ) ) {
            this.id = el.getAttribute( 'data-sc-picker-id' );
            window.scPickers.splice( this.id, 1, this );
        } else {
            this.id = window.scPickers.length;
            el.setAttribute( 'data-sc-picker-id', this.id );
            window.scPickers.push( this );
        }

        this.el = el;

        var color = el.getAttribute( 'data-sc-picker-color' );
        this.color = ( color ) ? color : '#ffffff';

        
        this.initEl();
    }
    initEl() {

        if( !this.el.classList.contains( 'sc-picker' ) ) {
            this.el.classList.add( 'sc-picker' );
        }

        this.el.innerHTML = '';

        this.scpInput = document.createElement( 'input' );

        this.scpInput.setAttribute( 'type', 'text' );
        this.scpInput.setAttribute( 'value', this.color );

        this.el.appendChild( this.scpInput );

        this.scpColorSquare = document.createElement( 'div' );

        this.scpColorSquare.classList.add( 'sc-picker__color-square' );

        this.scpColorSquare.style.backgroundColor = this.color;

        this.el.appendChild( this.scpColorSquare );

        this.scpInput.addEventListener( 'change', this.changeListener.bind( this ) );
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

        var input = this.el.querySelector( 'input' );

        if( input ) {
            input.value = color;
        }

        this.scpColorSquare.style.backgroundColor = this.color;
    }
    changeListener( ev ) {
        var newVal = ev.target.value;

        //@TODO: Add actual validation
        if( newVal && ( newVal.length === 4 || newVal.length === 7 )  ) {
            this.color = newVal;
            this.scpColorSquare.style.backgroundColor = this.color;
        }
    }
}

const initScPicker = function( scInput ) {
    return new SimpleColorPicker( scInput );
}

const initScPickers = function() {
    let scInputs = document.querySelectorAll( '.sc-picker:not([data-sc-picker-id])' );

    for( let i = 0, l = scInputs.length; i < l; i++ ) {
       new SimpleColorPicker( scInputs[ i ] );
    }

    return window.scPickers;
}