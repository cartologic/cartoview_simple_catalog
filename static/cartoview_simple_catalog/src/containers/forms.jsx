import t from 'tcomb-form'
// All tcomb forms defined here


// General Form
export const generalFormSchema = () => {
    const selectKeywordItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        title: t.String,
        abstract: t.maybe(t.String),
        keywords:  t.list(selectKeywordItem),
        thumbnail: t.maybe(t.form.File),
        logo: t.maybe(t.form.File)
    })
    return formSchema
}
// Catalog Options Form
export const catalogFormSchema = () => {
    const formSchema = t.struct({
        sortBy: t.String,
        search: t.Boolean
    })
    return formSchema
}
// Access Configuration Form (edit/new)
export const accessFormSchema = () => {
    const selectUserItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        whoCanView: t.maybe(t.list(selectUserItem)),
        whoCanChangeMetadata: t.maybe(t.list(selectUserItem)),
        whoCanDelete: t.maybe(t.list(selectUserItem)),
        whoCanChangeConfiguration: t.maybe(t.list(selectUserItem))
    })
    return formSchema
}