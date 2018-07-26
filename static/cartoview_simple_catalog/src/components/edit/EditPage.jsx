import InfoModal from './InfoModal'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

// declare 'ActionBar' Component to be used here.
const ActionBar = (props) => {
    const { save, selectedMaps, instanceId, urls, saving, validate } = props
    const extraProps = {
        disabled: selectedMaps.length>0 && !saving ? false : true
    }
    return (
        <div className="action-bar">
            <div className="grow"></div>
            <div>
                {saving && <i className="fa fa-circle-o-notch fa-spin fa-lg fa-fw"></i>}
            </div>
            <p>
                <button onClick={save} className="btn btn-primary btn-sm pull-right" {...extraProps}>{"Save"}</button>
            </p>
            <p>
                {instanceId && <a href={urls.viewURL(instanceId)} className="btn btn-sm btn-primary pull-right">{"View"}</a>}
            </p>
        </div>
    )
}
ActionBar.propTypes = {
    save: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    selectedMaps: PropTypes.array.isRequired,
    instanceId: PropTypes.number,
    saving: PropTypes.bool.isRequired,
    urls: PropTypes.object.isRequired
}


// declare 'Tabs' component to be used here.
const Tabs = (props) => {
    const {
        childrenProps,
        getTabClassName,
        checkIfDisabled,
        getContentClassName
    } = props
    return (
        <div>
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <ul className="list-group">
                    {childrenProps.steps.map((step, index) => {
                        return (
                            <li key={index} className={getTabClassName(index)}>
                                <a className="list-link" data-toggle={checkIfDisabled(index) ? "" : "tab"} href={checkIfDisabled(step) ? "#" : `#component-${index}`}>
                                    {step.title}
                                </a>
                                {step.hasError && <i className="fa fa-exclamation-triangle text-danger pull-right" aria-hidden="true"></i>}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                <div className="tab-content">
                    {childrenProps.steps.map((step, index) => {
                        return (
                            <div key={index} id={`component-${index}`} className={getContentClassName(index)}>
                                <step.component errors={childrenProps.errors} ref={ComponentRef => childrenProps.setStepRef(step.ref, ComponentRef)} urls={childrenProps.urls} {...step.props} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
Tabs.propTypes = {
    childrenProps: PropTypes.object.isRequired,
    getTabClassName: PropTypes.func.isRequired,
    checkIfDisabled: PropTypes.func.isRequired,
    getContentClassName: PropTypes.func.isRequired,
}

// declare 'AppBar' component to be used here.
const AppBar = (props) => {
    const { handleHideModal } = props
    return (
        <div className="row">
            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                <h1>{"Simple Catalog"}</h1>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
                <h1>
                    <button onClick={handleHideModal} className="btn btn-primary">
                        <i className="fa fa-question-circle fa-lg" aria-hidden="true"></i>
                    </button>
                </h1>
            </div>
        </div>
    )
}
AppBar.propTypes = {
    handleHideModal: PropTypes.func.isRequired
}

/* 
Here the view for EditPage will be renders and for functionality on 'src/containers/EditPage.jsx'
EditPage.jsx will be used in case of (new/edit) app instances 
*/
export default class EditPageComponent extends React.Component {
    state = {
        showModal: false
    }
    checkIfDisabled = (index) => {
        return false
    }
    getTabClassName = (index) => {
        return classNames({
            disabled: this.checkIfDisabled(index),
            active: index === 0,
            "list-group-item": true
        })
    }
    // this function will be called-back from 'InfoModal.jsx'
    handleHideModal = () => {
        const { showModal } = this.state
        this.setState({ showModal: !showModal })
    }
    getContentClassName = (index) => {
        return classNames({
            "active": index === 0,
            "tab-pane fade in": true
        })
    }
    render() {
        /*
        chiledernProps come from 'src/containers/EditPage.jsx' 
        prepared by 'getChildrenProps()' function, where we can see what's 'childernProps' is!
        */
        const { childrenProps } = this.props
        let { showModal } = this.state
        return (
            <div>
                {/* 'AppBar' sends props = {handleHideModal} */}
                <AppBar handleHideModal={this.handleHideModal} />
                <hr />
                {/* 'ActionBar' sends props = {validate, saving, urls, save, selectedMaps, instanceId} */}
                <ActionBar validate={childrenProps.validate} saving={childrenProps.saving} urls={childrenProps.urls} save={childrenProps.save} selectedMaps={childrenProps.selectedMaps} instanceId={childrenProps.instanceId} />
                <hr />
                <div className="row content">
                {/* 'Tabs' sends props = {childrenProps, checkIfDisabled, getContentClassName, getTabClassName} */}
                    <Tabs childrenProps={childrenProps} checkIfDisabled={this.checkIfDisabled} getContentClassName={this.getContentClassName} getTabClassName={this.getTabClassName} />
                </div>
                {/* render InfoModal from 'src/components/edit/InfoModal.jsx' */}
                {showModal && <InfoModal handleHideModal={this.handleHideModal} />}
            </div>
        )
    }
}
EditPageComponent.propTypes = {
    childrenProps: PropTypes.object.isRequired
}
