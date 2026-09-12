# ig-chat-api2

An Instagram direct-message client arranged like the function-based `fb-chat-api`
package. Instagram-specific HTTP and MQTT behavior is kept in the internal class
and method modules, while each public operation is exposed from its own
`src/<function>.js` factory.

## Install

```bash
npm install ig-chat-api2
```

## Login

Cookie login is the recommended flow:

```js
const login = require('ig-chat-api2');

login('sessionid=...; ds_user_id=...; csrftoken=...', (err, api) => {
  if (err) return console.error(err);

  api.listen((listenErr, event) => {
    if (listenErr) return console.error(listenErr);
    if (event.type === 'message') {
      api.sendMessage(`Received: ${event.body}`, event.threadID);
    }
  });
});
```

Promise-style login and the original `login` named-import style are both
supported:

```js
const { login } = require('ig-chat-api2');
const api = await login(process.env.INSTAGRAM_COOKIES);
await api.sendMessage('Hello', threadID);
```

## fca-compatible message calls

```js
api.sendMessage('Hello', threadID, callback);
api.sendMessage({ body: 'Photo', image: 'https://example.com/photo.jpg' }, threadID);
api.sendMessage('Reply', threadID, callback, messageID);
api.setMessageReaction('❤️', messageID, callback);
api.listenMqtt(callback);
```

Message objects support `body`, `attachment`, `image`, `video`, `gif`, `audio`,
`photo`, and `replyTo`. Methods return promises when no callback is supplied.

## Layout

```text
index.js                 login and fca-style function registry
src/<function>.js        one public function per file
src/methods/              Instagram protocol method implementations
src/utils/                HTTP, cookies, validation, logging, and options
src/mqtt/                 Instagram realtime transport
```

## Important

This client uses private Instagram web/mobile endpoints. Use it only with an
account you control and expect Instagram to change or rate-limit those
endpoints.