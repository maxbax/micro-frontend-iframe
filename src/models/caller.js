import { ParentCallerUrlParam } from './constants';

const getUrlParams = () => {
  const params = {};
  if (window.location && window.location.href) {
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      (m, key, value) => { params[key] = value; });
  }
  return params;
};

const setCalledByParent = () => {
  const urlParams = getUrlParams();
  window.calledByParent = !!urlParams[ParentCallerUrlParam];
};

const isCalledByParent = () => !!window.calledByParent || false;

export {
  getUrlParams, // only for test
  setCalledByParent,
  isCalledByParent,
};
