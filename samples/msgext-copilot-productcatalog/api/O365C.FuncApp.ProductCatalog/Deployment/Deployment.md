## Publishing to Azure

#### Publish Option: Deploy from the command line

1. From a command prompt, in the root folder of the project, run the following command:
    ```
    dotnet publish -c Release
    ```

2. It will be necessary to have authenticated to Azure and have selected the correct subscription. 
    - Use `az login` to accomplish this and `az account show` to verify the subscription. 
    - To select a subscription, `az account set --subscription targetsubscription` will change it.

3. From the same command prompt, navigate to the following folder:
    ```
    O365C.FuncApp.ProductCatalog\bin\Release\net8.0\publish
    ```

4. Compress the content of the publish folder if necessary into a zip file called `publish.zip`.

5. Now run the following command: **Replace the `appServiceName` and `resourceGroupName` with the appropriate values**. 
    ```
    az webapp deployment source config-zip --src publish.zip -n "appServiceName" -g "resourceGroupName"
    ```