using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

#--------------------------------------------------------------
# Interact with query parameters or the body of the request.
#--------------------------------------------------------------
Write-Host "Request Query: $($Request.Query | ConvertTo-Json)" 

$hasInputResultMaxParameters = $true
$inputResultsMax = 5 # default value

$inputFilterId = $Request.Query.SearchId ?? $Request.Body.SearchId
$inputFilterWorkload = $Request.Query.SearchWorkload ?? $Request.Body.SearchWorkload
$inputFilterQuery = $Request.Query.SearchQuery ?? $Request.Body.SearchQuery
$inputFilterSearchType = $Request.Query.SearchType ?? $Request.Body.SearchType

#--------------------------------------------------------------
# Connect to the SharePoint Online tenant
#--------------------------------------------------------------
$settingTenantUrl = $env:Cfg_CacheSiteUrl

if($settingTenantUrl){

    $settingTenantUrl = $env:Cfg_CacheSiteUrl
    Connect-PnPOnline $settingTenantUrl -ManagedIdentity
    $serviceHealthList = $env:Cfg_CacheListName_ServiceHealth
    $serviceAnnounceMessagesList = $env:Cfg_CacheListName_ServiceAnnouncements

}else{
    Write-Host "No Environment Variables found...local mode"

    Start-Transcript "FindSPCachedMessages.log"
    # Local Mode
    Connect-PnPOnline https://tenant.sharepoint.com/sites/tenant-status -ClientId <client-id> `
    -Thumbprint <thumbprint> -Tenant tenant.onmicrosoft.com

    #$inputFilterId = ""
    #$inputFilterWorkload = ""
    #$inputFilterQuery = ""
    #$inputFilterSearchType = "StayInformed"
    $inputResultsMax = 3
    $serviceHealthList = "Cache Service Health"
    $serviceAnnounceMessagesList = "Cache Service Announcements"

    Write-Host "Local Mode: Connected to SharePoint Online..."
    $isLocal = $true
    
    # /End of Local Mode
}

# List out the input parameters and values
Write-Host "Input Filter ID: $($inputFilterId)"
Write-Host "Input Filter Workload: $($inputFilterWorkload)"
Write-Host "Input Filter Query: $($inputFilterQuery)"
Write-Host "Input Filter Search Type: $($inputFilterSearchType)"

# Two lists in SharePoint are: 
#   Cfg_CacheListName_ServiceHealth
#   Cfg_CacheListName_ServiceAnnouncements

#--------------------------------------------------------------
# Collect the service health messages
#--------------------------------------------------------------
$serviceHealthMessages = @()

# This can be optimised with batching and caml queries
$healthData = Get-PnPListItem -List $serviceHealthList -Fields "ServiceId", "Title", "ServiceStatus", "Service", "ServiceFeature", "ServiceFeatureGroup", "ServiceHighImpact", "ServiceStartDate", "ServiceEndDate", "ServiceLastModifiedDateTime", "ServiceImpactDescription", "ServiceIsResolved", "ServiceFollowedByLookup"

if($inputFilterId){
    Write-Host "Using input id filter for Service Health ID..."
    $filteredHealthData = $healthData | Where-Object { 
        $_.FieldValues.ServiceId -eq $inputFilterId
    }
}elseif($inputFilterWorkload){
    Write-Host "Using input workload filter for Service Health Workload..."
    $filteredHealthData = $healthData | Where-Object { 
        $_.FieldValues.Service -like "*$inputFilterWorkload*"
    }
}elseif($inputFilterQuery){
    Write-Host "Using input query filter for Service Health..."
    $filteredHealthData = $healthData | Where-Object { 
        ($_.FieldValues.ServiceId -like "*$inputFilterQuery*" -or
        $_.FieldValues.Title -like "*$inputFilterQuery*" -or 
        $_.FieldValues.Service -like "*$inputFilterQuery*" -or 
        $_.FieldValues.ServiceFeature -like "*$inputFilterQuery*" -or 
        $_.FieldValues.ServiceFeatureGroup -like "*$inputFilterQuery*" -or 
        $_.FieldValues.ImpactDescription -like "*$inputFilterQuery*") -and 
        $_.FieldValues.IsResolved -eq $false 
    }
}else{
    Write-Host "No filters applied, returning all Service Health messages..."
    $filteredHealthData = $healthData | Where-Object { $_.FieldValues.ServiceIsResolved -eq $false }
}

# Trim the results to the maximum number of records
if($hasInputResultMaxParameters){
    $filteredHealthData = $filteredHealthData | Sort-Object -Property ServiceLastModifiedDateTime -Descending | Select-Object -First $inputResultsMax
}

# Format the results
$filteredHealthData | ForEach-Object{
    
    $issue = $_

    if($issue.FieldValues.ServiceFollowedByLookup -ne $null){
        $followedBy = $issue.FieldValues.ServiceFollowedByLookup.LookupValue
    }
    
    $serviceHealthMessages += [PSCustomObject]@{
        "Id" = $issue.FieldValues.ServiceId
        "Title" = $issue.FieldValues.Title
        "Status" = $issue.FieldValues.ServiceStatus
        "Service" = $issue.FieldValues.Service
        "Feature" = $issue.FieldValues.ServiceFeature
        "FeatureGroup" = $issue.FieldValues.ServiceFeatureGroup
        "HighImpact" = $issue.FieldValues.ServiceHighImpact
        "ImpactDescription" = $issue.FieldValues.ServiceImpactDescription
        "StartDateTime" = $issue.FieldValues.ServiceStartDate
        "EndDateTime" = $issue.FieldValues.ServiceEndDate
        "IsResolved" = $issue.FieldValues.ServiceIsResolved
        "LastModifiedDateTime" = $issue.FieldValues.ServiceLastModifiedDateTime
        "FollowedBy" = $followedBy
        "ItemId" = $issue.FieldValues.ID
    }
}

#--------------------------------------------------------------
# Collect the message centre announcements
#--------------------------------------------------------------

$messageCentreAnnouncements = @()
# Get-PnPMessageCenterAnnouncement
$msgCtrAnnounceData = Get-PnPListItem -List $serviceAnnounceMessagesList -Fields "ServiceId", "Title", "ServiceServices", "ServiceDetails", "ServiceTags", "ServiceIsMajorChange", "ServiceStartDate", "ServiceEndDate", "ServiceLastModifiedDateTime",
"ServiceDetailSummary", "ServiceCategory", "ServiceFollowedByLookup"

$filteredMsgCtrAnnounceData = $msgCtrAnnounceData

if($inputFilterId){
    Write-Host "Using input id filter for Message Centre Announcements..."
    $filteredMsgCtrAnnounceData = $msgCtrAnnounceData | Where-Object { $_.FieldValues.ServiceId -eq $inputFilterId }
} elseif($inputFilterWorkload){
    Write-Host "Using input workload filter for Message Centre Announcements..."
    $filteredMsgCtrAnnounceData = $msgCtrAnnounceData | Where-Object { $_.FieldValues.ServiceServices -contains $inputFilterWorkload }
}
elseif($inputFilterQuery){
    Write-Host "Using input query filter for Message Centre Announcements..."
    $filteredMsgCtrAnnounceData = $msgCtrAnnounceData | Where-Object {
        $_.FieldValues.ServiceId -like "*$inputFilterQuery*" -or
        $_.FieldValues.Title -like "*$inputFilterQuery*" -or
        $_.FieldValues.ServiceServices -like "*$inputFilterQuery*" -or
        $_.FieldValues.Details -like "*$inputFilterQuery*" -or
        $_.FieldValues.Body.Content -like "*$inputFilterQuery*"
    }
}

# Trim the results to the maximum number of records
if($hasInputResultMaxParameters){
    $filteredMsgCtrAnnounceData = $filteredMsgCtrAnnounceData | Sort-Object -Property LastModifiedDateTime -Descending | Select-Object -First $inputResultsMax
}

# Format the results
$filteredMsgCtrAnnounceData | ForEach-Object{
    $announcement = $_

    if($announcement.FieldValues.ServiceFollowedByLookup -ne $null){
        $followedBy = $announcement.FieldValues.ServiceFollowedByLookup.LookupValue
    }

    $messageCentreAnnouncements += [PSCustomObject]@{
        "Id" = $announcement.FieldValues.ServiceId
        "Title" = $announcement.FieldValues.Title
        "Services" = $announcement.FieldValues.ServiceServices
        "Details" = $announcement.FieldValues.ServiceDetails
        "Tags" = $announcement.FieldValues.ServiceTags
        "IsMajorChange" = $announcement.FieldValues.ServiceIsMajorChange
        "StartDateTime" = $announcement.FieldValues.ServiceStartDate
        "EndDateTime" = $announcement.FieldValues.ServiceEndDate
        "LastModifiedDateTime" = $announcement.FieldValues.ServiceLastModifiedDateTime
        "DetailSummary" = $announcement.FieldValues.ServiceDetailSummary
        "Category" = $announcement.FieldValues.ServiceCategory
        "FollowedBy" = $followedBy
        "ItemId" = $announcement.FieldValues.ID
    }
}

#------------------------------------------------------------------------------------------
# Output the results for both service health messages and message centre announcements
#------------------------------------------------------------------------------------------

$statusReport = [PSCustomObject]@{
    "ServiceHealthMessages" = $serviceHealthMessages
    "MessageCentreAnnouncements" = $messageCentreAnnouncements
}

# Convert to friendly JSON format
$results = $statusReport | ConvertTo-Json -Depth 6 -EnumsAsStrings

if($isLocal){
    Write-Host "Results: $($results.length)"
    Stop-Transcript
    
}else{
    # Associate values to output bindings by calling 'Push-OutputBinding'.
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::OK
        Body = $results
    })
}


Write-Host "Done :-)"