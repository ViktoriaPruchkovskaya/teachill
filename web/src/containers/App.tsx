import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { StartPage } from './StartPage';
import './App.less';
import { PageHeader } from 'antd';
import { SchedulePage } from './SchedulePage';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='root-container'>
          <PageHeader title='Teachill' />
          <Route path='/' exact component={StartPage} />
          <Route path='/schedule' component={SchedulePage} />
        </div>
      </Router>
    );
  }
}

export default App;
