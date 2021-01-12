// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class Tab extends React.Component {
  constructor(props){
    super(props)
    this.state = {
	  context: {},
	  sendStatus: "",
	  conversationId: "",
	  serviceUrl: ""
	}
	
	this.sendProactiveTextMessage = this.sendProactiveTextMessage.bind(this);
	this.handleConversationIdChange = this.handleConversationIdChange.bind(this);
	this.handleServiceUrlChange = this.handleServiceUrlChange.bind(this);
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount(){
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {

		let subEntityId = context['subEntityId'];
	
		let conversationId = subEntityId === ""
								? ""
								: subEntityId.split("|")[0];

		let serviceUrl = subEntityId === ""
								? ""
								: subEntityId.split("|")[1];

		this.setState({
			context: context,
			conversationId: conversationId,
			serviceUrl: serviceUrl
		});
    });
    // Next steps: Error handling using the error object
  }

  handleConversationIdChange(event) {
    this.setState({conversationId: event.target.value});
  }

  handleServiceUrlChange(event) {
    this.setState({serviceUrl: event.target.value});
  }

  sendProactiveTextMessage() {

	this.setState({
		sendStatus: "sending..."
	});

	fetch(`${process.env.REACT_APP_API_URLBASE}/api/sendProactiveTextMessage`, {
		method: 'POST',
		headers: {
			  'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			conversationId: this.state.conversationId,
			serviceUrl: this.state.serviceUrl
		}, null, 2)
	})
	.then(response => {
		this.setState({
			sendStatus: response.ok ? "sent" : "failed"
		});
	})
  }

  render() {

		return (
		<div>
			<h3>Hello World!</h3>

			<p>ConversationId: <input style={{width: "100%"}} value={this.state.conversationId} onChange={this.handleConversationIdChange}></input></p>
			<p>ServiceUrl: <input style={{width: "100%"}} value={this.state.serviceUrl} onChange={this.handleServiceUrlChange}></input></p>

			<p>
				<button type="button" onClick={this.sendProactiveTextMessage}>Send Proactive Message</button> {this.state.sendStatus}
			</p>
		</div>
		);
  }
}
export default Tab;