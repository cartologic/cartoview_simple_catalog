import PropTypes from 'prop-types'
import React from 'react'
import { catalogFormSchema } from 'Source/containers/forms'
import { getPropertyFromConfig } from 'Source/utils/utils'
import t from 'tcomb-form'
const Form = t.form.Form
export default class CatalogForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.getFormValue()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { errors } = this.props
        if (nextProps.errors !== errors) {
            return false
        }
        return true
    }
    getComponentValue = () => {
        const value = this.form.getValue()
        return value
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    getFormValue = () => {
        const { config } = this.props
        const value = {
            pagination:getPropertyFromConfig(config,'pagination',false),
            grouping:getPropertyFromConfig(config,'grouping',false),
            search:getPropertyFromConfig(config,'search',false),
        }
        console.log(value)
        return value
    }
    render() {
        return (
            <div>
                <h3>{"Catalog Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    onChange={this.onChange}
                    type={catalogFormSchema()} />
            </div>
        )
    }
}
CatalogForm.propTypes = {
    config: PropTypes.object,
    errors: PropTypes.array.isRequired,
}