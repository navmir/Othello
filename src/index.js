// eslint-disable-next-line
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Board from "./components/Board";
import Path from "./components/Path";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
  
class Game extends React.Component {
  render() {
    return (
    <div>
        <Router>
        <div>
            <Navigation/>
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/home" component={Home} />
            <Route path="/board" component={Board} />
            <Route component={Path} />
        </Switch>

        </div>
        </Router>
     </div>

/*      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{}</ol>
        </div>
      </div>*/


    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
