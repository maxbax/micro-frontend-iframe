import { MicroIframeTypes, ID_MICROIFRAME_MSGS } from './constants';
import { setCalledByParent, isCalledByParent } from './caller';
import Log from '../utils/log';

class MicroIframe {
  constructor() {
    this.regs = [];
    this.config = {
      initialized: false,
      IdReceiver: null,
    };

    this.handleMessage = (event) => {
      if (event.data && event.data.id === ID_MICROIFRAME_MSGS
        && event.data.origin !== this.config.idReceiver) {
        const { data: { id, destination, ...eventToForward } } = event;
        if (destination && destination !== this.config.idReceiver) {
          return;
        }
        Log.debug(`MESSAGE FOR ${this.config.idReceiver}`, event);
        this.regs.forEach((reg) => {
          reg.callback(eventToForward);
        });
      }
    };

    this.configTest = () => {
      if (!this.config.initialized) {
        throw new TypeError('MicroIframe not configured');
      }
    };

    this.formatMessage = (type, payload, destination = null) => {
      this.configTest();
      return {
        id: ID_MICROIFRAME_MSGS,
        origin: this.config.idReceiver,
        destination,
        type,
        payload,
      };
    };
  }

  init = (idReceiver) => {
    Log.init(Log.LogLevel.all);
    if (this.config.initialized) {
      Log.warn('MicroIframe already configured');
      return;
    }
    setCalledByParent();
    this.config.initialized = true;
    this.config.idReceiver = idReceiver;
    if (isCalledByParent()) this.postMessageToParent(MicroIframeTypes.LOADED);
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage);
    } else {
      window.attachEvent('onmessage', this.handleMessage);
    }
  };

  postMessageToIframes = (type, payload, idDestination = null) => {
    this.configTest();
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i += 1) {
      iframes[i].contentWindow.postMessage(this.formatMessage(type, payload, idDestination), '*');
    }
  };

  postMessageToParent = (type, payload) => {
    this.configTest();
    window.parent.postMessage(this.formatMessage(type, payload), '*');
  };

  subscribe = (callback, context = null) => {
    this.configTest();
    if (!callback || typeof callback !== 'function') {
      throw new TypeError('MicroIframe: required callback function');
    }
    this.regs = this.regs.concat([{ callback, context }]);
    return this;
  }

  unsubscribe = (callback) => {
    this.configTest();
    if (!callback || typeof callback !== 'function') {
      throw new TypeError('MicroIframe: required callback function');
    }
    for (let i = 0; i < this.regs.length; i += 1) {
      if (this.regs[i].callback === callback) {
        this.regs.splice(i, 1);
        return this;
      }
    }
    return this;
  }
}

const EventoServer = new MicroIframe();

export default EventoServer;
