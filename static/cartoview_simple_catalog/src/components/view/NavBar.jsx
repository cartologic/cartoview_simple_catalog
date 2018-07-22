import AppBar from 'material-ui/AppBar'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import {withStyles} from 'material-ui/styles'
const styles = {
    root: {
        width: '100%'
    },
    flex: {
        flex: 0.5
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
}
const NavBar = (props) => {
    const {classes, title, abstract, logo} = props

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Avatar id="navBarAvatar" alt="Logo" src={logo}/>
                    <div style={{
                        marginLeft: '15px'
                    }}>
                        <h2 id="navBarTitle">
                            {title}
                        </h2>
                        {abstract !== "No abstract provided"
                            ? <p id="navBarSubtitle">
                                    {abstract}
                                </p>
                            : null}
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
export default withStyles(styles)(NavBar)
