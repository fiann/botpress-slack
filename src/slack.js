import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import axios from 'axios'

class Slack {
  constructor(bp, config) {

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config')
    }

    this.isConnected = false

    const slackApiToken = config.slackApiToken.get()
    const rtm = this.rtm = new RtmClient(slackApiToken)

    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      console.log("---> 1. Bot is authenticated")
      this.data = rtmStartData
      this.channels = this.data.channels
    })

    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this.isConnected = true
      console.log("---> 2. Bot is connected")
    })

  }

  sendText(channelId, text) {

    // TODO: Valid connexion status...
    if(!this.isConnected) {
      console.log("Err: You are not connected...")
      return null
    }
    console.log(text, channelId)
    if (!text || !channelId) {
      console.log("Err: Text or Channel is not defined...")
      return null
    }

    console.log("---> 5. Sending a message")
    return this.rtm.sendMessage(text, channelId)
  }

  isConnected() {
    return this.isConnected
  }

  getData() {
    return this.data
  }

  connect() {
    this.rtm.start()
  }

  disconnect() {
    this.rtm.disconnect()
  }
}

module.exports = Slack
