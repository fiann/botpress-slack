import setupApi from './api'
import createConfig from './config'
import incoming from './incoming'
import outgoing from './outgoing'
import actions from './actions'

import _ from 'lodash'
import axios from 'axios'
import Promise from 'bluebird'

import Slack from './slack'

let adapter = null
let connection = null
let channels = null
let slack = null
const outgoingPending = outgoing.pending

const outgoingMiddleware = (event, next) => {
  if (event.platform !== 'slack') {
    return next()
  }

  if (!outgoing[event.type]) {
    return next('Unsupported event type: ' + event.type)
  }

  const setValue = method => (...args) => {
    if (event.__id && outgoingPending[event.__id]) {
      outgoingPending[event.__id][method].apply(null, args)
      delete outgoingPending[event.__id]
    }
  }

  outgoing[event.type](event, next, slack)
  .then(setValue('resolve'), setValue('reject'))
}

module.exports = {
  init(bp) {
    bp.middlewares.register({
      name: 'slack.sendMessages',
      type: 'outgoing',
      order: 100,
      handler: outgoingMiddleware,
      module: 'botpress-slack',
      description: 'Sends out messages that targets platform = slack.' +
      ' This middleware should be placed at the end as it swallows events once sent.'
    })

    bp.slack = {}
    _.forIn(actions, (action, name) => {
      bp.slack[name] = actions
      let sendName = name.replace(/^create/, 'send')
      bp.slack[sendName] = Promise.method(function() {

        var msg = action.apply(this, arguments)
        msg.__id = new Date().toISOString() + Math.random()
        const resolver = { event: msg }

        const promise = new Promise(function(resolve, reject) {
          resolver.resolve = resolve
          resolver.reject = reject
        })

        outgoingPending[msg.__id] = resolver

        bp.middlewares.sendOutgoing(msg)

        return promise
      })
    })
  },

  ready(bp) {
    const config = createConfig(bp)

    slack = new Slack(bp, config)

    const router = bp.getRouter('botpress-slack')

    const sendText = (message, channelId) => {
      slack.sendText(message, channelId)
    }

    const getStatus = () => ({
      hasSlackApiToken: !!config.slackApiToken.get(),
      isSlackConnected: slack.isConnected()
    })

    const connect = () => {
      if (slack) {
        slack.disconnect()
      }
      slack.connect()
    }

    const setConfigAndRestart = newConfigs => {
      config.setAll(newConfigs)
      connectSlack()
    }

    setupApi(router, {
      sendText,
      getStatus,
      getConfig: config.getAll,
      setConfig: setConfigAndRestart
    })

    connect()
    incoming(bp, slack)
  }
}
