import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/voteMovieFluidTab/index.html")
@PreventIframe("/voteMovieFluidTab/config.html")
@PreventIframe("/voteMovieFluidTab/remove.html")
export class VoteMovieFluidTab {
}
