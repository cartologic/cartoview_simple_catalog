import React, { Component } from 'react'

import PropTypes from 'prop-types'


/*
  parent_component: 'src/components/EditPage.jsx'
  */
export default class InfoModal extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        /* 
        hidden.bs.modal: This event is fired when the modal has finished being hidden from the user
        
        Ex: 
        $('#myModal').on('hidden.bs.modal', function (e) {
        // do something...
        })
        */ 
        $(this.modal).modal('show')
        // 'handleHideModal' function passed to 'InfoModal' component on 'src/components/EditPage.jsx'
        $(this.modal).on('hidden.bs.modal', this.props.handleHideModal)
    }
    render() {
        return (
            <div ref={(modalRef) => this.modal = modalRef} className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{"Simple Catalog"}</h4>
                        </div>
                        <div className="modal-body">
                            <p>
                            {`Display a defined set of CartoView and GeoNode content items in a single, responsive and searchable web page`}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
// check for props type for validate and if it's required. 
InfoModal.propTypes = {
    handleHideModal: PropTypes.func.isRequired,
}
