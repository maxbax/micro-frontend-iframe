import { getUrlParams, setCalledByParent, isCalledByParent } from './caller';
import { ParentCallerUrlParam } from './constants';

describe('models/caller', () => {
  describe('getUrlParams', () => {
    it('without location', () => {
      expect(getUrlParams()).toStrictEqual({});
    });

    it('without params', () => {
      delete global.window.location;
      global.window.location = { href: 'http://www.site.co' };
      expect(getUrlParams()).toStrictEqual({});
    });

    it('with params', () => {
      const param1 = 'value1';
      const param2 = 'value2';
      delete global.window.location;
      global.window.location = { href: `http://www.site.co?param1=${param1}&param2=${param2}` };
      expect(getUrlParams()).toStrictEqual({ param1, param2 });
    });
  });

  describe('setCalledByParent', () => {
    it('true', () => {
      delete global.window.location;
      global.window.location = { href: `http://www.site.co?${ParentCallerUrlParam}=true` };
      setCalledByParent();
      expect(window.calledByParent).toBe(true);
    });

    it('false', () => {
      delete global.window.location;
      global.window.location = { href: 'http://www.site.co' };
      setCalledByParent();
      expect(window.calledByParent).toBe(false);
    });
  });

  describe('isCalledByParent', () => {
    it('false', () => {
      window.calledByParent = undefined;
      expect(isCalledByParent()).toBe(false);
    });

    it('true', () => {
      window.calledByParent = 'parentId';
      expect(isCalledByParent()).toBe(true);
    });
  });
});
