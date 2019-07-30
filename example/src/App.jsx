import React from 'react';
import MicroIframe, { IFrame } from 'micro-frontend-iframe';

MicroIframe.init('PARENT-ID');

class App extends React.Component {
  state={
    messageFromChild: null,
  }

  sendToChild=() => {
    MicroIframe.postMessageToIframes('HELLO-MSG', `Hi child! (${new Date().toLocaleString()})`);
  }

  receiveFromChild=(msg) => {
    if (msg.type === 'HELLO-MSG') {
      this.setState({ messageFromChild: msg.payload });
    }
  }

  render = () => {
    const { messageFromChild } = this.state;
    return (
      <React.Fragment>
        <h1>Micro-frontend-iframe Example!</h1>
        <IFrame
          src="http://localhost:8082"
          onReceiveMessage={this.receiveFromChild}
        />
        <button type="button" onClick={this.sendToChild}>Send message to child</button>
        {messageFromChild && (
        <p>
          <b>Child says:</b>
          {messageFromChild}
        </p>
        )}
      </React.Fragment>
    );
  };
}

export default App;
