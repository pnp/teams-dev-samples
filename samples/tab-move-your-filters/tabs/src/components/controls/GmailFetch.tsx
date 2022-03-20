import { useState } from "react";
import { Button } from "@fluentui/react-northstar";
import { gapi } from "gapi-script";
import GoogleLogin from "react-google-login";
import { Filter } from "../lib/types";
import ErrorMessage from "./ErrorMessage";

const clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;

interface GmailFetchProps {
  onFiltersLoaded(filters: Filter[]): void;
}

export default function GmailFetch(props: GmailFetchProps) {
  const [errorMessage, setErrorMessage] = useState("");

  async function parseFilter(gFilter: any): Promise<Filter> {
    const filter: Filter = {};

    const criteria = gFilter.criteria;
    if (criteria.from) filter.from = criteria.from;
    if (criteria.to) filter.to = criteria.to;
    if (criteria.subject) filter.subject = criteria.subject;
    if (criteria.query) filter.hasTheWord = criteria.query;
    if (criteria.negatedQuery) filter.doesNotHaveTheWord = criteria.negatedQuery;
    if (criteria.hasAttachment) filter.hasAttachment = "true";
    if (criteria.sizeComparison) {
      filter.size = criteria.size.toString();
      filter.sizeOperator = criteria.sizeComparison === "smaller" ? "s_ss" : "s_sl";
      filter.sizeUnit = "s_sb";
    }

    const actions = gFilter.action;
    if (actions.forward) filter.forwardTo = actions.forward;
    if (actions.addLabelIds) {
      for (const id of actions.addLabelIds) {
        if (id === "IMPORTANT") {
          filter.shouldAlwaysMarkAsImportant = "true";
        } else if (id === "TRASH") {
          filter.shouldTrash = "true";
        } else if (id === "STARRED") {
          filter.shouldStar = "true";
        } else {
          const folder = await gapi.client.gmail.users.labels.get({
            "userId": "me",
            "id": id
          });
          if (folder.result.type === "user")
            filter.label = folder.result.name;
        }
      }
    }
    if (actions.removeLabelIds) {
      for (const id of actions.removeLabelIds) {
        if (id === "IMPORTANT") {
          filter.shouldNeverMarkAsImportant = "true";
        } else if (id === "UNREAD") {
          filter.shouldMarkAsRead = "true";
        } else if (id === "INBOX") {
          filter.shouldArchive = "true";
        } else if (id === "SPAM") {
          filter.shouldNeverSpam = "true";
        }
      }
    }

    return filter;
  }

  function onLoggedIn() {
    gapi.load("client", async () => {
      try {
        gapi.client.setApiKey(clientId);
        await gapi.client.load("gmail", "v1");
        const gFilters = await gapi.client.gmail.users.settings.filters.list({
          'userId': 'me'
        });
        const newFilters = (await Promise.all(gFilters.result.filter.map(async (gf: any) => await parseFilter(gf)))) as Filter[];
        props.onFiltersLoaded(newFilters);
      } catch (err: any) {
        setErrorMessage(err.result?.error?.message || JSON.stringify(err));
      }
    });
  }

  function onFailure(res: any) {
    setErrorMessage(res.error || JSON.stringify(res));
  }

  return (
    <>
      {clientId ?
        <GoogleLogin
          clientId={clientId}
          scope="https://www.googleapis.com/auth/gmail.readonly openid"
          onSuccess={onLoggedIn}
          onFailure={onFailure}
          isSignedIn={true}
          cookiePolicy={'single_host_origin'}
          render={props => (
            <Button primary content="Fetch Gmail filters" disabled={props.disabled} loading={props.disabled} onClick={props.onClick} />
          )}
        /> :
        <ErrorMessage message="Gmail API client ID not found. Please set REACT_APP_GMAIL_CLIENT_ID in the React .env file for this environment. See https://developers.google.com/gmail/api/auth/web-server and https://create-react-app.dev/docs/adding-custom-environment-variables/ for information on obtaining and setting the client ID." />}

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}
