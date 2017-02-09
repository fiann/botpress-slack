import _ from 'lodash'
import createStorage from './storage'

/**
 * Example:
 *
 * import createConfig from './config'
 *
 * const config = createConfig(bp)
 * const token = config.slackApiToken.get()
 *
 * // set token
 * config.slackApiToken.set(NEW_TOKEN)
 */

export default bp => {
  const configKeys = [
    'slackApiToken',
    'clientID',
    'clientSecret',
    'redirectURL'
  ]

  const configDefaults = {
    slackApiToken: 'xoxb-138666589986-MAUOcS16sx2abfg6FosrdODZ',
    clientID: '138377925429.137954480064',
    clientSecret: 'b0a57b93e2903bff6ce88795b07dabaa',
    redirectURL: 'https://1d8609ae.ngrok.io'
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
