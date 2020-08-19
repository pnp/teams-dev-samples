// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider, themes } from "@fluentui/react";

ReactDOM.render(
    <Provider theme={themes.teams}>
        <App />
    </Provider>, document.getElementById('root')
);
