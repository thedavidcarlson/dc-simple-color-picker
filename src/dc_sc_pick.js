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

        let color = el.getAttribute( 'data-sc-picker-color' );
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

        this.createMenu();

        this.scpInput.addEventListener( 'change', this.changeHandler.bind( this ) );
        this.scpColorSquare.addEventListener( 'click', this.squareClickHandler.bind( this ) );
    }
    setColor( color ) {
        this.color = color;
        this.scpInput.value = color;
        this.scpColorSquare.style.backgroundColor = this.color;
    }
    changeHandler( ev ) {
        let newVal = ev.target.value;

        //@TODO: Add actual validation
        if( newVal && ( newVal.length === 4 || newVal.length === 7 )  ) {
            this.color = newVal;
            this.scpColorSquare.style.backgroundColor = this.color;
        }
    }
    squareClickHandler( ev ) {
        if( this.scpColorMenu.classList.contains( 'sc-picker__color-menu--open' ) ) {
            this.scpColorMenu.classList.remove( 'sc-picker__color-menu--open' );
        } else {
            this.positionMenu();
            this.scpColorMenu.classList.add( 'sc-picker__color-menu--open' );
        }
    }
    menuItemClick( ev ) {
        let clickTarget = ev.target;

        if( clickTarget.classList.contains( 'sc-picker__color-menu-item' ) ) {
            let color = clickTarget.getAttribute( 'data-color' );
            this.setColor( color );
            this.scpColorMenu.classList.remove( 'sc-picker__color-menu--open' );
        }
    }
    createMenu() {
        let menuContent = `
            <div class="sc-picker__color-menu-items">
                <div class="sc-picker__color-menu-item" data-color="#ff0000" style="background-color:#ff0000"></div>
                <div class="sc-picker__color-menu-item" data-color="#00ff00" style="background-color:#00ff00"></div>
                <div class="sc-picker__color-menu-item" data-color="#0000ff" style="background-color:#0000ff"></div>
                <div class="sc-picker__color-menu-item" data-color="#ffff00" style="background-color:#ffff00"></div>
                <div class="sc-picker__color-menu-item" data-color="#00ffff" style="background-color:#00ffff"></div>
                <div class="sc-picker__color-menu-item" data-color="#ccc" style="background-color:#ccc"></div>
            </div>
        `;

        this.scpColorMenu = document.createElement( 'div' );

        this.scpColorMenu.classList.add( 'sc-picker__color-menu' );

        this.scpColorMenu.innerHTML  =menuContent;

        document.body.appendChild( this.scpColorMenu );

        this.scpColorMenu.querySelector( '.sc-picker__color-menu-items' ).addEventListener( 'click', this.menuItemClick.bind( this ) );
    }
    positionMenu() {
        let inputPos = this.scpInput.getBoundingClientRect();

        // Input left position + input width - left shift of menu ( width of square + 2 * square right pos )
        this.scpColorMenu.style.left = ( inputPos.left + inputPos.width - 25 ) + 'px';
        this.scpColorMenu.style.top = inputPos.top + 'px';

    }
    hexToRgb( hex ) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace( shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        } );

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? {
            r: parseInt( result[ 1 ], 16 ),
            g: parseInt( result[ 2 ], 16 ),
            b: parseInt( result[ 3 ], 16 )
        } : null;
    }
    rgbToHsl( r, g, b ) {
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max( r, g, b ), 
            min = Math.min( r, g, b ),
            l = ( max + min ) / 2,
            h, s;

        // Achromatic
        if ( max === min ) {
            h = s = 0; 
        } else {
            let d = max - min;

            s = ( l > 0.5 ) ? ( d / ( 2 - max - min ) ) : ( d / ( max + min ) );

            switch ( max ) {
                case r:
                    h = ( g - b ) / d + ( g < b ? 6 : 0 );
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {
            h: h,
            s: s,
            l: l
        };
    }
    hslToRgb( h, s, l ) {
        let r, g, b;

        // Achromatic
        if ( s == 0 ) {
            r = g = b = l; 
        } else {

            let q = ( l < 0.5 ) ? ( l * ( 1 + s ) ) : ( l + s - l * s ),
                p = 2 * l - q;

            r = this.hueToRgb( p, q, h + 1/3 );
            g = this.hueToRgb( p, q, h );
            b = this.hueToRgb( p, q, h - 1/3 );
        }

        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    }
    hueToRgb( p, q, t ) {
        if ( t < 0 ) {
            t += 1;
        } else if ( t > 1 ) {
            t -= 1;
        }

        if ( t < 1/6 ) {
            return p + ( q - p ) * 6 * t;
        } else if ( t < 1 / 2 ) {
            return q;
        } else if ( t < 2 / 3 ) {
            return p + ( q - p ) * ( 2 / 3 - t ) * 6;
        } 
        
        return p;
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