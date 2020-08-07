class EventEmitter {
  #events = new Map();

  create(eventName, eventType = "single") {
    this.#createEvent(eventName, eventType);
  }

  on(eventNames, ...listeners) {
    let events = Array.isArray(eventNames) ? eventNames : [eventNames];

    events.forEach((eventName) => {
      let event = this.#getEvent(eventName);

      if (typeof event !== "object") {
        event = this.#createEvent(eventName);
      }

      listeners.forEach((listener) => {
        if (event.type === "single" && event.count > 0) {
          listener.apply(event, event.args);
        }

        this.#setEventListener(event, listener);
      });
    });
  }

  off(eventNames, ...listeners) {
    let events = Array.isArray(eventNames) ? eventNames : [eventNames];

    events.forEach((eventName) => {
      const event = this.#getEvent(eventName);
      if (typeof event !== "object") return;

      listeners.forEach((listener) =>
        this.#removeEventListener(event, listener)
      );
    });
  }

  emit(eventName, ...args) {
    const event = this.#getEvent(eventName);
    if (typeof event === "undefined") return;
    if (event.type === "single") event.args = args;
    event.count = event.count + 1;
    event.listeners.forEach((listener) => listener.apply(event, args));
  }

  once(event, listener) {
    const temp = (...args) => {
      this.off(event, temp);
      listener.apply(this, args);
    };

    this.on(event, temp);
  }

  #createEvent(event, type = "default") {
    if (this.#events.has(event)) {
      throw "Event already exists";
    }

    this.#events.set(event, {
      type,
      args: null,
      listeners: new Set(),
      count: 0
    });

    return this.#events.get(event);
  }

  #getEvent(event) {
    return this.#events.get(event);
  }

  #getEventListeners({ listeners }) {
    return listeners;
  }

  #setEventListener(event, listener) {
    const listeners = this.#getEventListeners(event);
    return listeners.add(listener);
  }

  #removeEventListener(event, listener) {
    const listeners = this.#getEventListeners(event);
    return listeners.delete(listener);
  }
}

export default EventEmitter;
