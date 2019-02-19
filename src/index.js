import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Game from "./components/Game";
import Path from "./components/Path";
import Home from "./components/Home";
import Navigation from "./components/Navigation";

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            isHidden: true,
        };
        this.handleNameClick = this.handleNameClick.bind(this);
    }

    handleNameClick() {
        if (this.nameTextInput.value && this.state.people.length === 0) {
            this.setState({
                people: this.state.people.concat(this.nameTextInput.value)
            });
            this.nameTextInput.value = '';
            this.nameTextInput.focus();
        }
        if (this.state.people.length >= 0) {
            this.toggleHidden();
        }
    }

    toggleHidden() {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    render() {
        let names = this.state.people.map(name => {
            return <li>{name}</li>;
        });
        return (
            <div>
                <Router>
                    <div>
                        <Navigation />
                        <Switch>
                            <Route exact path="/" />
                            <Route path="/home" component={Home} />
                            <Route path="/game" component={Game} />
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

                {
                    this.state.isHidden ?
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
                        : null
                }
            </div>
        );
    }
};

ReactDOM.render(<Start />, document.getElementById('root'));