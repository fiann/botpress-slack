import { RTM_EVENTS } from '@slack/client'

const OTHER_RTM_EVENTS = [
  "ACCOUNTS_CHANGED",
  "BOT_ADDED",
  "BOT_CHANGED",
  "CHANNEL_ARCHIVE",
  "CHANNEL_CREATED",
  "CHANNEL_DELETED",
  "CHANNEL_HISTORY_CHANGED",
  "CHANNEL_JOINED",
  "CHANNEL_LEFT",
  "CHANNEL_MARKED",
  "CHANNEL_RENAME",
  "CHANNEL_UNARCHIVE",
  "COMMANDS_CHANGED",
  "DND_UPDATED",
  "DND_UPDATED_USER",
  "EMAIL_DOMAIN_CHANGED",
  "EMOJI_CHANGED",
  "FILE_CHANGE",
  "FILE_COMMENT_ADDED",
  "FILE_COMMENT_DELETED",
  "FILE_COMMENT_EDITED",
  "FILE_CREATED",
  "FILE_DELETED",
  "FILE_PUBLIC",
  "FILE_UNSHARED",
  "GOODBYE",
  "GROUP_ARCHIVE",
  "GROUP_CLOSE",
  "GROUP_HISTORY_CHANGED",
  "GROUP_JOINED",
  "GROUP_LEFT",
  "GROUP_MARKED",
  "GROUP_OPEN",
  "GROUP_RENAME",
  "GROUP_UNARCHIVE",
  "HELLO",
  "IM_CLOSE",
  "IM_CREATED",
  "IM_HISTORY_CHANGED",
  "IM_MARKED",
  "IM_OPEN",
  "MANUAL_PRESENCE_CHANGE",
  "PIN_ADDED",
  "PIN_REMOVED",
  "PREF_CHANGE",
  "PRESENCE_CHANGE",
  "REACTION_REMOVED",
  "RECONNECT_URL",
  "STAR_ADDED",
  "STAR_REMOVED",
  "SUBTEAM_CREATED",
  "SUBTEAM_SELF_ADDED",
  "SUBTEAM_SELF_REMOVED",
  "SUBTEAM_UPDATED",
  "TEAM_DOMAIN_CHANGE",
  "TEAM_JOIN",
  "TEAM_MIGRATION_STARTED",
  "TEAM_PLAN_CHANGE",
  "TEAM_PREF_CHANGE",
  "TEAM_PROFILE_CHANGE",
  "TEAM_PROFILE_DELETE",
  "TEAM_PROFILE_REORDER",
  "TEAM_RENAME",
  "USER_CHANGE"
]

module.exports = (bp, slack) => {

  slack.rtm.on(RTM_EVENTS['MESSAGE'], function handleRtmMessage(message) {
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: message.type,
      user: message.user, //TODO Get user and save them to DB
      text: message.text,
      raw: message
    })
  })

  slack.rtm.on(RTM_EVENTS['REACTION_ADDED'], function handleRtmReactionAdded(reaction) {
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: reaction.type,
      user: reaction.user, //TODO Get user and save them to DB
      text: reaction.reaction,
      raw: reaction
    })
  })

  slack.rtm.on(RTM_EVENTS['USER_TYPING'], function handleRtmTypingAdded(typing) {
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: typing.type,
      user: typing.user, //TODO Get user and save them to DB
      text: typing.type,
      raw: typing
    })
  })

  slack.rtm.on(RTM_EVENTS['FILE_SHARED'], function handleRtmTypingAdded(file) {
    bp.middlewares.sendIncoming({
      platform: 'slack',
      type: file.type,
      user: file.user_id, //TODO Get user and save them to DB
      text: file.type,
      raw: file
    })
  })

  OTHER_RTM_EVENTS.map((rtmEvent) => {
    slack.rtm.on(RTM_EVENTS[rtmEvent], function handleOtherRTMevent(event) {
      bp.middlewares.sendIncoming({
        platform: 'slack',
        type: event.type,
        text: event.type,
        raw: event
      })
    })
  })
}
