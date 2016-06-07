import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import style from './main.scss';

class App extends Component {
    render() {
        return (
            <div>
                <h1>
                    Cloud Control!
                </h1>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));