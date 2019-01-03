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
      constructor(props) {
        super(props);
        this.state = {
            people: []
        };
      this.handleNameClick = this.handleNameClick.bind(this);
    }

    handleNameClick() {
    if(this.nameTextInput.value && this.state.people.length === 0) {
        this.setState({
        people: this.state.people.concat(this.nameTextInput.value)
        });
        this.nameTextInput.value='';
        this.nameTextInput.focus();
        }
    }

  render() {
     let names = this.state.people.map(name => {
              return <li>{name}</li>;
                  });
    return (
    <div>
        <Router>
        <div>
            <Navigation/>
        <Switch>
            <Route exact path="/" />
            <Route path="/home" component={Home} />
            <Route path="/board" component={Board} />
            <Route component={Path} />
        </Switch>

        </div>
        </Router>
         <br />

             <div className="row">
                 <div className="column">
                     <h2>Main name:</h2>
                     <h3>{names}</h3>
                 </div>
             </div>

              <div className="row">
                  <div className="column">
                        <input type="text" placeholder="Enter main name"
                        ref={(ref) => this.nameTextInput = ref}
                        className="form-control" />
                  </div>
                  <div className="col-md-4">
                      <button type="button" className="btnMainName"
                      onClick={this.handleNameClick}>Enter</button>
              </div>
         </div>
    </div>
    );
  }
};

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
