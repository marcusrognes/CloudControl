import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import style from './main.scss';

import DB from './settings/DB';

var Database = new DB('CloudControl');

var Servers = Database.addCollection('servers');

class App extends Component {
    render() {
        var serverButtons = [];

        Servers.forEach((server, i)=> {
            serverButtons.push(
                <div key={'server-' + i}>
                    <h4>{server.name}</h4>
                    <h5>{server.host}</h5>
                </div>
            );
        });

        return (
            <div>
                <h1>
                    Cloud Control!
                </h1>
                {serverButtons}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
