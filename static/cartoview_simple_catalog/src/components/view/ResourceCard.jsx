import Card, { CardActions, CardContent } from 'material-ui/Card'

import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button'
import Img from 'react-image'
import { Loader } from 'Source/containers/CommonComponents'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    card: {
        width: '100%',
    },
    media: {
        height: 200,
        border: '1px #cccccc solid',
        width: 'calc(100% - 1px)'

    },
    badge: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        display: 'block'
    },
    badgeSpan: {
        height: 34,
        width: 34
    }
})
class ResourceCard extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes, resource } = this.props
        return (
            <Card className={classes.card}>
                <Badge classes={{ badge: classes.badgeSpan }} className={classes.badge} badgeContent={resource.type} color="primary">
                    <small></small>
                </Badge>
                <Img loader={<Loader />} className={classes.media} src={[
                    resource.thumbnail_url,
                    urls.noImage
                ]} />
                <CardContent>
                    <Typography noWrap={true} type="headline" component="h2">
                        {resource.title}
                    </Typography>
                    <Typography noWrap={true} component="p">
                        {resource.abstract === "" && "No abstract provided"}
                        {resource.abstract !== "" && resource.abstract}
                    </Typography>
                    <Typography color={'secondary'} noWrap={true} type="caption" component="h2">
                        {"Category: "}{resource.app ? resource.app.title : resource.type}
                    </Typography>
                    {/* <Chip label={resource.app ? resource.app.title: resource.type } /> */}
                </CardContent>
                <CardActions>
                    <Button component='a' href={resource.urls.details} dense color="primary">
                        {"details"}
                    </Button>
                    {resource.urls.view && <Button component='a' href={resource.urls.view} dense color="primary">
                        {"view"}
                    </Button>}
                </CardActions>
            </Card>
        )
    }
}
ResourceCard.propTypes = {
    classes: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired
}
export default withStyles(styles)(ResourceCard)
