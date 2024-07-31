
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $false)]
    [string]$ListName = "Product and Services",        
    [Parameter(Mandatory = $true)]
    [string]$CSVPath,        
    [Parameter(Mandatory = $false)]
    [switch] $CreateList,
    [Parameter(Mandatory = $false)]
    [switch] $CleanUp

    
)


# Import the PnP PowerShell module
if (-not (Get-Module -Name PnP.PowerShell -ListAvailable)) {
    Install-Module -Name PnP.PowerShell -Force
}
Import-Module -Name PnP.PowerShell





#Throw error if the CSV file does not exist
if (-not (Test-Path -Path $CSVPath)) {
    Write-Host "CSV file not found at $CSVPath" -ForegroundColor Red
    Exit
}


#Create a function to log section and information messages
Function LogSection ($message) {
    Write-Host ""
    Write-Host "*******[ $($message) ]*******" -ForegroundColor "Black" -BackgroundColor "DarkYellow"
}
Function LogInfo ($message) {
    Write-Host  "[Info] : $($message)" -ForegroundColor "white"
}
Function LogWarning ($message) {
    Write-Host $message -ForegroundColor "yellow"
}
Function LogError ($message) {
    Write-Host $message -ForegroundColor "red"
}
Function LogSuccess ($message) {
    Write-Host $message -ForegroundColor "green"
}


try {
    # FILEPATH: /c:/GitHub/powershell/SPOnline/PNP/List/Create-PnPList.ps1
    Connect-PnPOnline -Url $SiteUrl -Interactive

    # Define the list name
    $listName = $ListName

    # Define the list columns
    $columns = @(
        @{
            DisplayName  = "SKUID"
            InternalName = "SKUID"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Catalogue"
            InternalName = "Catalogue"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Product Name"
            InternalName = "ProductName"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Product Description"
            InternalName = "ProductDescription"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Revenue Type"
            InternalName = "RevenueType"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "P&amp;L Posting Group"
            InternalName = "PLPostingGroup"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Service Area"
            InternalName = "ServiceArea"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Service Group"
            InternalName = "ServiceGroup"
            FieldType    = "Text"
        },
        @{
            DisplayName  = "Service Area Owner"
            InternalName = "ServiceAreaOwner"
            FieldType    = "User"
        }
    )

    
    # Create the list if the $CreateList param is tru
    if ($CreateList -eq $True) {
        New-PnPList -Title $listName -Template GenericList


        # Add the columns to the list
        foreach ($column in $columns) {
            #Log the name of each column as it is added
            LogInfo "Adding column $column to list $listName"
            Add-PnPField -List $listName -DisplayName $column.DisplayName -InternalName $column.InternalName -Type $column.FieldType -AddToDefaultView   

        }   

        # Verify the list and columns were created
        $list = Get-PnPList -Identity $listName
        if ($list) {
            LogSuccess "List $listName created successfully"
        }
        else {
            LogError "Failed to create list $listName"
            Exit
        }
    }

    # If the CleanUp switch is used, remove all items from the list
    if ($CleanUp -eq $True) {
        LogSection "Removing all items from $listName List...."
        Get-PnPListItem -List $listName -PageSize 500 | ForEach-Object {
            Remove-PnPListItem -List $listName -Identity $_.Id -Force
        }
        LogSuccess "Done"
    }

    # Add items to the list from the CSV file
    LogSection "Adding items to $listName List"
    Import-CSV $CSVPath | Foreach-Object {     
        $ItemToInsert = @{
            "Title"              = $_.Title
            "SKUID"              = $_.SKUID
            "Catalogue"          = $_.Catalogue                
            "ProductName"        = $_.ProductName
            "ProductDescription" = $_.ProductDescription
            "RevenueType"        = $_.RevenueType
            "PLPostingGroup"     = $_.PLPostingGroup
            "ServiceArea"        = $_.ServiceArea
            "ServiceGroup"       = $_.ServiceGroup
            "ServiceAreaOwner"   = $_.ServiceAreaOwner                
        }               

        #Log Item to be inserted
        LogInfo "Adding item $($_.Title) to list $listName"
        Add-PnPListItem -List $listName -Values $ItemToInsert                       
    }
}
catch {
    Write-Host "An error occurred: $($_.Exception.Message)" -ForegroundColor Red
}



# Disconnect from SharePoint Online
Disconnect-PnPOnline
