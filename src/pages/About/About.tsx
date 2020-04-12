import * as React from 'react';
import './About.css';

interface IAboutProps {}

const About: React.SFC<IAboutProps> = props => {
  return (
    <div>
      Icons made by{' '}
      <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">
        Pixel perfect
      </a>{' '}
      from{' '}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>
  );
};

export default About;
