interface IConfiguration{
    boxClientId: string;
    boxClientSecret:string;
    boxAuthorizationUrl:string;
    authenticatePage:string;
    boxGetTokenUrl:string;
}
const configuration:IConfiguration = {
    boxAuthorizationUrl: "https://account.box.com/api/oauth2/authorize",
    boxClientId: "YOUR-BOX-CLIENT-ID",
    boxClientSecret: "YOUR-BOX-CLIENT-SECRET",
    authenticatePage: "loginstart.aspx",
    boxGetTokenUrl:"https://api.box.com/oauth2/token"
};

export default configuration;