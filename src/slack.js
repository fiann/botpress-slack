import { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } from '@slack/client'

import axios from 'axios'
import Promise from 'bluebird'

class Slack {
  constructor(bp, config) {

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config')
    }

    this.config = config
    this.isConnected = false


    const apiToken = config.apiToken.get()
    const rtm = this.rtm = new RtmClient(apiToken)
    const web = this.web = new WebClient(apiToken);

    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      this.data = rtmStartData
      this.channels = this.data.channels
    })

    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this.isConnected = true
    })
  }

  sendText(channelId, text) {
    // TODO: Valid connexion status...
    if(!this.isConnected) {
      console.log("Err: You are not connected...")
      return null
    }

    if (!text || !channelId) {
      console.log("Err: Text or Channel is not defined...")
      return null
    }

    return Promise.fromCallback(cb => {
      this.web.chat.postMessage(channelId, text, {
        as_user: true
      }, cb)
    })
  }

  sendAttachments(channelId, text, attachments) {
    // TODO: Valid connexion status...
    if(!this.isConnected) {
      console.log("Err: You are not connected...")
      return null
    }

    if (!text || !channelId) {
      console.log("Err: Text or Channel is not defined...")
      return null
    }


    return Promise.fromCallback(cb => {
      this.web.chat.postMessage(channelId, null, {
        attachments,
        as_user: true
      }, cb)
    })
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
