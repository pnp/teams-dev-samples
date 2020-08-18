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

  handleGetProfile() {

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

  render() {

    // if (this.state.teamService) {
      return (
        <div>
        <h1>Congratulations!</h1> <h3>This is your new tab! :-)</h3>
        <button onClick={this.handleGetProfile.bind(this)}>Get My Profile</button>
        <p>Username: {AuthService.getUsername()}</p>
        <p>Access token: {this.state.token}</p>
      </div>
      );
    // } else {
    //   return <p>Loading TeamService</p>;
    // }

  }

  handleGetProfile() {
    if (AuthService.isLoggedIn()) {
      AuthService.getAccessToken(["User.Read", "Mail.Read"])
      .then((token) => {
        this.setState({
          token: token
        })
      })
      .catch((error) => { console.log(error); });
    } else {
      AuthService.login();
    }
  }
}
export default Web;