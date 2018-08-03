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
        var clickTarget = ev.target;

        if( clickTarget.classList.contains( 'sc-picker__color-menu-item' ) ) {
            var color = clickTarget.getAttribute( 'data-color' );
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
            </div>
        `;

        this.scpColorMenu = document.createElement( 'div' );

        this.scpColorMenu.classList.add( 'sc-picker__color-menu' );

        this.scpColorMenu.innerHTML = menuContent;

        document.body.appendChild( this.scpColorMenu );

        this.scpColorMenu.querySelector( '.sc-picker__color-menu-items' ).addEventListener( 'click', this.menuItemClick.bind( this ) );
    }
    positionMenu() {
        let inputPos = this.scpInput.getBoundingClientRect();

        // Input left position + input width - left shift of menu ( width of square + 2 * square right pos )
        this.scpColorMenu.style.left = ( inputPos.left + inputPos.width - 25 ) + 'px';
        this.scpColorMenu.style.top = inputPos.top + 'px';

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