# iris

A cross service modular bot platform for providing utilities anywhere you might be.

## Setup and Running
```
npm install
npm start
```

## Contributing

### Commands

Commands are the easiest thing to contribute. These have a `register()` function which gets called to set the command up. You can listen to the event bus and prepare to take in direct commands. A good command to start with is `greeting`.

Current commands:
* Wikia search: `wikia {wikia domain} {search term}`
* Google search: `google {search term}`
* Let me google that for you search: `lmgtfy {search term}`
* Stautus check: `status`

### Interfaces

Interfaces are what connect Iris to a particular service such as Slack or Discord. These are complicated and implement several methods. The model interface is `slack`.

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
