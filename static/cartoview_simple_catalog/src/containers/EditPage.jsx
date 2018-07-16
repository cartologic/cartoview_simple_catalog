import 'Source/css/app.css'
import 'react-select/dist/react-select.css'

import { doGet, doPost } from 'Source/utils/utils'

import AppAccess from 'Source/components/edit/Access'
import AppConfiguration from 'Source/components/edit/AppConfiguration'
import CatalogForm from 'Source/components/edit/CatalogForm'
import EditPageComponent from 'Source/components/edit/EditPage'
import MapSelector from 'Source/components/edit/MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import URL from 'Source/utils/URL'

const LIMIT = 9
class EditPage extends React.Component {
    constructor(props) {
        super(props)
        this.urls = new URL(this.props.urls.proxy, this.props.urls.resourcesAPI)
        const { config } = this.props
        this.state = {
            maps: [],
            userMaps: true,
            selectedMaps: config ? config.config.resources : [],
            loading: false,
            totalMaps: 0,
            title: config ? config.title : null,
            abstract: config ? config.abstract : null,
            thumbnail: config ? config.thumbnail : null,
            logo: config ? config.logo : null,
            config: config ? config.config : null,
            keywords: [],
            saving: false,
            errors: [],
            profiles: [],
            instanceId: config ? config.id : null,
            searchEnabled: false
        }
    }
    componentWillMount() {
        this.getMaps()
        this.getKeywords()
        this.getProfiles()
    }
    UserMapsChanged = () => {
        const { userMaps } = this.state
        this.setState({ userMaps: !userMaps }, this.getMaps)
    }
    getMaps = (offset = 0, limit = LIMIT) => {
        this.setState({ loading: true })
        const { username } = this.props
        const { userMaps } = this.state
        const url = this.urls.getMapApiURL(username, userMaps, limit,
            offset)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false,
                totalMaps: result.meta.total_count
            })
        })
    }
    searchMapById = (id) => {
        const { maps } = this.state
        let result = null
        for (let map of maps) {
            if (map.id === id) {
                result = map
                break
            }
        }
        return result
    }
    handleSearchMode = (bool) => {
        this.setState({ searchEnabled: bool })
    }
    search = (text) => {
        this.setState({ loading: true, searchEnabled: true })
        const { username } = this.props
        const { userMaps } = this.state
        const url = this.urls.getMapApiSearchURL(username, userMaps,
            text)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false
            })
        })
    }
    getKeywords = () => {
        this.setState({ loading: true })
        const { urls } = this.props
        const url = urls.keywordsAPI
        doGet(url).then(result => {
            this.setState({ keywords: result.objects, loading: false })
        })
    }
    getProfiles = () => {
        this.setState({ loading: true })
        const { urls } = this.props
        const url = urls.profilesAPI
        doGet(url).then(result => {
            this.setState({ profiles: result.objects, loading: false })
        })
    }
    setStepRef = (name, ref) => {
        this[name] = ref
    }
    removeFrom = (array, element) => {
        const index = array.indexOf(element)
        if (index > -1) {
            array.splice(index, 1)
        }
        return array
    }
    selectMap = (map) => {
        const { selectedMaps } = this.state
        let selected = [...selectedMaps]
        if (selected.includes(map.id)) {
            selected = this.removeFrom(selected, map.id)
        } else {
            selected.push(map.id)
        }
        this.setState({ selectedMaps: selected })
    }
    getSteps = () => {
        const {
            maps,
            loading,
            selectedMaps,
            userMaps,
            totalMaps,
            config,
            title,
            abstract,
            thumbnail,
            logo,
            keywords,
            instanceId,
            searchEnabled,
            profiles
        } = this.state
        const { urls } = this.props
        let steps = [
            {
                title: "Select Resources",
                component: MapSelector,
                ref: 'mapStep',
                hasErrors: false,
                props: {
                    maps,
                    selectedMaps,
                    loading,
                    selectMap: this.selectMap,
                    getMaps: this.getMaps,
                    userMaps,
                    totalMaps,
                    UserMapsChanged: this.UserMapsChanged,
                    limit: LIMIT,
                    urls,
                    search: this.search,
                    handleSearchMode: this.handleSearchMode,
                    searchEnabled
                }
            },
            {
                title: "Catalog Options",
                component: CatalogForm,
                ref: 'catalogOptionsStep',
                hasErrors: false,
                props: {
                    config,
                }
            },
            {
                title: "General",
                component: AppConfiguration,
                ref: 'generalStep',
                hasErrors: false,
                props: {
                    abstract,
                    title,
                    thumbnail,
                    logo,
                    selectedMaps,
                    config,
                    allKeywords: keywords,
                    instanceId
                }
            },
            {
                title: "Acccess Configuration",
                component: AppAccess,
                ref: 'accessConfigurationStep',
                hasErrors: false,
                props: {
                    loading,
                    config,
                    profiles,
                }
            }
        ]
        const { errors } = this.state
        errors.map(error => steps[error].hasError = true)
        return steps
    }
    toArray = (arrayOfStructs) => {
        let arr = []
        if (arrayOfStructs) {
            arrayOfStructs.forEach((struct) => {
                arr.push(struct.value)
            }, this)
        }
        return arr
    }
    prepareServerData = () => {
        const keywords = this.generalStep.getComponentValue().keywords
        const { selectedMaps } = this.state
        let finalConfiguration = {
            ...this.generalStep.getComponentValue(),
            config: {
                resources: selectedMaps,
                ...this.catalogOptionsStep.getComponentValue()
            },
            access: this.accessConfigurationStep.getComponentValue(),
            keywords: this.toArray(keywords)
        }
        return finalConfiguration
    }
    sendConfiguration = () => {
        const { urls } = this.props
        const { instanceId, errors } = this.state
        if (errors.length == 0) {
            this.setState({ saving: true })
            var formData = new FormData();
            
            let data = this.prepareServerData()
            if (data.thumbnail.type.includes("image"))
            formData.append('thumbnail', data.thumbnail);
            formData.append('logo', data.logo);
            
            const url = instanceId ? urls.editURL(instanceId) : urls.newURL
            const data_ = JSON.stringify(data)
            formData.append('data', data_);
            console.log(data);
            doPost(url, formData)
                .then(result => {
                    this.setState({
                        instanceId: result.id,
                        saving: false
                    })
                })
        }
    }
    showComponentsErrors = (callBack) => {
        let errors = []
        const steps = this.getSteps()
        steps.map((step, index) => {
            const formValue = this[step.ref].getComponentValue()
            if (!formValue) {
                errors.push(index)
            }
        })
        this.setState({ errors }, callBack)
    }
    save = () => {
        this.showComponentsErrors(this.sendConfiguration)
    }
    validate = () => {
        this.showComponentsErrors(() => { })
    }
    getChildrenProps = () => {
        const props = {
            ...this.state,
            ...this.props,
            steps: this.getSteps(),
            setStepRef: this.setStepRef,
            save: this.save,
            validate: this.validate
        }
        return props
    }
    render() {
        return (
            <div>
                <EditPageComponent childrenProps={this.getChildrenProps()} />
            </div>
        )
    }
}
EditPage.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object,
    username: PropTypes.string.isRequired
}
export default EditPage
