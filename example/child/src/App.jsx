import React from 'react';
import MicroIframe, { pluginInterceptor, isCalledByParent } from 'micro-frontend-iframe';

MicroIframe.init('CHILD-ID');

class App extends React.Component {
    state={
      messageFromParent: null,
    }

    sendToParent=() => {
      MicroIframe.postMessageToParent('HELLO-MSG', `Hi dad! (${new Date().toLocaleString()})`);
    }

    handleMessages= (msg) => {
      if (msg.type === 'HELLO-MSG') {
        this.setState({ messageFromParent: msg.payload });
      }
    }

    render = () => {
      const { messageFromParent } = this.state;
      return (
        <React.Fragment>
          <h1>Micro-frontend-iframe CHILD!</h1>
          {isCalledByParent()
            ? <button type="button" onClick={this.sendToParent}>Send message to parent</button>
            : <h3>Not called by parent!</h3>}
          {messageFromParent && (
            <p>
              <b>Parent says:</b>
              {messageFromParent}
            </p>
          )}
        </React.Fragment>
      );
    }
}

export default pluginInterceptor(App);
