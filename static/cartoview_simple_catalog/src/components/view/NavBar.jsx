import AppBar from 'material-ui/AppBar'
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
        flex: 0.5,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}
const NavBar = ( props ) => {
    const { classes, title, abstract} = props
    return (
        <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <Typography type="title" color="inherit" className={classes.flex}>
          <h3>{title}</h3>
            {abstract !== "No abstract provided" 
          ?  <p> {abstract} </p>  : null}
          </Typography> */}
        <div>
        <h2 style={{margin: '0px'}}> {title} </h2>
        {abstract !== "No abstract provided" ? <p style={{marginBottom: '5px', marginTop: '0px'}}> {abstract} </p> : null}
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
