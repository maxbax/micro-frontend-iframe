import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { HashRouter } from 'react-router-dom';
import IFrame from './IFrame';
import MicroIframe from '../models/messages';

MicroIframe.init('');

describe('<IFrame />', () => {
  it('test base', () => {
    const root = TestUtils.renderIntoDocument(
      <HashRouter>
        <IFrame
          src=""
        />
      </HashRouter>,
    );
    expect(root).toBeDefined();
  });
});
