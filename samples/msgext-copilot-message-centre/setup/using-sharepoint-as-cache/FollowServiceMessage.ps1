using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

#--------------------------------------------------------------
# Interact with query parameters or the body of the request.
#--------------------------------------------------------------
Write-Host "Request Query: $($Request.Query | ConvertTo-Json)" 
$inputItemId = $Request.Query.ItemId ?? $Request.Body.ItemId
$inputIssueId = $Request.Query.IssueId ?? $Request.Body.IssueId
$inputUserId = $Request.Query.UserId ?? $Request.Body.UserId
$inputIssueType = $Request.Query.IssueType ?? $Request.Body.IssueType

#--------------------------------------------------------------
# Connect to the SharePoint Online tenant
#--------------------------------------------------------------
$settingTenantUrl = $env:Cfg_CacheSiteUrl

if($settingTenantUrl){

    $settingTenantUrl = $env:Cfg_CacheSiteUrl
    Connect-PnPOnline $settingTenantUrl -ManagedIdentity
    $serviceHealthList = $env:Cfg_CacheListName_ServiceHealth
    $serviceAnnounceMessagesList = $env:Cfg_CacheListName_ServiceAnnouncements
    $serviceFollowList = $env:Cfg_CacheListName_ServiceFollow

}else{
    Write-Host "No Environment Variables found...local mode"
    Start-Transcript -Path "FollowServiceMessages.log" 
    # Local Mode
    Connect-PnPOnline https://<tanant>.sharepoint.com/sites/tenant-status -ClientId <client-id> `
     -Thumbprint <Thumbprint> -Tenant pkbmvp.onmicrosoft.com
    
    $inputItemId = "1108"
    $inputIssueId = "TM680191"
    $inputUserId = "d47e12f9-99f3-40ea-8870-7b39d2be92f7"
    $inputIssueType = "health" #or "health" or "announcement"
    $serviceHealthList = "Cache Service Health"
    $serviceAnnounceMessagesList = "Cache Service Announcements"
    $serviceFollowList = "Follow"

    Write-Host "Local Mode: Connected to SharePoint Online..."
    $isLocal = $true
    
    # /End of Local Mode
}

# List out the input parameters and values
Write-Host "Input Filter ItemId: $($inputItemId)"
Write-Host "Input Filter IssueId: $($inputIssueId)"
Write-Host "Input Filter UserId: $($inputUserId)"
Write-Host "Input Filter Issue Type: $($inputIssueType)"

# Two lists in SharePoint are: 
#   Cfg_CacheListName_ServiceHealth
#   Cfg_CacheListName_ServiceAnnouncements
switch ($inputIssueType) {
    "health" { 
        $followedListName = $serviceHealthList
     }
    "announcement" { 
        $followedListName = $serviceAnnounceMessagesList
     }
    Default {
        Write-Host "Invalid Issue Type: $inputIssueType"
        exit        
    }
}

$query = "<View>
            <ViewFields>
                <FieldRef Name='Title'/>                                                                    
                <FieldRef Name='ServiceId'/>                                                             
                <FieldRef Name='ServiceFollowedBy'/>
                <FieldRef Name='ServiceItemId'/>
                <FieldRef Name='ServiceList'/>
                <FieldRef Name='ServiceFollowedByAADId'/>
            </ViewFields>
            <Query>
                <Where>
                    <And>
                        <And>
                            <Eq>
                                <FieldRef Name='ServiceItemId' /><Value Type='Number'>$inputItemId</Value>
                            </Eq>
                            <Eq>
                                <FieldRef Name='ServiceId' /><Value Type='Text'>$inputIssueId</Value>
                            </Eq>
                        </And>
                        <And>
                            <Eq>
                                <FieldRef Name='ServiceList' /><Value Type='Text'>$followedListName</Value>
                            </Eq>
                            <Eq>
                                <FieldRef Name='ServiceFollowedByAADId' /><Value Type='Text'>$inputUserId</Value>
                            </Eq>
                        </And>
                    </And>
                </Where>
            </Query>
        </View>"

$result = Get-PnPListItem -List $serviceFollowList -Query $query
$user = Get-PnPAzureADUser -Identity $inputUserId

Write-Host "Follow Item: $($result)" 
if(!$result -and $user){

    # Added Follow List Item
    $newItem = Add-PnPListItem -List $serviceFollowList -Values @{
        "Title" = "Followed Item"
        "ServiceFollowedBy" = $user.UserPrincipalName
        "ServiceItemId" = $inputItemId
        "ServiceId" = $inputIssueId 
        "ServiceList" = $followedListName
        "ServiceFollowedByAADId" = $inputUserId
    }

    # Update the item with the lookup to this detail
    Set-PnPListItem -List $followedListName -Identity $inputItemId -Values @{
        "ServiceFollowedByLookup" = $newItem.Id
    }

    Write-Host "User is now following this item: $($newItem.Id)"
}else{
    Write-Host "User already following this item"
}

if($isLocal){
    Stop-Transcript
}else{
    # Associate values to output bindings by calling 'Push-OutputBinding'.
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::OK
        Body = $results
    })
}

Write-Host "Done :-)"