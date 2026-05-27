import { app } from "@microsoft/teams-js";

export function openLink(url: string) {
  app.openLink(url);
}
