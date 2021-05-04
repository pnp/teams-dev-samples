#! /usr/bin/pwsh

Param(
  [string]$ApplicationName,
  [string]$RedirectUrl
)

az login --allow-no-subscriptions

az ad app create `
  --display-name $ApplicationName `
  --available-to-other-tenants true `
  --homepage $RedirectUrl `
  --oauth2-allow-implicit-flow true `
  --reply-urls $RedirectUrl $RedirectUrl/auth.html