import setupApi from './api'
import createConfig from './config'
import incoming from './incoming'
import outgoing from './outgoing'

import Slack from './slack'

let adapter = null
let connection = null
let channels = null

// TODO
// 3. configurable slack api token
//    - status management
//      - no token
//      - connection failed
//    - update config api -> restart slack rtm if token changed

const outgoingMiddleware = (event, next) => {
  if (event.platform !== 'slack') {
    return next()
  }

  console.log(event)

  if (!outgoing[event.type]) {
    return next('Unsupported event type: ' + event.type)
  }

  outgoing[event.type](event, next, slack)
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
  },

  ready(bp) {
    const config = createConfig(bp)

    bp.slack = new Slack(bp, config)

    const router = bp.getRouter('botpress-slack')

    const sendText = (message, channelId) => {
      bp.slack.sendText(message, channelId)
    }

    const getStatus = () => ({
      hasSlackApiToken: !!config.slackApiToken.get(),
      isSlackConnected: bp.slack.isConnected()
    })

    const connect = () => {
      if (bp.slack) {
        bp.slack.disconnect()
      }
      bp.slack.connect()
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
    incoming(bp)

    setTimeout(() => {
      bp.slack.sendText('C42UUEZ1D', "Yoyoyo!!")
    }, 2000)
  }
}
