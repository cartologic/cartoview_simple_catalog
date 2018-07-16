import 'rc-pagination/assets/index.css'

import React, { Component } from 'react'
import Tabs, { Tab } from 'material-ui/Tabs'

import Grid from 'material-ui/Grid'
import { Message } from 'Source/containers/CommonComponents'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import ResourceCard from 'Source/components/view/ResourceCard'
import SearchBar from 'Source/components/view/SearchBar'
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'
import ReactPaginate from 'react-paginate'

const styles = theme => ({
    root: {
        height: "100%",
        padding: theme.spacing.unit
    },
    tabPaper: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
    },
})
class ContentGrid extends Component {
    state = {
        value: 0,
        pageCount: 10,
        offset: 0,
    }

    handleChange = (event, value) => {
        this.setState({ value })
    }
    handlePageClick = (data) => {
        console.log(this.props);
        let selected = data.selected;
        const {childrenProps} = this.props;
        const pageCount = childrenProps.catalogResources[this.getTabValue()].length;
        if (childrenProps.config.perPgae === undefined)
        childrenProps.config.perPgae = 1;
        let offset = Math.ceil(selected * childrenProps.config.perPgae);
        
        this.setState({offset: offset, pageCount: pageCount}, () => {
            childrenProps.catalogResources[this.getTabValue()];
          });
    }
    getTabValue = () => {
        const { childrenProps } = this.props
        const { value } = this.state
        const keys = Object.keys(childrenProps.catalogResources)
        if( value in keys)
            return keys[value]
        return keys['0']
    }
    render() {
        console.log(this.props);
        const { classes, childrenProps } = this.props
        const keys = Object.keys(childrenProps.catalogResources)
        return (
            <div className={classes.root}>
                <Grid container alignItems={"center"}
                    justify={'center'} className={classes.root}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={0}
                            className={classes.root}
                            alignItems={"center"}
                            justify={'center'}
                        >
                            <Grid item xs={12}>
                                {childrenProps.config.search && <SearchBar searchValue={childrenProps.searchText} searchChanged={childrenProps.searchChanged} />}
                            </Grid>

                            <Grid item xs={12}>
                                {keys.length > 0 && <Paper className={classes.tabPaper}>
                                    <Tabs
                                        value={this.state.value}
                                        onChange={this.handleChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        centered
                                    >
                   
                                        {!childrenProps.resourcesLoading && keys.map((key, index) => {
                                            return <Tab key={index} label={key}/>
                                        })}
                                    </Tabs>
                                    
                                </Paper>}
                                <Grid
                                    container
                                    spacing={8}
                                    className={classes.root}
                                    alignItems={"center"}
                                    justify={'center'}
                                >
                                    {!childrenProps.resourcesLoading && keys.length > 0 && childrenProps.catalogResources[this.getTabValue()].map(resource => {

                                        return <Grid key={resource.id} item xs={12} sm={6} md={3} lg={3} xl={3} ><ResourceCard resource={resource} /></Grid>
                                    })}
                                    {!childrenProps.resourcesLoading && keys.length > 0&&childrenProps.catalogResources[this.getTabValue()].length>=1&&
                                    <ReactPaginate 
                                    previousLabel={"previous"}
                                    previousLinkClassName={"previousPage"}
                                    nextLabel={"next"}
                                    nextLinkClassName={"nextPage"}
                                    breakLabel={<a href="">...</a>}
                                    disabledClassName={"disablePage"}
                                    breakClassName={"break-me"}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"} />}
                                    </Grid>
                            </Grid>
                            {!childrenProps.resourcesLoading && keys.length == 0 && <Message message="No Resources" type="title" />}
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
