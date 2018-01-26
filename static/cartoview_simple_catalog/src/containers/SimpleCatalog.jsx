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
        const { config, urls } = this.props
        this.state = {
            resources: [],
            resourcesLoading: true,
            searchText: '',
            currentPage: 1,
            perPage: config.pagination
        }
        this.urls = urls
        this.URLS = new URLS( this.urls.proxy, this.urls.resourcesAPI )
    }
    componentWillMount = () => {
        this.getResources()
    }
    applySearch = () => {
        let { searchText, resources } = this.state
        if ( searchText != '' ) {
            return resources.filter( resource => resource.title.includes(
                searchText ) || resource.abstract.includes(
                searchText ) )
        }
        return resources
    }
    searchChanged = ( event ) => {
        this.setState( { searchText: event.target.value } )
    }
    sortResources = ( a, b, filter ) => {
        if ( filter === 'featured' ) {
            return ( a[ filter ] === b[ filter ] ) ? 0 : a[ filter ] ? -1 :
                1;
        } else {
            return a[ filter ].localeCompare( b[ filter ] )
        }
    }
    getResources = () => {
        const { config } = this.props
        const url =
            `${this.urls.resourcesAPI}?id__in=${config.resources.join(',')}`
        doGet( url ).then( result => {
            const { config } = this.props
            const key = config.sortBy
            let resources = result.objects.sort( ( a, b ) => this.sortResources(
                a, b, key ) )
            this.setState( {
                resources,
                resourcesLoading: false
            } )
        } )
    }
    getCatalogResources = () => {
        const { config } = this.props
        const { currentPage, perPage, searchText } = this.state
        const indexOfLast = currentPage * perPage
        const indexOfFirst = indexOfLast - perPage
        let resources = this.applySearch()
        const total = resources.length
        if ( config.pagination < total && searchText === '' ) {
            resources = resources.slice( indexOfFirst, indexOfLast )
        }
        return { catalogResources: resources, totalResources: total }
    }
    onPageChange = ( page ) => {
        this.setState( {
            currentPage: page,
        } )
    }
    getChildrenProps = () => {
        const { config } = this.props
        return {
            config,
            ...this.state,
            ...this.getCatalogResources(),
            applySearch: this.applySearch,
            onPageChange: this.onPageChange,
            searchChanged: this.searchChanged
        }
    }
    render() {
        let childrenProps = this.getChildrenProps()
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
