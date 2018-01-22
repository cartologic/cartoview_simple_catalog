import React, { Component } from 'react'

import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import ArrowRight from 'material-ui-icons/KeyboardArrowRight'
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import { Loader } from 'Source/containers/CommonComponents'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import classnames from "classnames"
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        height: "100%"
    }
})
class ContentGrid extends Component {
    render() {
        const { classes, childrenProps } = this.props
        return (
            <div className={classes.root}>
                <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div ref={(mapDiv) => this.mapDiv = mapDiv} className="map-panel"></div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
ContentGrid.propTypes = {
    childrenProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.string,
}
export default compose(withStyles(styles), withWidth())(ContentGrid)
