$settingUrl = Get-AutomationVariable -Name Cfg_CacheSiteUrl
$settingSvcAnnCacheListName = Get-AutomationVariable -Name Cfg_CacheListName_ServiceAnnouncements
$settingSvcHealthCacheListName =  Get-AutomationVariable -Name Cfg_CacheListName_ServiceHealth

Write-Host "Site: $($settingUrl)"
Write-Host "List: $($settingSvcAnnCacheListName)"
Write-Host "List: $($settingSvcHealthCacheListName)"

# Connect
Connect-PnPOnline $settingUrl -ManagedIdentity

Get-PnPListItem -List "Cache Service Health" -PageSize 2000 -Fields Id | ForEach-Object { $_ | Remove-PnPListItem -Force }
Get-PnPListItem -List "Cache Service Announcements" -PageSize 2000 -Fields Id | ForEach-Object { $_ | Remove-PnPListItem -Force }

Write-Host "Done :-)"