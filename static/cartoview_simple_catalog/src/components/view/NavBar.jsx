import AppBar from 'material-ui/AppBar'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 0.5,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}
const NavBar = ( props ) => {
    const { classes, title, abstract, logo} = props
    console.log("NavBar: ", porps)

    return (
        <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <Typography type="title" color="inherit" className={classes.flex}>
          <h3>{title}</h3>
            {abstract !== "No abstract provided" 
          ?  <p> {abstract} </p>  : null}
          </Typography> */}
          <Avatar id="navBarAvatar" alt="Logo" src={logo} />

        <div style={{marginLeft: '5px'}}>
        <h2 id="navBarTitle"> {title} </h2>
        {abstract !== "No abstract provided" ? <p id="navBarSubtitle"> {abstract} </p> : null}
        </div>
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
