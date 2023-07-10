export function inTeams() {
  const currentUrl = window.location.href;
  // Check if using HistoryRouter
  const url = currentUrl.includes("#/")
    ? new URL(`${window.location.href.replace("#/", "/")}`)
    : new URL(window.location);
  const params = url.searchParams;
  console.log(params.get("inTeams"));
  return !!params.get("inTeams");
}