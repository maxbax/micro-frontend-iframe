import MicroIframe from './messages';
import { ID_MICROIFRAME_MSGS } from './constants';

const idReceiver = 'abc123';

describe('models/MicroIframe', () => {
  it('init', () => {
    expect(MicroIframe.config.idReceiver).toBe(undefined);
    expect(MicroIframe.config.initialized).toBe(false);
    MicroIframe.init(idReceiver);
    expect(MicroIframe.config.idReceiver).toBe(idReceiver);
    expect(MicroIframe.config.initialized).toBe(true);
  });

  it('formatMessage', () => {
    const type = 'type';
    const payload = 'payload';
    const idDestination = 'idDestination';
    expect(MicroIframe.formatMessage(type, payload, idDestination)).toStrictEqual({
      id: ID_MICROIFRAME_MSGS,
      origin: idReceiver,
      destination: idDestination,
      type,
      payload,
    });
  });

  it('postMessageToIframes', () => {
    const type = 'type';
    const payload = 'payload';
    const idDestination = 'idDestination';
    const postMessage = jest.fn();
    document.getElementsByTagName = () => [{
      contentWindow: {
        postMessage,
      },
    }];
    MicroIframe.postMessageToIframes(type, payload, idDestination);
    expect(postMessage).toBeCalledWith(MicroIframe.formatMessage(type, payload, idDestination), '*');
  });

  it('postMessageToParent', () => {
    const type = 'type';
    const payload = 'payload';
    const postMessage = jest.fn();
    delete global.window.parent;
    global.window.parent = {
      postMessage,
    };
    MicroIframe.postMessageToParent(type, payload);
    expect(postMessage).toBeCalledWith(MicroIframe.formatMessage(type, payload), '*');
  });

  it('subscribe/unsubscribe', () => {
    const context = 'context';
    const callback = jest.fn();
    expect(MicroIframe.regs).toStrictEqual([]);
    MicroIframe.subscribe(callback, context);
    expect(MicroIframe.regs).toStrictEqual([{ callback, context }]);
    MicroIframe.unsubscribe(callback);
    expect(MicroIframe.regs).toStrictEqual([]);
  });

  describe('handleMessage', () => {
    it('correct event', () => {
      const callback = jest.fn();
      MicroIframe.subscribe(callback);
      const payload = 'payload';
      const event = {
        data: {
          id: ID_MICROIFRAME_MSGS,
          payload,
        },
      };
      MicroIframe.handleMessage(event);
      expect(callback).toBeCalledWith({
        payload,
      });
    });

    it('event with destination', () => {
      const callback = jest.fn();
      MicroIframe.subscribe(callback);
      const payload = 'payload';
      const event = {
        data: {
          id: ID_MICROIFRAME_MSGS,
          payload,
          destination: idReceiver,
        },
      };
      MicroIframe.handleMessage(event);
      expect(callback).toBeCalledWith({
        payload,
      });
    });

    it('not correct event', () => {
      const callback = jest.fn();
      MicroIframe.subscribe(callback);
      const payload = 'payload';
      const event = {
        data: {
          payload,
        },
      };
      MicroIframe.handleMessage(event);
      expect(callback).not.toBeCalled();
    });
  });
});
