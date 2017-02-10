'use strict'

const _ = require('lodash')

const validateChannelId = (channelId) => {
  if (!/\w+/.test(channelId)) {
    throw new Error('Invalid channelId')
  }
}

const validateText = (text) => {
  if (typeof(text) !== 'string') {
    throw new Error('Text must be a string.')
  }
}

const validateAttachments = (attachments) => {
  if (typeof(attachments) !== 'object') {
    throw new Error('Expected attachments type to be an object')
  }
}

const validateUrl = (url) => {
  // if (typeof(url) !== 'string') {
  //   throw new Error('Expected URL to be a string')
  // }
}

const createText = (channelId, text) => {
  validateChannelId(channelId)
  validateText(text)

  return {
    platform: 'slack',
    type: 'text',
    text: text,
    raw: {
      to: channelId,
      message: text
    }
  }
}

const createAttachments = (channelId, text, attachments) => {
  validateChannelId(channelId)
  validateAttachments(attachments)

  return {
    platform: 'slack',
    type: 'attachments',
    text: 'Slack attachments (Array)',
    raw: {
      to: channelId,
      attachments: attachments
    }
  }
}

module.exports = {
  createText,
  createAttachments
}
