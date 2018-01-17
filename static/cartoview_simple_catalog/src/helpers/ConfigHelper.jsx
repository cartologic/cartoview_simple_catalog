import URL from 'Source/utils/URL'
import { doGet } from 'Source/utils/utils'
class ConfigHelper {
    constructor( urls ) {
        this.urls = urls
        this.URLHelpers = new URL( this.urls.proxy )
    }
    getData = ( url, params = {} ) => {
        let paramterizedURL = this.URLHelpers.getParamterizedURL( url,
            params )
        const proxiedURL = this.URLHelpers.getProxiedURL( paramterizedURL )
        return doGet( proxiedURL )
    }
}
export default new ConfigHelper()
