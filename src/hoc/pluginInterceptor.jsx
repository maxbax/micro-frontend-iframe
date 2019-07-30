import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MicroIframeTypes } from '../models/constants';
import MessagesPlugin from '../models/messages';

const pluginInterceptor = WrappedComponent => withRouter(class extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  componentDidMount() {
    MessagesPlugin.subscribe(this.handleMessages);
    window.addEventListener('focus', this.onFocus, false);
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname } } = this.props;
    const { location: { pathname: pathnamePrev } } = prevProps;
    if (pathname !== pathnamePrev) {
      MessagesPlugin.postMessageToParent(MicroIframeTypes.CHANGE_HASH, pathname);
    }
  }

  componentWillUnmount() {
    MessagesPlugin.unsubscribe(this.handleMessages);
    window.removeEventListener('focus', this.onFocus, false);
  }

  onFocus = () => {
    MessagesPlugin.postMessageToParent(MicroIframeTypes.FOCUS);
  }

  handleMessages = (message) => {
    switch (message.type) {
      case MicroIframeTypes.RELOAD:
        window.location = message.payload;
        break;
      default:
    }
    if (this.child.current.handleMessages) {
      this.child.current.handleMessages(message);
    }
  }

  render() {
    return <WrappedComponent ref={this.child} {...this.props} />;
  }
});

export {
  pluginInterceptor, // eslint-disable-line import/prefer-default-export
};
