module.exports = class Message {
  constructor(config) {
    this.contents = config.contents || '',
    this.user = config.user || {},
    this.interface = config.interface || '',
    this.raw = config.raw || null,
    this.mentions = config.mentions || {}
  }
}
