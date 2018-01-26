import PropTypes from 'prop-types'
import React from 'react'
import { catalogFormSchema } from 'Source/containers/forms'
import { getPropertyFromConfig } from 'Source/utils/utils'
import t from 'tcomb-form'
const Form = t.form.Form
export default class CatalogForm extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            value: this.getFormValue()
        }
    }
    shouldComponentUpdate( nextProps, nextState ) {
        const { errors } = this.props
        if ( nextProps.errors !== errors ) {
            return false
        }
        return true
    }
    getComponentValue = () => {
        const value = this.form.getValue()
        return value
    }
    onChange = ( newValue ) => {
        this.setState( { value: {...newValue,pagination:parseInt(newValue.pagination)} } )
    }
    getFormValue = () => {
        const { config } = this.props
        const value = {
            pagination: getPropertyFromConfig( config,
                'pagination', 10 ),
            sortBy: getPropertyFromConfig( config, 'sortBy',
                'type' ),
            search: getPropertyFromConfig( config, 'search', false ),
        }
        return value
    }
    getFormOptions = () => {
        const options = {
            fields: {
                pagination: {
                    factory: t.form.Select,
                    nullOption: { value: null, text: 'Choose Number of resources per Page' },
                    options: [
                        { value: 10, text: "10" },
                        { value: 20, text: "20" },
                        { value: 40, text: "40" },
                        { value: 80, text: "80" }
                    ]
                },
                sortBy: {
                    factory: t.form.Select,
                    nullOption: { value: null, text: 'Sort Resources By' },
                    options: [
                        { value: 'owner', text: "Owner" },
                        { value: 'featured', text: "Featured" },
                        { value: 'type', text: "Type" }
                    ]
                }
            }
        }
        return options
    }
    render() {
        return (
            <div>
                <h3>{"Catalog Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    onChange={this.onChange}
                    type={catalogFormSchema()}
                    options={this.getFormOptions()} />
            </div>
        )
    }
}
CatalogForm.propTypes = {
    config: PropTypes.object,
    errors: PropTypes.array.isRequired,
}
