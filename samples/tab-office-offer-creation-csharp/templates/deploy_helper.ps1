$siteUrl = "https://mmoellermvp.sharepoint.com/teams/Offerings/"
.\templates\deploy.ps1 -siteUrl $siteUrl

Get-PnPSiteTemplate -Out "C:\temp\pnp_templates\Offerings_In.xml" -Handlers Fields,ContentTypes,Lists

Add-PnPFile -Path "C:\temp\pnp_templates\Offering.dotx" -Folder "_cts/Offering/"

Get-PnPStorageEntity -Key "CreateOfferSiteUrl"

$folder = Get-PnPFolder -Url "_cts"
Get-PnPFolderItem -FolderSiteRelativeUrl "_cts/Offering"