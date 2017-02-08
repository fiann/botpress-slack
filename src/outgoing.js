const handleText = (event, next, slack) => {
  if (event.platform !== 'slack') {
    return next()
  }

  const {text, raw: {channelId}} = event
  slack.sendTextMessage(
    event.raw.message,
    event.raw.to)
  .then(() => next())
  .catch(err => next(err))
}

module.exports = {
  'text': handleText
}
