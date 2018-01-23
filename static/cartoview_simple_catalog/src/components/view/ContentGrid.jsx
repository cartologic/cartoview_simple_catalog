import React, { Component } from 'react'

import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import ResourceCard from 'Source/components/view/ResourceCard'
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        height: "100%",
        padding: theme.spacing.unit * 2,
    }
})
class ContentGrid extends Component {
    render() {
        const { classes, childrenProps } = this.props
        return (
            <div className={classes.root}>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={16}
                            className={classes.root}
                            alignItems={"center"}
                            justify={'center'}
                        >
                            {!childrenProps.resourcesLoading && childrenProps.resources.map(resource => {
                                return <Grid key={resource.id} item xs={12} sm={6} md={3} lg={3} xl={3} ><ResourceCard resource={resource} /></Grid>
                            })}
                        </Grid>
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
