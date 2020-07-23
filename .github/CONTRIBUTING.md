# Contribution Guidance

This repository is for Microsoft Teams application samples from the community. Please consider contributing a sample to share your learnings and ideas!

Before contributing, however, please read the following guidelines. 

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

Remember that this repository is maintained by community members who volunteer their time to help. Be courteous and patient.

## Typos, Issues, Bugs, and contributions

Whenever you are submitting any changes to the PnP repositories, please follow these recommendations.

* Always fork the repository to your own Github account before making your modifications
* Do not combine multiple changes to one pull request. For example, submit any samples and documentation updates using separate PRs
* If your pull request shows merge conflicts, make sure to update your forked branch to be a mirror of  the master branch of the main repo before making your modifications
* If you are submitting multiple samples, please create a specific PR for each of them
* If you are submitting typo or documentation fix, you can combine modifications to single PR where suitable

If you find an existing sample which is similar to yours, please extend the existing one rather than submitting a new similar sample. When you update existing samples, please update also `README.md` file accordingly with information on provided changes and with your author details.

## Sample Naming and Structure

New sample submissions must follow these naming and structure guidelines:

### 1. Folder

Each sample should be in its own folder within the /samples directory. Your folder name should include a prefix depending on the type of sample, as follows:

| Prefix | Description |
| --- | --- |
| app- | These are samples of apps that have multiple features such as a tab and a bot |
| bot- | These are simple bots, intended to show a single capability or pattern |
| msgext- | These are simple messaging extensions, intended to show a single capability or pattern |
| tabs- | These are simple tabs, intended to show a single capability or pattern |

### 2. README.md file

Your sample folder should contain a `README.md` file for your contribution. Please base your `README.md` file on one of the following templates:

| If your sample is | use this template |
| --- | --- |
| a Single Page application | [README.md]() |
| a Power App | [README.md]() |
| a SharePoint Framework solution | [README.md]() |
| a Web service based on .NET | [README.md]() |
| a Web service based on nodeJS | [README.md]() |
| something else | please modify one of the above that seems close to your scenario |

Please copy the template to your project and update it accordingly. Your `README.md` must be named exactly `README.md` -- with capital letters -- as this is the information we use to make your sample public.

Each README.md file must contain detailed build and use instructions.

### 3. Screen shot

You will need to have a screenshot picture of your sample in action in the `README.md` file ("pics or it didn't happen"). The preview image must be located in the `/assets/` folder in the root your you solution. Even if it's a simple bot sending a single chat message, please include a screen shot!

### 4. Teams manifest

Your sample should include a folder called "Manifest" containing a Teams `manifest.json` file and well-formed Teams application icons. 

 * If the manifest works as-is, you may optionally include an installable Teams application package (zip archive containing these files).
 * If the `manifest.json` requires modification before use, please do not include a zip archive. Instead, include instructions in your `README.md` file explaining how to modify the manifest and create the Teams application package

### 5. Telemetry

The `README` template contains a specific tracking image at the bottom of the file with an `img` tag, where the `src` attribute points to `https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/readme-template`. This is a transparent image which is used to track viewership of individual samples in GitHub.

Update the image `src` attribute according with the repository name and folder information. For example, if your sample is named `react-todo` in the `samples` folder, you should update the `src` attribute to `https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/react-todo`

## Submitting Pull Requests

Here's a high-level process for submitting new samples or updates to existing ones.

1. Sign the Contributor License Agreement (see below)
2. Fork this repository [PnP/teams-dev-samples](https://github.com/PnP/teams-dev-samples) to your GitHub account
3. Ensure the master branch is up-to-date with the PnP version (if you didn't just fork it). Create a new branch from the `master` branch in your fork for the contribution
4. Include your changes to your branch
5. Commit your changes using descriptive commit message. 
6. Create a pull request in your own fork and target the `master` branch in the PnP version
7. Fill up the provided PR template with the requested details

Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/PnP/teams-dev-samples/pulls) for an open or closed Pull Request which relates to your submission. You don't want to duplicate effort.

* Make sure you have a link in your local cloned fork to the [PnP/teams-dev-samples](https://github.com/PnP/teams-dev-samples):

  ```shell
  # check if you have a remote pointing to the Microsoft repo:
  git remote -v

  # if you see a pair of remotes (fetch & pull) that point to https://github.com/SPnP/teams-dev-samples, you're ok... otherwise you need to add one

  # add a new remote named "upstream" and point to the Microsoft repo
  git remote add upstream https://github.com/PnP/teams-dev-samples.git
  ```

* Make your changes in a new git branch:

  ```shell
  git checkout -b mysamplebranch master
  ```

* Ensure your fork is updated and not behind the upstream **teams-dev-samples** repo. Refer to these resources for more information on syncing your repo:

  * [GitHub Help: Syncing a Fork](https://help.github.com/articles/syncing-a-fork/)
  * [Keep Your Forked Git Repo Updated with Changes from the Original Upstream Repo](http://www.andrewconnell.com/blog/keep-your-forked-git-repo-updated-with-changes-from-the-original-upstream-repo)
  * For a quick cheat sheet:

    ```shell
    # assuming you are in the folder of your locally cloned fork....
    git checkout master

    # assuming you have a remote named `upstream` pointing official **sp-dev-fx-webparts** repo
    git fetch upstream

    # update your local master to be a mirror of what's in the main repo
    git pull --rebase upstream master

    # switch to your branch where you are working, say "react-taxonomypicker"
    git checkout react-taxonomypicker

    # update your branch to update it's fork point to the current tip of master & put your changes on top of it
    git rebase master
    ```

* Push your branch to GitHub:

  ```shell
  git push origin react-taxonomypicker
  ```

## Merging your Existing GitHub Projects with this Repository

If the sample you wish to contribute is stored in your own GitHub repository, you can use the following steps to merge it with this repository:

* Fork the `teams-dev-samples` repository from GitHub
* Create a local git repository

    ```shell
    md teams-dev-samples
    cd teams-dev-samples
    git init
    ```

* Pull your forked copy of `teams-dev-samples` into your local repository

    ```shell
    git remote add origin https://github.com/yourgitaccount/teams-dev-samples.git
    git pull origin master
    ```

* Pull your other project from GitHub into the `samples` folder of your local copy of `teams-dev-samples`

    ```shell
    git subtree add --prefix=samples/projectname https://github.com/yourgitaccount/projectname.git master
    ```

* Push the changes up to your forked repository

    ```shell
    git push origin master
    ```

## Signing the CLA

Before we can accept your pull requests you will be asked to sign electronically Contributor License Agreement (CLA), which is a pre-requisite for any contributions all PnP repositories. This will be one-time process, so for any future contributions you will not be asked to re-sign anything. After the CLA has been signed, our PnP core team members will have a look at your submission for a final verification of the submission. Please do not delete your development branch until the submission has been closed.

You can find Microsoft CLA from the following address - https://cla.microsoft.com.

Thank you for your contribution.

> Sharing is caring.