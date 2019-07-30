import Debug from 'debug';
import Log from './log';

jest.mock('debug', () => {
  const callMock = jest.fn();
  const debugMock = () => callMock;
  debugMock.enable = jest.fn();
  debugMock.call = callMock;
  return debugMock;
});

describe('Log', () => {
  describe('init', () => {
    it('check Debug init call', () => {
      const param = 'level';
      Log.init(param);
      expect(Debug.enable).toBeCalledWith(param);
    });
  });

  describe('error', () => {
    it('with one param', () => {
      const param = 'test';
      Log.error(param);
      expect(Debug.call).toBeCalledWith(param);
    });

    it('with more params', () => {
      const param1 = 'test1';
      const param2 = 'test2';
      Log.error(param1, param2);
      expect(Debug.call).toBeCalledWith([param1, param2]);
    });
  });

  describe('info', () => {
    it('with one param', () => {
      const param = 'test';
      Log.info(param);
      expect(Debug.call).toBeCalledWith(param);
    });

    it('with more params', () => {
      const param1 = 'test1';
      const param2 = 'test2';
      Log.info(param1, param2);
      expect(Debug.call).toBeCalledWith([param1, param2]);
    });
  });

  describe('debug', () => {
    it('with one param', () => {
      const param = 'test';
      Log.debug(param);
      expect(Debug.call).toBeCalledWith(param);
    });

    it('with more params', () => {
      const param1 = 'test1';
      const param2 = 'test2';
      Log.debug(param1, param2);
      expect(Debug.call).toBeCalledWith([param1, param2]);
    });
  });

  describe('warning', () => {
    it('with one param', () => {
      const param = 'test';
      Log.warn(param);
      expect(Debug.call).toBeCalledWith(param);
    });

    it('with more params', () => {
      const param1 = 'test1';
      const param2 = 'test2';
      Log.warn(param1, param2);
      expect(Debug.call).toBeCalledWith([param1, param2]);
    });
  });
});
