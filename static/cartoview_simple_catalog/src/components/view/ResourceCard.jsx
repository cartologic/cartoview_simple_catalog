import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'

import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import { checkImageSrc } from 'Source/utils/utils'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    card: {
        width: '100%',
    },
    media: {
        height: 200,
    },
    badge: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        display:'block'
    },
    badgeSpan:{
        height:34,
        width:34
    }
} )
class ResourceCard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            thumbnail: this.props.resource.thumbnail_url
        }
    }
    componentWillMount() {
        let thumbnail = this.props.resource.thumbnail_url
        let that = this
        checkImageSrc( thumbnail, () => {}, () => that.setState( { thumbnail: urls
                .noImage } ) )
    }
    render() {
        const { classes, resource } = this.props
        return (
            <Card className={classes.card}>
                <Badge classes={{badge:classes.badgeSpan}} className={classes.badge} badgeContent={resource.type} color="primary">
                <small></small>
                </Badge>
                <CardMedia
                    className={classes.media}
                    image={this.state.thumbnail}
                    title={resource.title}
                />
                <CardContent>
                    <Typography noWrap={true} type="headline" component="h2">
                        {resource.title}
                    </Typography>
                    <Typography noWrap={true} component="p">
                        {resource.abstract}
                    </Typography>
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
export default withStyles( styles )( ResourceCard )
