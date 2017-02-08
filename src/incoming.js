import { RTM_EVENTS } from '@slack/client'

module.exports = (bp) => {
  bp.slack.rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    console.log("---> 3. Messages received")
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: message.type,
      user: message.user, //TODO Get user and save them to DB
      text: message.text,
      raw: message
    })
  });

  bp.slack.rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
    console.log("---> 4. Reaction received")
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: reaction.type,
      user: reaction.user, //TODO Get user and save them to DB
      text: reaction.reaction,
      raw: reaction
    })
  });
}
