import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/voteMovieTab/index.html")
@PreventIframe("/voteMovieTab/config.html")
@PreventIframe("/voteMovieTab/remove.html")
export class VoteMovieTab {
}
