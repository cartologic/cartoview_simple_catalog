import t from 'tcomb-form'
export const generalFormSchema = () => {
    const selectKeywordItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        title: t.String,
        abstract: t.maybe(t.String),
        keywords: t.list(selectKeywordItem),
    })
    return formSchema
}
export const catalogFormSchema = () => {
    const formSchema = t.struct({
        pagination: t.Number,
        sortBy: t.String,
        search: t.Boolean
    })
    return formSchema
}
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