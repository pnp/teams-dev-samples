$siteID = ''
$listID = ''
$tenant = ""
Connect-PnPOnline -Url "https://$tenant-admin.sharepoint.com"
$config = @{}
$config.siteID = $siteID
$config.listID = $listID
$json = $config | ConvertTo-JSON -Depth 2
Set-PnPStorageEntity -Key "DocReviewConfig" -Value $json.ToString() -Comment "Config DocReview" -Description "DocReview Teams solution Config"