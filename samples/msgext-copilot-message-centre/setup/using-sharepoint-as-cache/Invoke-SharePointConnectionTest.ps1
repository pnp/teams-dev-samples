$settingUrl = Get-AutomationVariable -Name Cfg_CacheSiteUrl
Connect-PnPOnline $settingUrl -ManagedIdentity
Get-PnPWeb