'use strict'

const _ = require('lodash')

const validateChannel = (channel) => {
  if (!/\w+/.test(channel)) {
    throw new Error('Invalid channel')
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

const createText = (channel, text, options = {}) => {
  validateChannel(channel)
  validateText(text)
  
  return {
    platform: 'slack',
    type: 'text',
    text: text,
    raw: {
      channel: channel,
      options: options
    }
  }
}

const createAttachments = (channel, attachments, options = {}) => {
  validateChannel(channel)
  validateAttachments(attachments)

  return {
    platform: 'slack',
    type: 'attachments',
    text: 'App sent an attachments',
    raw: {
      channel: channel,
      attachments: attachments,
      options: options
    }
  }
}

const createUpdateText = (ts, channel, text, options = {}) => {
  validateChannel(channel)
  validateText(text)

  return {
    platform: 'slack',
    type: 'update_text',
    text: text,
    raw: {
      channel: channel,
      ts: ts,
      options: options
    }
  }
} 

const createUpdateAttachments = (ts, channel, attachments, options = {}) => {
  validateChannel(channel)
  validateAttachments(attachments)

  return {
    platform: 'slack',
    type: 'update_attachments',
    text: "App updated an attachments",
    raw: {
      channel: channel,
      attachments: attachments,
      ts: ts,
      options: options
    }
  }
} 

module.exports = {
  createText,
  createAttachments,
  createUpdateText,
  createUpdateAttachments
}
