# Description: This script is used to populate the Service Announcements cache list in SharePoint Online with the latest Message Centre announcements.

#--------------------------------------------------------------
# Connect to the SharePoint Online tenant
#--------------------------------------------------------------

# Azure Automation Variables
$settingUrl = Get-AutomationVariable -Name Cfg_CacheSiteUrl
$settingCacheListName = Get-AutomationVariable -Name Cfg_CacheListName_ServiceAnnouncements

Write-Host "Site: $($settingUrl)"
Write-Host "List: $($settingCacheListName)"

# Connect
Connect-PnPOnline $settingUrl -ManagedIdentity

#--------------------------------------------------------------
# Collect the message centre announcements
#--------------------------------------------------------------

$msgCtrAnnounceData = Get-PnPMessageCenterAnnouncement


# Get all the basic record information from SharePoint only selecting key fields for checking
# Check for existing records (checking ID, and if LastUpdatedIsNewer)

$cachedItems = Get-PnPListItem -List $settingCacheListName -PageSize 1000 -Fields "ServiceId","ServiceLastModifiedDateTime","Id"

# Check for existing records (checking ID, and if LastUpdatedIsNewer) also, if there are no records then add them, else update the entry
# There are three scenarios here
#   List Items Exist and MAY need and Update
#   List Items do not exist e.g. fresh list
#   No Updates


# Check for updates
$msgCtrAnnounceData | ForEach-Object{

    $announceItem = $_
    # TODO: Check field values here, this is a guess
    $getExistingItem = $cachedItems | Where-Object { $_.FieldValues.ServiceId -eq $announceItem.Id}
    $payload = $announceItem | ConvertTo-Json -Depth 4 -EnumsAsStrings
    $tagsStringArray = $announceItem.Tags -join ";#"
    $servicesStringArray = $announceItem.Services -join ";#"
    
    if($announceItem.Details){
        $detailsSummary = $announceItem.Details | Where-Object { $_.Name -eq 'Summary' } | Select-Object -ExpandProperty Value -First 1
    }

    if($getExistingItem){
        # TODO: Check that date formats align here
        #if($getExistingItem.ServiceLastModifiedDateTime -ne $announceItem.LastModifiedDateTime){

        Write-Host "Updating payload item... $($getExistingItem.ServiceId)"
        
        Set-PnPListItem -List $settingCacheListName -Identity $getExistingItem.Id -Values @{ 
            "ServiceItemPayload" = $payload; 
            "ServiceEndDate" = $announceItem.EndDateTime;
            "ServiceStartDate" = $announceItem.StartDateTime;
            "ServiceCategory"=    $announceItem.Category.ToString();
            "ServiceServices" = $servicesStringArray;
            "ServiceSeverity" = $announceItem.Severity.ToString();
            "ServiceTags" = $tagsStringArray;
            "ServiceDetailSummary" = $detailsSummary;
            "ServiceLastModifiedDateTime" = $announceItem.LastModifiedDateTime } 
        
        Write-Host "Updated payload item $($getExistingItem.ServiceId)"
        #}
    }else{

        Write-Host "Adding payload item... $($announceItem.ServiceId)"

        $connection = Get-PnPConnection

        # Not Found  
        $list = Get-PnPList -Identity $settingCacheListName
        Write-Host "List ID $($list.Id)"

        Write-Host "Adding values Title: $($announceItem.Title)"

        $updateDate = $announceItem.LastModifiedDateTime
        if(!$updateDate){
            $updateDate = $announceItem.StartDateTime
        }

        $item = Add-PnPListItem -List $list -Values @{ 
            "Title" = $announceItem.Title; 
            "ServiceId" = $announceItem.Id; 
            "ServiceLastModifiedDateTime" = $updateDate; 
            "ServiceStartDate" = $announceItem.StartDateTime;
            "ServiceEndDate" = $announceItem.EndDateTime;
            "ServiceCategory"=    $announceItem.Category.ToString();
            "ServiceServices" = $servicesStringArray;
            "ServiceSeverity" = $announceItem.Severity.ToString();
            "ServiceTags" = $tagsStringArray;
            "ServiceDetailSummary" = $detailsSummary;
            "ServiceItemPayload" = $payload } -Connection $connection

        Write-Host "Updated payload item $($announceItem.ServiceId)"
    }
}


Write-Host "Done :-)"