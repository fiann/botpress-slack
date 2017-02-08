import setupApi from './api'
import createSendFuncs from './sendFuncs'
import createConfig from './config'
import createAdapter from './adapter'
import incoming from './incoming'

// TODO refactor rename it for better naming consistency
import SlackConnector from './slackConnector'

let adapter = null
let slackConn = null

const channelName = 'botpress-integration'
let channel = null
const getChannel = () => channel

// TODO
// 3. configurable slack api token
//    - status management
//      - no token
//      - connection failed
//    - update config api -> restart slack rtm if token changed

module.exports = {
  init(bp) {
    bp.slack = createSendFuncs(bp.middlewares.sendOutgoing)
    adapter = createAdapter(bp.middlewares)
  },

  ready(bp) {
    const config = createConfig(bp)

    const router = bp.getRouter('botpress-slack')

    // TODO handle channel == null
    const sendText = message => {
      const channel = getChannel()
      if (!channel) return
      bp.slack.sendText(message, channel.id)
    }

    const getStatus = () => ({
      hasSlackApiToken: !!config.slackApiToken.get(),
      isSlackConnected: false
    })

    const connectSlack = () => {
      const slackApiToken = config.slackApiToken.get()

      if (!slackApiToken) return

      if (slackConn) slackConn.disconnect()
      slackConn = SlackConnector(slackApiToken, adapter.sendIncoming)

      // TODO channel list api
      // TODO select channel api
      // TODO remember to handle no channel found state
      slackConn.authenticateP.done(data => {
        channel = data.channels.filter(c => c.name === channelName)[0]
        adapter.setSlackConn(slackConn)
      })

      slackConn.connect()
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

    connectSlack()

    incoming(bp, slackConn)
  }
}
