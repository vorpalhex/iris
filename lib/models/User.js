module.exports = class Message {
  constructor(config) {
    this.raw = config.raw || {},
    this.interface = config.interface || '',
    this.interfaceId = config.interfaceId || '',
    this.email = config.email || '',
    this.displayName = config.displayName || ''
  }
}
