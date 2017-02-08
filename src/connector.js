/**
 * This is a wrapper for slack rtm client
 * in charge of
 *    - connection state management and
 *    - tranform events from slack and dispatch it to incoming middleware
 *
 * TODO event transform should be moved to adapter.js
 */

import Promise from 'bluebird'
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'

// TODO handle all events from slack
//
// - connection failed
// - rate limited
// - disconnected
//

export default (slackApiToken) => {
  let data
  let isConnected = false

  const rtm = new RtmClient(slackApiToken)

  // TODO add rejection if 30 sec time out
  // TODO add rejection for authentication failed
  const authenticateP = new Promise((resolve) => {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      console.log("---> 1. Bot is authenticated")
      data = rtmStartData
      resolve(data)
    })
  })

  rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    isConnected = true
    console.log("---> 2. Bot is connected")
  })

  return {
    authenticateP,
    rtm,
    isConnected: () => isConnected,
    getData: () => data,
    connect: () => rtm.start(),
    disconnect: () => rtm.disconnect()
  }
}
