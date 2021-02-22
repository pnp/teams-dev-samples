const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

/**
 * Validates the access token for signature 
 * and against a predefined set of claims
 */
validateAccessToken = async(accessToken) => {
    
    if (!accessToken || accessToken === "" || accessToken === "undefined") {
        console.log('No tokens found');
        return false;
    }

    // we will first decode to get kid parameter in header
    let decodedToken; 
    
    try {
        decodedToken = jwt.decode(accessToken, {complete: true});
    } catch (error) {
        console.log('Token cannot be decoded');
        console.log(error);
        return false;
    }

    // obtains signing keys from discovery endpoint
    let keys;

    try {
        keys = await getSigningKeys(decodedToken.header);        
    } catch (error) {
        console.log('Signing keys cannot be obtained');
        console.log(error);
        return false;
    }

    // verify the signature at header section using keys
    let verifiedToken;

    try {
        verifiedToken = jwt.verify(accessToken, keys);
    } catch(error) {
        console.log('Token cannot be verified');
        console.log(error);
        return false;
    }

    /**
     * Validates the token against issuer, audience, scope
     * and timestamp, though implementation and extent vary. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
     */

    const now = Math.round((new Date()).getTime() / 1000); // in UNIX format

    const checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
    const checkAudience = verifiedToken['aud'] === process.env.CLIENT_ID || verifiedToken['aud'] === 'api://' + process.env.CLIENT_ID ? true : false;
    const checkScope = verifiedToken['scp'] === process.env.EXPECTED_SCOPES ? true : false;

    // TODO: discuss
    const checkIssuer = verifiedToken["iss"].includes(verifiedToken["tid"]) ? true : false;

    if (checkTimestamp && checkAudience && checkScope && checkIssuer) {
        return true;
    }
    return false;
};

/**
 * Fetches signing keys of an access token 
 * from the authority discovery endpoint
 */
getSigningKeys = async(header) => {

    // In single-tenant apps, discovery keys endpoint will be specific to your tenant
    const jwksUri =`https://login.microsoftonline.com/${process.env.TENANT_INFO}/discovery/v2.0/keys`

    const client = jwksClient({
        jwksUri: jwksUri
    });

    return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
};

module.exports = validateAccessToken