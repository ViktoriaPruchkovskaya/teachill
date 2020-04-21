import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Signup } from '../components/Signup/Signup';
import { Signin } from '../components/Signin/Signin';
import './StartPage.less';

export const StartPage: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <div className='start-page-container'>
      <div className='start-page-content-container'>
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus, diam vitae
            pellentesque dignissim, nulla est molestie justo, id sollicitudin quam metus non eros.
            Integer sit amet felis ex. Etiam tempor tellus in odio commodo sollicitudin. Quisque sed
            massa vel elit efficitur eleifend. Maecenas congue euismod metus vitae euismod.
            Phasellus vehicula, neque vitae vestibulum pellentesque, elit sapien bibendum tellus, et
            imperdiet eros mauris nec metus. Sed elementum nibh et massa cursus ullamcorper. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra eget neque a tempus.
            Nulla ut metus consectetur, egestas nulla eget, interdum massa. Nulla facilisi. Sed urna
            leo, porta a est sed, tincidunt feugiat massa. Quisque malesuada nulla felis, eget
            dignissim dui tincidunt non. Praesent sed porta lectus. In dapibus nulla a tempus
            tincidunt. Etiam facilisis elit id neque posuere porta.
          </p>
        </div>
        <div className='auth-select-container'>
          <Signup history={history} />
          <Signin history={history} />
        </div>
      </div>
    </div>
  );
};
