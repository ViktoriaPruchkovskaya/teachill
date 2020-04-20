import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { StartPage } from './StartPage';
import { PageHeader } from 'antd';
import { SchedulePage } from './SchedulePage';
import './App.less';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='root-container'>
          <PageHeader className='header' title='Teachill' />
          <Route path='/' exact component={StartPage} />
          <Route path='/schedule' component={SchedulePage} />
        </div>
      </Router>
    );
  }
}

export default App;
