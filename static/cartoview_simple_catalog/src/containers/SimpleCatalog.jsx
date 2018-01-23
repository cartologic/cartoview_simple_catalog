import 'Source/css/view.css'
import 'typeface-roboto'

import React, { Component } from 'react'

import PropTypes from 'prop-types'
import SimpleCatalog from 'Source/components/view/SimpleCatalog'
import URLS from 'Source/utils/URL'
import { doGet } from 'Source/utils/utils'
import { render } from 'react-dom'

class SimpleCatalogContainer extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            resources: [],
            resourcesLoading: true,
        }
        this.urls = this.props.urls
        this.URLS = new URLS( this.urls.proxy, this.resourcesAPI )
    }
    componentWillMount = () => {
        this.getResources()
    }
    getResources = () => {
        const { config } = this.props
        const url =
            `${this.urls.resourcesAPI}?id__in=${config.resources.join(',')}`
        doGet( url ).then(result=>{
            this.setState({resources:result.objects,resourcesLoading:false})
        })
    }
    render() {
        const { config } = this.props
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
