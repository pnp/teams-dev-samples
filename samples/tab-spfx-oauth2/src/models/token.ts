export default interface IToken{
    AccessToken?:string;
    RefreshToken?:string;
    ExpiresIn?: number;
}