# Description: This script is used to populate the Service Health cache list in SharePoint Online with the latest Service Health announcements.


#--------------------------------------------------------------
# Connect to the SharePoint Online tenant
#--------------------------------------------------------------

# Azure Automation Variables
$settingUrl = Get-AutomationVariable -Name Cfg_CacheSiteUrl
$settingCacheListName =  Get-AutomationVariable -Name Cfg_CacheListName_ServiceHealth

Write-Host "Site: $($settingUrl)"
Write-Host "List: $($settingCacheListName)"

# Connect
Connect-PnPOnline $settingUrl -ManagedIdentity

#--------------------------------------------------------------
# Collect the message centre announcements
#--------------------------------------------------------------

$serviceHealthData = Get-PnPServiceHealthIssue


# Get all the basic record information from SharePoint only selecting key fields for checking
# Check for existing records (checking ID, and if LastUpdatedIsNewer)
$cachedItems = Get-PnPListItem -List $settingCacheListName -PageSize 1500 -Fields "ServiceLastModifiedDateTime","ServiceId","Id"

# Check for existing records (checking ID, and if LastUpdatedIsNewer) also, if there are no records then add them, else update the entry
# There are three scenarios here
#   List Items Exist and MAY need and Update
#   List Items do not exist e.g. fresh list
#   No Updates

# Check for updates
$serviceHealthData | ForEach-Object{

    $healthItem = $_
    # TODO: Check field values here, this is a guess
    $getExistingItem = $cachedItems | Where-Object { $_.FieldValues.ServiceId -eq $healthItem.Id}
    $payload = $healthItem | ConvertTo-Json -Depth 6 -EnumsAsStrings
    
    if($getExistingItem){
        # TODO: Check that date formats align here
        if($getExistingItem.ServiceLastModifiedDateTime -ne $healthItem.LastModifiedDateTime){

            Write-Host "Updating payload item... $($getExistingItem.ServiceId)"
            
            # Update the Item
            Set-PnPListItem -List $settingCacheListName -Identity $getExistingItem.Id -Values @{ 
                "ServiceItemPayload" = $payload; 
                "ServiceLastModifiedDateTime" = $healthItem.LastModifiedDateTime;
                "ServiceEndDate" = $healthItem.EndDateTime;
                "ServiceStatus" = $healthItem.Status.ToString();
                "ServiceStartDate" = $healthItem.StartDateTime;
                "Service" = $healthItem.Service;
                "ServiceFeature" = $healthItem.Feature;
                "ServiceFeatureGroup" = $healthItem.FeatureGroup;
                "ServiceHighImpact" = $healthItem.HighImpact;
                "ServiceClassification" = $healthItem.Classification.ToString();
                "ServiceImpactDescription" = $healthItem.ImpactDescription;
                "ServiceIsResolved" = $healthItem.IsResolved;
            } 
            
            Write-Host "Updated payload item $($getExistingItem.ServiceId)"
        }
    }else{

        Write-Host "Adding payload item... $($healthItem.ServiceId)"

        $list = Get-PnPList -Identity $settingCacheListName
        Write-Host "List ID $($list.Id)"

        Write-Host "Adding values Title: $($healthItem.Title)"

        $updateDate = $healthItem.LastModifiedDateTime
        if(!$updateDate){
            $updateDate = $healthItem.StartDateTime
        }

        $item = Add-PnPListItem -List $list -Values @{ 
            "Title" = $healthItem.Title; 
            "ServiceId" = $healthItem.Id;
            "ServiceStartDate" = $healthItem.StartDateTime;
            "ServiceLastModifiedDateTime" = $updateDate; 
            "ServiceStatus" = $healthItem.Status;
            "Service" = $healthItem.Service;
            "ServiceFeature" = $healthItem.Feature;
            "ServiceFeatureGroup" = $healthItem.FeatureGroup;
            "ServiceIsResolved" = $healthItem.IsResolved;
            "ServiceHighImpact" = $healthItem.HighImpact;
            "ServiceClassification" = $healthItem.Classification;
            "ServiceImpactDescription" = $healthItem.ImpactDescription;
            "ServiceItemPayload" = $payload } -Connection $connection

        Write-Host "Updated payload item $($healthItem.ServiceId)"
    }
}

Write-Host "Done :-)"