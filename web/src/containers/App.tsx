import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import './App.less';
import { PageHeader } from 'antd';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='root-container'>
          <PageHeader title='Teachill' />
          <Route path='/' exact component={MainPage} />
        </div>
      </Router>
    );
  }
}

export default App;
