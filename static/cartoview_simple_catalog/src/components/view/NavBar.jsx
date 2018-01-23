import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}
const NavBar = ( props ) => {
    const { classes, title } = props
    return (
        <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
    )
}
NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
}
export default withStyles( styles )( NavBar )
