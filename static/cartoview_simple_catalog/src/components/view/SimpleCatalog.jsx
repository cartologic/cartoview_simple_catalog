import React, { Component } from 'react'

import ContentGrid from 'Source/components/view/ContentGrid'
import { MuiThemeProvider } from 'material-ui/styles'
import NavBar from 'Source/components/view/NavBar.jsx'
import PropTypes from 'prop-types'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { theme } from 'Source/components/view/theme.jsx'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    root: {
        height: '100%'
    }
} )
injectTapEventPlugin()
class SimpleCatalog extends Component {
    render() {
        let { classes, childrenProps } = this.props
       {console.log(childrenProps)}
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <NavBar title={childrenProps.config.title} abstract={childrenProps.config.abstract}/>
                    <ContentGrid childrenProps={childrenProps} map={childrenProps.map} />
                </div>
            </MuiThemeProvider>
        )
    }
}
SimpleCatalog.propTypes = {
    classes: PropTypes.object.isRequired,
    childrenProps: PropTypes.object.isRequired,
}
export default withStyles( styles )( SimpleCatalog )
