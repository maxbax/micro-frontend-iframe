import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MicroIframeTypes, ParentCallerUrlParam } from '../models/constants';
import MessagesPlugin from '../models/messages';
import Log from '../utils/log';

const iframeDefaultStyle = {
  width: '100%',
  height: '100%',
  border: 0,
};

class IFrame extends React.Component {
  constructor(props) {
    super(props);
    if (props.updateHash) {
      const routerPath = props.match.path;
      const routerPathBase = routerPath.substring(0, routerPath.indexOf(':') - 1);
      const { pathname } = props.location;
      const iframeHash = this.getIframeHash(routerPathBase, pathname);
      this.state = {
        appLoaded: false,
        loadingError: false,
        routerPathBase,
        ...this.setInitialSrc(iframeHash),
      };
      window.onhashchange = this.onHashChange;
    } else {
      this.state = {
        appLoaded: false,
        loadingError: false,
        ...this.setInitialSrc(''),
      };
    }
  }

  componentDidMount() {
    MessagesPlugin.subscribe(this.handleMessages);
  }

  componentWillUnmount() {
    MessagesPlugin.unsubscribe(this.handleMessages);
  }

  getIframeHash = (routerPathBase, hash) => hash.replace(routerPathBase, '')

  setInitialSrc = (currentHash) => {
    const { src } = this.props;
    const initialSrc = `${`${src}#${currentHash}`}?${ParentCallerUrlParam}=true`;
    return {
      initialSrc,
      currentHash,
    };
  }

  onHashChange = () => {
    const { currentHash, routerPathBase } = this.state;
    const newHash = window.location.hash.replace('#', '');
    if (currentHash !== newHash) {
      const iframeHash = this.getIframeHash(routerPathBase, newHash);
      this.setState({
        ...this.setInitialSrc(iframeHash),
      }, () => {
        const { initialSrc } = this.state;
        MessagesPlugin.postMessageToIframes(
          MicroIframeTypes.RELOAD, initialSrc,
        );
      });
    }
  };

  handleMessages = (message) => {
    switch (message.type) {
      case MicroIframeTypes.LOADED:
        this.eventoAppLoaded();
        break;
      case MicroIframeTypes.GOTO_EXTERNAL_HASH:
        this.eventoGotoExternalHash(message.payload);
        break;
      case MicroIframeTypes.CHANGE_HASH:
        this.eventoChangeHash(message.payload);
        break;
      case MicroIframeTypes.FOCUS:
        this.eventoFocus();
        break;
      default:
    }
    const { onReceiveMessage } = this.props;
    if (onReceiveMessage) onReceiveMessage(message);
  }

  eventoAppLoaded = () => {
    this.setState({ appLoaded: true });
  }

  eventoFocus = () => {
    document.body.click();
  }

  eventoChangeHash = (subHash) => {
    const { updateHash } = this.props;
    if (!updateHash) return;
    const { routerPathBase } = this.state;
    const hash = routerPathBase + (subHash === '/' ? '' : subHash);
    this.setState({ currentHash: hash });
    window.location.hash = hash;
  }

  eventoGotoExternalHash = (hash) => {
    window.location.hash = hash;
  }

  onLoad = () => {
    const { checkLoaded } = this.props;
    if (!checkLoaded) return;
    let timeout = 50;
    const checkLoadOk = () => {
      const { appLoaded } = this.state;
      Log.debug('load checking', timeout);
      timeout -= 10;
      if (appLoaded) {
        Log.debug('LOADED');
      } else if (timeout < 0) {
        this.setState({ loadingError: true });
        Log.debug('NOT LOADED');
      } else {
        setTimeout(checkLoadOk, 10);
      }
    };
    setTimeout(checkLoadOk, 10);
  }

  render() {
    const { style } = this.props;
    const { initialSrc, loadingError } = this.state;
    return (
      !loadingError && (
      <iframe
        title="iframe"
        style={{ ...iframeDefaultStyle, ...style }}
        src={initialSrc}
        onLoad={this.onLoad}
      />
      )
    );
  }
}

IFrame.defaultProps = {
  style: {},
  updateHash: true,
  checkLoaded: true,
  onReceiveMessage: null,
};

IFrame.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  updateHash: PropTypes.bool,
  checkLoaded: PropTypes.bool,
  onReceiveMessage: PropTypes.func,
};

export default withRouter(IFrame);
