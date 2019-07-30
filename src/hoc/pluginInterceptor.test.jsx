import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { pluginInterceptor } from './pluginInterceptor';

describe('hoc pluginInterceptor', () => {
  it('test base', () => {
    const root = TestUtils.renderIntoDocument(
      pluginInterceptor(React.Fragment),
    );
    expect(root).toBeDefined();
  });
});
