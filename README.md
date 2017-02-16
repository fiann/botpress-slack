# botpress-slack

Official Slack connector module for [Botpress](http://github.com/botpress/botpress).

This module has been built to accelerate and facilitate development of Slack bots.

## Installation

Installing modules on Botpress is simple. By using CLI, users only need to type this command in their terminal to add messenger module to their bot.

```js
botpress install slack
```

It's also possible to install it through the Botpress UI in the modules section.

## Get started

To setup connexion of your chatbot to Slack, you need to fill the connexion settings directly in the module interface. In fact, you only need to follow these steps and your bot will be ready to use.

Settings can also be set programmatically by providing the settings in the `${modules_config_dir}/botpress-slack.json`

<img alt='Connexion settings' src='assets/connexion-settings.png' width='700px'/>

##### 1. Setup Hostname

You need to manually enter your hostname. If you are developping locally, we suggest using [ngrok](#ngrok) to deploy your chatbot ([learn more about ngrok]((https://ngrok.com))

##### 2. Create a [**Slack app**](https://api.slack.com/apps?new_app=1)
  
<img alt='Create app' src='/assets/create-app-slack.png' width='450px' />

##### 3. Get Client ID and Client Secret

These information are available on *Basic Information* of you app. You only need to copy them in module interface.

<img alt='Client id and client secret' src='/assets/client-id-client-secret.png' width='500px' />

##### 4. Setup OAuth & Permissions

On the *OAuth & Permissions* page of your slack app, you need to enter your redirect url for the authentification. The redirect url need to be *<hostname> + /modules/botpress-slack* as you can see in the example screenshot below.

<img alt='OAuth settings' src='/assets/oauth.png' width='500px;' />

##### 5. Create a Bot User

On the *Bot Users* page of your slack app, you need to add a *Bot User* by clicking on *Add a Bot User*. We suggest you to turn on *Always Show My Bot as Online* for be able to use RTM API correctly.

<img alt='Bot users' src='/assets/bot-user.png' width='500px;' />

##### 6. Setup Interactive Messages

On the *Interactive messages* page of your slack app, you need to *Enable Interactive Messages* and add a *Request URL*. The URL entered needs to be format as *<hostname> + /api/botpress-slack/action-endpoint*.

<img alt='Interactive messages' src='/assets/interactive-messages.png' width='500px;' />

##### 7. Get Verification Token

The verification token should appear below App Id and App  information are available on *Basic Information* of you app. You only need to copy them in module interface.

<img alt='App id and app secret' src='/assets/verification-token.png' width='500px' />

##### 8. Set scope

On your configuration page of your module, you need to set scope of your bot. We suggest you to keep the default configuration _(admin,bot,chat:write:bot,commands,identify,incoming-webhook)_, but if you want to want to modify it, we suggest you to look to the [documentation](https://api.slack.com/docs/oauth-scopes).

##### 9. Authenticate & Connect

Next step is to authenticate and connect your bot. To do it, you only need to click on *Authenticate & Connect* on your module and follow the steps. Once it will be done, you should received an *API Token* and a *Bot Token*. They will appear on your settings page of your module.

<img alt='Connexion completed' src='/assets/completed.png' width='500px;' />

If you want to have more information about doumentation, we suggest you to look at the [official slack documentation](https://api.slack.com/).


## Features

### Incoming

* [Profile](#profile)
* [Text](#text)
* [Reaction](#reaction)
* [Typing](#typing)
* [File](#file)
* [User mention](#user-mention)
* [Bot mention](#bot-mention)
* [Direct message](#direct-message)
* [Validation](#validation)

### Outgoing

* [Text](#text-messages)
* [Attachments](#attachments)
* [Reaction](#reaction)

## Reference

### Incoming

You can listen to incoming event easily with Botpress by using `bp` built-in `hear` function. You only need to listen to specific Messenger event to be able to react to user's actions.

```js
bp.hear({ platform: 'facebook', type: 'postback', text: 'GET_STARTED' }, (event, next) => {
      bp.messenger.pipeText(event.user.id, 'Welcome on Botpress!!!')
   }
})
```

In fact, this module preprocesses almost all types of message (message, attachment, postback, quick_reply, delivery, read, optin, referrals...) and send them to incoming middlewares. When you build a bot or a module, you can access to all information about incoming messages that have been send to  middlewares.

```js
bp.middlewares.sendIncoming({
   platform: 'facebook',
   type: 'message',
   user: profile,
   text: e.message.text,
   raw: e
})
```

#### Profile

You can acces to all user's profile information by using this module. A cache have been implemented to fetch all information about users and this information is sent to middlewares.

```js
{
  id: profile.id,
  platform: 'facebook',
  gender: profile.gender,
  timezone: profile.timezone,
  locale: profile.locale
}
```

**Note**: All new users are automatically saved by this module in Botpress built-in database (`bp.db`).

#### Text messages

An `event` is sent to middlewares for each incoming text message from Messenger platform with all specific information.

```js
{
  platform: 'facebook',
  type: 'message',
  user: profile,
  text: e.message.text,
  raw: e
}
```

Then, you can listen easily to this `event` in your module or bot

```js
bp.hear('hello')
```

#### Postbacks

```js
{
  platform: 'facebook',
  type: 'postback',
  user: profile,
  text: e.postback.payload,
  raw: e
}
```

#### Attachments

The original attachments messenger event. May contain multiple attachments. Individual attachments are also emmited individually (see Image, Video, File below)

```js
{
  platform: 'facebook',
  type: 'attachments',
  user: profile,
  text: e.message.attachments.length,
  raw: e
}
```

##### Image

Individual Attachment extracted from the Attachments event.

Note that Stickers, Thumbs Up, GIFs and Pictures are considered images too.

```js
{
  platform: 'facebook',
  type: 'image', // Same for 'video', 'file' and 'audio'
  user: profile,
  text: 'http://www.image.url',
  raw: { type: 'image', payload: { url: '...' }}
}
```

##### Audio
##### Video
##### File

Same signature as `Image` above.

#### Referrals

```js
{
  platform: 'facebook',
  type: 'referral',
  user: profile,
  text: e.referral.ref,
  raw: e
}
```

#### Quick Replies

```js
{
  platform: 'facebook',
  type: 'quick_reply',
  user: profile,
  text: e.message.quick_reply.payload,
  raw: e
}
```

#### Optins

```js
{
  platform: 'facebook',
  type: 'optin',
  user: profile,
  text: e.optin.ref,
  raw: e
}
```

#### Delivery

```js
{
  platform: 'facebook',
  type: 'delivery',
  user: profile,
  text: e.delivery.watermark,
  raw: e
}
```

#### Read

```js
{
  platform: 'facebook',
  type: 'read',
  user: profile,
  text: e.read.watermark,
  raw: e
}
```

### Outgoing

By using our module, you can send anything you want to your users on Messenger. In fact, this module support all types of messenge that are available on Facebook (text, images, videos, audios, webviews...).

#### Creating actions without sending them

Note that all the below actions are available under two format: `send___` and `create____`, the latter effectively only creating the middleware Event without piping (sending) it to the outgoing middleware. This is useful when combining libraries together (for example Botkit):

```js
  // This message won't be sent
  const message = bp.messenger.createText(event.user.id, 'What is your name?')
  // But `message` is a fully formed middleware event object, ready to be sent
  // example using the botpress-botkit module
  convo.ask(message, function(response, convo) { /* ... */ })
```

### Text messages

In code, it is simple to send a message text to a specific users ([facebook doc](https://developers.facebook.com/docs/messenger-platform/send-api-reference/text-message)).

#### `sendText(userId, text, [options])` -> Promise

##### Arguments

1. ` userId ` (_String_): Correspond to unique Messenger's recipient identifier. Usually, this `recipient_id` is available from input message.

2. ` text ` (_String_): Text message that will be send to user.

3. ` options ` (_Object_): An object that may contain:
- `quick_replies` which is an array of quick replies to attach to the message
- `typing` indicator. true for automatic timing calculation or a number in milliseconds (turns off automatically)
- `waitDelivery` the returning Promise will resolve only when the message is delivered to the user
- `waitRead` the returning Promise will resolve only when the user reads the message

##### Returns

(_Promise_): Send to outgoing middlewares a formatted `Object` than contains all information (platform, type, text, raw) about the text message that needs to be sent to Messenger platform. The promise resolves when the message was successfully sent to facebook, except if you set the `waitDelivery` or `waitRead` options.

##### Example

```js
const userId = 'USER_ID'
const text = "Select between these two options?"
const options = {
  quick_replies: [
    {
      content_type: "text",
      title: "Option 1",
      payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_OPTION_1"
    },
    {
      content_type:"text",
      title:"Option 2",
      payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_OPTION_2"
    }
  ],
  typing: true,
  waitRead: true
}

bp.messenger.sendText(userId, text, options)
.then(() => {
  // the message was read because of `waitRead` option  
})
```

### Attachments

By using this function, you can send any type of attachment to your users ([facebook doc](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)).

#### `sendAttachment(userId, type, url, [options])` -> Promise

##### Arguments

1. ` userId ` (_String_): Correspond to unique Messenger's recipient identifier

2. ` type ` (_String_): Specific type of  attachment can be `'audio'`, `'file'`, `'image'` or `'video'`

3. ` url ` (_String_): Correspond to specific url of the attachment that need to be sent.

4. ` options ` (_Object_): An object that may contain:
- `quick_replies`
- `typing`
- `waitDelivery` the returning Promise will resolve only when the message is delivered to the user
- `waitRead` the returning Promise will resolve only when the user reads the message

##### Returns

(_Promise_): Send to outgoing middlewares a formatted `Object` than contains all information (platform, type, text, raw) about the attachment that needs to be sent to Messenger platform.

##### Example

```js
const userId = 'USER_ID'
const type = 'image'
const url = 'https://github.com/botpress/botpress/blob/master/images/botpress-dark.png?raw=true'

bp.messenger.sendAttachment(userId, type, url)
```

### Templates

By using this module, it's easy to send any type of supported template to your users ([facebook doc](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates)).

#### `sendTemplate(userId, payload, [options])` -> Promise

##### Arguments

1. ` userId ` (_String_): Correspond to unique Messenger's recipient identifier

2. ` payload ` (_Object_): Specific `payload` object for your selected template. Actually, many types of template (button, generic, list, receipt...) are supported by Messenger.

3. ` options ` (_Object_): An object that may contains:
- `typing`
- `waitDelivery` the returning Promise will resolve only when the message is delivered to the user
- `waitRead` the returning Promise will resolve only when the user reads the message

##### Returns

(_Promise_): Send to outgoing middlewares a formatted `Object` than contains all information (platform, type, text, raw) about the template that needs to be sent.

##### Example

```js
const userId = 'USER_ID'
const payload = {
    template_type: "button",
    text: "Have you seen our awesome website?",
    buttons: [
        {
            type: "web_url",
            url: "https://www.botpress.io",
            title: "Show Website"
        }
    ]
}

bp.messenger.sendTemplate(userId, payload, { typing: 2000 })
```

#### Quick replies
By using `options` argument, you can easily add quick replies to text messages or attachments.

```js
const options = {
    quick_replies: [
        {
            content_type :"text",
            title: "Option",
            payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_OPTION"
        }
    ]
}
```

#### Automatic typing indicator

As quick replies, you can add an automatic typing indicator to your messages by adding `typing` to `options` argument.

```js
const options = { typing: true }
```


#### Postbacks

This module support postbacks. Postbacks occur when a Postback button, Get Started button, Persistent menu or Structured Message is tapped ([facebook doc](https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback)).

#### Referrals

This module also support referrals. In fact, the value of the `ref` parameter is passed by the server via webhook and we are able to access these referrals in parameters of input messages ([facebook doc](https://developers.facebook.com/docs/messenger-platform/webhook-reference/referral)).

#### Display Get Started

To active get started button on Messenger, users can modify display setting directly in user interface ([facebook doc](https://developers.facebook.com/docs/messenger-platform/thread-settings/get-started-button)).

<img alt='Get started button' src='/assets/display-get-started.png' width='600px' />


#### Greeting message

Directly in module view, users are able to modify greeting message ([facebook doc](https://developers.facebook.com/docs/messenger-platform/thread-settings/greeting-text)).


<img alt='Greeting message' src='/assets/greeting-message.png' width='600px' />

#### Persistent menu

Users can directly modify persistent menu in module user interface. By using UI, it's possible to add, modify and remove items \([facebook doc](https://developers.facebook.com/docs/messenger-platform/thread-settings/persistent-menu)\).

<img alt='Persistent menu' src='/assets/persistent-menu.png' width='600px' />

#### Automatically mark as read

Directly in UI, users can setup if they want to automatically mark all messages as read ([facebook doc](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read)).

<img alt='Mark as read' src='/assets/automatically-mark-as-read.png' width='600px' />

#### Trusted domains

By using UI, users can configure \(add, modify and remove\) trusted domains ([facebook doc](https://developers.facebook.com/docs/messenger-platform/thread-settings/domain-whitelisting)).

<img alt='Trusted domains' src='/assets/trusted-domains.png' width='600px'/>

#### Automatic profile lookup

Profiles are automatically lookedup using Facebook Graph API. The profile of the user can be found in the incoming middleware events: `event.user`

The following properties are available: first_name, last_name, locale, gender, timezone.
 
#### Save users in Database

Users are automatically persisted in the built-in botpress database using the built-in `bp.db.saveUser` function.

#### Webhook security check

botpress-messenger verifies that requests really come from Facebook's servers by validating requests hash.


### Community

There's a [Slack community](https://slack.botpress.io) where you are welcome to join us, ask any question and even help others.

Get an invite and join us now! 👉[https://slack.botpress.io](https://slack.botpress.io)

### License

botpress-messenger is licensed under AGPL-3.0

