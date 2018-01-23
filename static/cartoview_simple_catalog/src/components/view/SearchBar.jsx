import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
const styles = theme => ( {
    root:{
        marginTop: theme.spacing.unit * 2,
        display:'flex',
        width:'25%',
        [theme.breakpoints.down('sm')]: {
            width:'100%',
        },
        marginLeft:'auto',
        marginRight:'auto',
        paddingLeft: 'auto',
        paddingRight: 'auto'
    } ,
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:0
    },
} )
const SearchBar = ( props ) => {

    const { classes, searchChanged, searchValue } = props
    return (
        <Paper className={classes.root} elevation={4}>
            <TextField
                label="Search"
                className={classes.textField}
                value={searchValue}
                onChange={searchChanged}
                margin="dense"
                fullWidth={true}
            />
        </Paper>
    )
}
SearchBar.propTypes = {
    classes: PropTypes.object.isRequired,
    searchChanged: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired
}
export default withStyles( styles )( SearchBar )
