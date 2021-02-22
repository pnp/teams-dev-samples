/**
 * TODO: Before using this, make the following changes in src/components/Tab.js
 * Line 92: replace variable name "subError" with "suberror"
 * Line 107: replace string "accessToken" with "access_token"
 */

const express = require('express');
const passport = require('passport');
const fetch = require('node-fetch');

const BearerStrategy = require('passport-azure-ad').BearerStrategy;

require('dotenv').config();

const options = {
    identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_INFO}/v2.0/.well-known/openid-configuration`,
    issuer: `https://login.microsoftonline.com/${process.env.TENANT_INFO}/v2.0`,
    clientID: process.env.CLIENT_ID,
    audience: process.env.CLIENT_ID,
    validateIssuer: false,
    loggingLevel: "info",
    passReqToCallback: false,
    scope: [process.env.EXPECTED_SCOPES]
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    done(null, {}, token);
});

const app = express();

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ 'extended': true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

// This is where your API methods are exposed
app.get(
    '/getGraphAccessToken', 
    passport.authenticate('oauth-bearer', { session: false }), // TODO: how to get tid claim from ssoToken and supply it to 'tenantIdOrName'
    async (req, res) => {

        console.log('Validated claims: ', JSON.stringify(req.authInfo));

        // the access token the user sent
        const userToken = req.get('authorization');
        console.log('user token: ', userToken);

        try {
            // request new token and use it to call resource API on user's behalf
            let tokenObj = await getNewAccessToken(userToken);
            console.log(tokenObj);
            return res.send(tokenObj);   
        } catch (error) {
            console.log(error)
            return res.send(error);
        }
    }
);

async function getNewAccessToken(userToken) {

    const [bearer, tokenValue] = userToken.split(' ');
    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_INFO}/oauth2/v2.0/token`;

    let myHeaders = new fetch.Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    let urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    urlencoded.append('client_id', process.env.CLIENT_ID);
    urlencoded.append('client_secret', process.env.CLIENT_SECRET);
    urlencoded.append('assertion', tokenValue);
    urlencoded.append('scope', [process.env.GRAPH_SCOPES, "offline_access"]);
    urlencoded.append('requested_token_use', 'on_behalf_of');

    let options = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded
    };

    let response = await fetch(tokenEndpoint, options);
    let json = response.json();
    return json;
}

const port = process.env.PORT || 5000;

app.listen(port);

console.log('API server is listening on port ' + port);