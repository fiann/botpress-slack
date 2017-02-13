import _ from 'lodash'
import createStorage from './storage'

/**
 * Example:
 *
 * import createConfig from './config'
 *
 * const config = createConfig(bp)
 * const token = config.apiToken.get()
 *
 * // set token
 * config.apiToken.set(NEW_TOKEN)
 */

export default bp => {
  const configKeys = [
    'apiToken',
    'clientID',
    'clientSecret',
    'hostname',
    'verificationToken',
    'scope'
  ]

  const configDefaults = {
    apiToken: null,
    clientID: '138377925429.137954480064',
    clientSecret: 'b0a57b93e2903bff6ce88795b07dabaa',
    hostname: 'https://889b5eab.ngrok.io',
    verificationToken: 'lvfm4zgYi3eYAtqrvnjvchTN',
    scope: 'client'
  }

  const configStorage = createStorage(bp, configDefaults)

  // inner config memory
  const config = configStorage.load()

  const createConfigAccessMethods = key => ({
    get: () => config[key],
    set: value => {
      config[key] = value
      configStorage.save(config)
    }
  })

  const accessMethods = _.reduce(configKeys, (acc, key) => ({
    ...acc,
    [key]: createConfigAccessMethods(key)
  }), {})

  const extraMethods = {
    getAll: () => config,
    setAll: (newConfig) => _.forEach(configKeys, key => {
      accessMethods[key].set(newConfig[key])
    })
  }

  return {
    ...accessMethods,
    ...extraMethods,
  }
}
