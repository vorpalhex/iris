# iris

A discord bot built for the Blankface social group.

## Setup and Running
```
npm install
npm start
```

## Contributing

### Commands

Commands are the easiest thing to contribute. Here is a sample 'Hello World' command, in full:

```
module.exports = {
  name: 'hello',
  aliases: ['hi'],
  description: 'say hello',
  activate: (message) => message.reply('hello world!')
};
```

A command is a node module which exports at the very least a name and a description. Most commands that don't require lifecycle control can just pass a function to activate, which will be called with the message as their first param, and some processed entities as their second parameter.

If you need to manage your own lifecycle (be called on startup, etc), then you can additionally pass functions to the `register` hook.

|Hook Name | Expects | Description |
|----------|---------|-------------|
|name      | String  | The name of this command. Will be used as an alias, and allow this commands activate to be called |
|aliases   | Array of Strings | Additional ways to invoke this command. These will always be treated case-insensitive. |
|description| String | This will be printed out on help screens |
|longDescription| String | This will be printed out on the help screen for this specific command |
|activate| Function with params (message, formatted) | If passed, this will be called whenever someone uses your name or alias to Iris |
|register| Function with no params | Called when Iris first loads up. This function should return `true` unless there was an error, at which point you may pass `false` and the command will not be hooked up to help screens or the command router. |

### Core/Models/Util/Etc

Things here are mostly used to handle lifecycle, logging, the bus itself, storage, etc. The relevant ones are described in the APIs section.

## APIs

### Log
`lib/util/log`

Exposes a preconfigured and ready to go Winston logger. Methods are the usual:
```
debug(any args) //usually do not display unless in development
info(any args) //info for usual process running
warn(any args) //for non critical errors
error(any args) //critical errors
```

### Bus
`lib/core/bus`

Used to grab events quickly

`message` - any message ever will appear on this bus
`message.direct` - only direct mentions (eg either talking directly to iris or @iris)
`presence` - presence updates which follow the presence model

Methods here are:
```
subscribe(eventName, callbackFn) //your callbackFn will be called on every event
publish(eventName, object) //publish an event, object should be a model
```

### Conf
`lib/util/conf`

Exposes a configuration object from `config/config.json`
