import IFrame from './components/IFrame';
import { pluginInterceptor } from './hoc/pluginInterceptor';
import MicroIframe from './models/messages';
import { isCalledByParent } from './models/caller';

export default MicroIframe;

export {
  IFrame,
  pluginInterceptor,
  isCalledByParent,
};
