class Subscription {
	constructor(channel, onMessage, eventBus) {
		this.channel = channel;
		this.onMessage = onMessage;
		this.eventBus = eventBus;
	}

	release() {
		let subscriptions = this.eventBus.subscriptions;
		let channelSubs = subscriptions[this.channel];
		if (channelSubs !== undefined) {
			channelSubs.delete(this);
			if (channelSubs.size === 0) {
				delete subscriptions[this.channel];
			}
		}
	}
}

module.exports = class EventBus {
	constructor() {
		this.subscriptions = {};
	}

	subscribe(channel, onMessage) {
		let sub = new Subscription(channel, onMessage, this);
		let channelSubs = this.subscriptions[channel];
		if (channelSubs === undefined) {
			channelSubs = new Set();
			this.subscriptions[channel] = channelSubs;
		}
		channelSubs.add(sub);
		return sub;
	}

	emit() {
		let args = [...arguments];
		let channel = args.shift();
		let channelSubs = this.subscriptions[channel];
		if (channelSubs !== undefined) {
			channelSubs.forEach(el => el.onMessage(...args));
		}
	}
}