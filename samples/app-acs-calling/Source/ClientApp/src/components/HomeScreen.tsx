/* eslint-disable react/display-name */
// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Image, IImageStyles } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';
import { imgStyle } from './styles/HomeScreen.styles';
// import axios from 'axios';

const imageStyleProps: IImageStyles = {
  image: {
    display: '',
    width: '100%',
    height: '100%'
  },
  root: {}
};

export default (): JSX.Element => {
  const imageProps = { src: heroSVG.toString() };
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: '50%', float: 'left', paddingTop: '10%', height: '100%' }}>
        <h1>Welcome to the Azure Communication Services Calling sample app</h1>
        <Image
          alt="Welcome to the Azure Communication Services Calling sample app"
          className={imgStyle}
          styles={imageStyleProps}
          {...imageProps}
        />
      </div>
      <div style={{ width: '50%', float: 'right', height: '100%' }}>
      <iframe
                    src="https://webchat.botframework.com/embed/<<BotHandle>>?s=<<secretkey>>"
          style={{ minWidth: '400px', width: '100%', height: '100%', minHeight: '500px', float: 'right' }}
        ></iframe>
      </div>
    </div>
  );
};
