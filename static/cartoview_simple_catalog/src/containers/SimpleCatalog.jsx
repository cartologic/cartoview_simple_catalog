import 'Source/css/view.css'
import 'typeface-roboto'

import React, { Component } from 'react'

import PropTypes from 'prop-types'
import SimpleCatalog from 'Source/components/view/SimpleCatalog'
import { render } from 'react-dom'

class SimpleCatalogContainer extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            
        }
    }   
    render() {
        const { config, urls } = this.props
        let childrenProps = {
            config,
            ...this.state,
        }
        return <SimpleCatalog childrenProps={childrenProps} />
    }
}
SimpleCatalogContainer.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
global.SimpleCatalogContainer = {
    show: ( el, props, urls ) => {
        render( <SimpleCatalogContainer urls={urls} config={props} />,
            document.getElementById( el ) )
    }
}
