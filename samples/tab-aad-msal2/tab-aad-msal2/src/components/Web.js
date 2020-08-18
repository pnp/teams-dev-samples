import React from 'react';
import AuthService from '../services/AuthService'

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null
    }
  }

  render() {

      return (
        <div>
        <h1>MSAL 2.0 Test App</h1>
        <button onClick={this.getMessages.bind(this)}>Get Mail</button>
        <p>Username: {AuthService.getUsername()}</p>
        <p>Access token: {this.state.token}</p>
      </div>
      );
  }

  getMessages() {

    if (!AuthService.isLoggedIn()) {
      AuthService.login();
      // Will redirect the browser and not return
    } else {
      AuthService.getAccessToken(["User.Read", "Mail.Read"])
      .then((token) => {
        this.setState({
          token: token
        })
      })
      .catch((error) => { console.log(error); });
    }
  }

}
export default Web;