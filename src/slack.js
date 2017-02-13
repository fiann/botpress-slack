import { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } from '@slack/client'
import incoming from './incoming'

import axios from 'axios'
import Promise from 'bluebird'

class Slack {
  constructor(bp, config) {

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config')
    }

    this.rtm = null
    this.config = config
    this.isConnected = false
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

  connectRTM(bp, apiToken) {
    if (this.isConnected) {
      this.disconnect()
    }

    this.rtm = new RtmClient(apiToken)
    console.log(apiToken)

    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      console.log("1. Authenticated")
      this.data = rtmStartData
      this.channels = this.data.channels
    })

    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.log("2. Connected")
      this.isConnected = true
      incoming(bp, this)
    })

    this.rtm.start()
  }

  connectWebclient(apiToken) {
    this.web = new WebClient(apiToken)
  }


  connect(bp) {
    const apiToken = this.config.apiToken.get()

    if(!apiToken) return

    this.connectRTM(bp, apiToken)
    this.connectWebclient(apiToken)

    this.isConnected = true
  }

  disconnect() {
    this.rtm.disconnect()
  }
}

module.exports = Slack
