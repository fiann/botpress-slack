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

  const text = event.text
  const channelId = event.raw.to

  return handlePromise(next, slack.sendText(channelId, text))
}

const handleAttachments = (event, next, slack) => {
  if (event.platform !== 'slack' || event.type !== 'attachments') {
    return next()
  }

  console.log(event.text)
  const text = event.text
  const channelId = event.raw.to
  const attachments = event.raw.attachments

  return handlePromise(next, slack.sendAttachments(channelId, text, attachments))
}

module.exports = {
  'text': handleText,
  'attachments': handleAttachments,
  pending: {}
}
