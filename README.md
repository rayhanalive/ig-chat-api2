# IG Chat API 2

`ig-chat-api2` keeps the Instagram transport from the original `ig-chat-api`,
but exposes its functions in the same modular style as `fb-chat-api`.

## Login

Cookie login accepts the formats already supported by the original package:

```js
const login = require('./ig-chat-api2');

const api = await login({
  appState: cookies
});
```

Username/password login is also available:

```js
const api = await login({
  username: process.env.IG_USERNAME,
  password: process.env.IG_PASSWORD
});
```

The callback form is supported:

```js
login({ appState: cookies }, (error, api) => {
  if (error) throw error;
  api.sendMessage('Hello from Instagram', threadID);
});
```

## FCA-style listener

```js
api.listenMqtt((error, event) => {
  if (error) return console.error(error);
  if (event.type === 'message') {
    console.log(event.senderID, event.body);
  }
});
```

`api.listen()` is an alias of `api.listenMqtt()`.

## Main API

The following methods are exposed as one-function modules under `src/`:

- `sendMessage`, `sendDirectMessage`, `replyToMessage`, `unsendMessage`
- `sendPhoto`, `sendVideo`, `sendVoice`, `sendGIF`
- `sendPhotoFromUrl`, `sendVideoFromUrl`, `sendVoiceFromUrl`
- `getThreadInfo`, `getThreadList`, `getThreadHistory`, `searchForThread`
- `deleteThread`, `muteThread`, `unmuteThread`, `setTitle`
- `addUserToGroup`, `removeUserFromGroup`, `changeNickname`
- `setMessageReaction`, `removeMessageReaction`
- `sendTypingIndicator`, `markAsRead`, `markAsReadAll`
- `getCurrentUserID`, `getUserID`, `getUserInfo`, `searchUsers`
- `getHealth`, `logout`

Every request method supports both promises and the FCA callback convention.

## Important limitation

Instagram does not expose every Facebook feature. Methods such as Facebook
polls, post reactions, friend requests, and Facebook-specific MQTT operations
cannot be made reliable by renaming them. They are intentionally not faked in
this adapter.