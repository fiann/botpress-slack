const handlePromise = (next, promise) => {
  return promise.then(res => {
    next()
    return res
  })
  .catch(err => {
    next(err)
    throw err
  })
}

const handleText = (event, next, slack) => {
  if (event.platform !== 'slack' || event.type !== 'text') {
    return next()
  }

  const channel = event.raw.channel
  const text = event.text
  const options = event.raw.options

  return handlePromise(next, slack.sendText(channel, text, options))
}

const handleAttachments = (event, next, slack) => {
  if (event.platform !== 'slack' || event.type !== 'attachments') {
    return next()
  }

  const channel = event.raw.channel
  const attachments = event.raw.attachments
  const options = event.raw.options

  return handlePromise(next, slack.sendAttachments(channel, attachments, options))
}

const handleUpdateText = (event, next, slack) => {
  if (event.platform !== 'slack' || event.type !== 'update_text') {
    return next()
  }

  const channel = event.raw.channel
  const text = event.text
  const options = event.raw.options
  const ts = event.raw.ts
  
  return handlePromise(next, slack.sendUpdateText(ts, channel, text, options))
}

const handleUpdateAttachments = (event, next, slack) => {
  if (event.platform !== 'slack' || event.type !== 'update_attachments') {
    return next()
  }

  const channel = event.raw.channel
  const attachments = event.raw.attachments
  const options = event.raw.options
  const ts = event.raw.ts

  return handlePromise(next, slack.sendUpdateAttachments(ts, channel, attachments, options))
}

module.exports = {
  'text': handleText,
  'attachments': handleAttachments,
  'update_text': handleUpdateText,
  'update_attachments': handleUpdateAttachments,
  pending: {}
}
