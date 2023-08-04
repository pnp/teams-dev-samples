# Contribution Guidance

This repository is for Microsoft Teams application samples from the community. Please consider contributing a sample to share your learnings and ideas!

Before contributing, however, please read the following guidelines. 

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

Remember that this repository is maintained by community members who volunteer their time to help. Please be courteous and patient.

## How to submit or update a sample

If you're new to Github and open source, a good place to start is with a [Sharing is Caring session](https://pnp.github.io/sharing-is-caring/). These are small group sessions that aren't recorded and where no question is too basic. During the session you'll learn how to fork a Github repo, add or modify some content, and submit a pull request (PR). These sessions are a lot of fun and everyone is invited!

Once you know the basics, here are the guidelines for submitting to the repo:

* Always fork the repository to your own Github account before making your modifications
* If your pull request shows merge conflicts, make sure to update your forked branch to be a mirror of  the main branch of the main repo before making your modifications. 
* If you are submitting multiple samples, please create a specific PR (from a different branch in your forked repository) for each of them
* If you are submitting typo or documentation fixes, you can combine modifications to single PR where suitable

If you find an existing sample which is similar to yours, please extend the existing one rather than submitting a new similar sample. When you update existing samples, please also update the `README.md` file accordingly with information on provided changes and with your author details.

If you use 3rd party libraries, please make sure that library license allows distributions of it as part of your sample. 

Please be sure to note all the prerequisites for your sample, including all the tools and services required to build and run the sample.

* If your sample requires a licensed service, please be sure to make that clear and note the service required (such as access to a premium feature or AI model).
* If your sample requires specific tools or libraries, be sure to state the version and URL
* If your sample requires multiple tools - such as a Teams tab built with VS Code that's backed by an Azure function project in Visual Studio, please be sure to list _all_ the tools and build steps.

## Sample Naming and Structure

New sample submissions must follow these naming and structure guidelines:

### 1. Folder

Each sample should be in its own folder within the /samples directory. Your folder name should include a prefix depending on the type of sample, as follows:

| Prefix | Description |
| --- | --- |
| app- | These are samples of apps that have multiple Teams app capabilities such as a tab and a bot |
| bot- | These are apps that contain a chatbot for use in Teams |
| msgext- | These are apps that contain one or more messaging extensions, including link unfurling, search, and action message extensions |
| tabs- | These are apps that contain one or more tabs, including personal, group, channel, and meeting tabs |

### 2. README.md file

Your sample folder should contain a `README.md` file for your contribution. Please base your `README.md` file on one of the following templates:

| If your sample is | use this template |
| --- | --- |
| built with Teams Toolkit for VS Code | [README.md](/samples/_SAMPLE_templates/ttk-vs-code-sample/README.md) |
| built with Teams Toolkit for Visual Studio | [README.md](/samples/_SAMPLE_templates/ttk-vs-sample/README.md) |
| built with yo teams | [README.md](/samples/_SAMPLE_templates/yoteams-sample/README.md) |
| a SharePoint Framework solution | [README.md](/samples/_SAMPLE_templates/spfx-sample/README.md) |
| a Single Page application built with other tools | [README.md](/samples/_SAMPLE_templates/spa-sample/README.md) |
| a Web service based on .NET | [README.md](/samples/_SAMPLE_templates/dotnet-sample/README.md) |
| a Web service based on nodeJS | [README.md](/samples/_SAMPLE_templates/node-sample/README.md) |
| something else | [README.md](/samples/_SAMPLE_templates/any-sample/README.md) |

Please copy the template to your project and update it accordingly. Your `README.md` must be named exactly `README.md` -- with capital letters -- as this is the information we use to make your sample public.

Each README.md file must contain detailed build and use instructions.

### 3. .gitignore

The [.gitignore](https://git-scm.com/docs/gitignore) file controls which files are ignored, to prevent checking in files that are part of packages and other files generated at build time.

Since the samples are built with a variety of toolchains, it is not possible to have a global .gitignore file that will work with all of them. So please be sure to include a .gitignore file in your sample folder that will ignore anything that will be downloaded or created locally when building  your solution.

| If your sample is | sample gitignore |
| --- | --- |
| built with Teams Toolkit | no sample needed - file is generated by Teams Toolkit |
| built with yo teams | no sample needed - file is generated by Teams Toolkit |
| a SharePoint Framework solution | [.gitignore](/samples/_SAMPLE_templates/spfx-sample/.gitignore) |
| a Single Page application | You may find [these samples](https://github.com/github/gitignore) to be helpful |
| a Web service based on .NET | [.gitignore](/samples/_SAMPLE_templates/dotnet-sample/.gitignore) |
| a Web service based on nodeJS | [.gitignore](/samples/_SAMPLE_templates/node-sample/.gitignore) |
| something else | You may find [these samples](https://github.com/github/gitignore) to be helpful |

This is also a good time to check to make sure you have removed any secrets or tenant-specific settings from your sample such as application IDs and secrets.

### 4. Handling environment variables

Environment variables are often stored in files such as .env, .env.local, or appSettings.json. Consider adding these files to your .gitignore, and providing sample files instead, with instructions in the README.md file to copy and fill them in. That way you'll prevent others from accidentally checking in their secrets as well.

If your project is built using [Teams Toolkit for Visual Studio Code](https://aka.ms/teams-toolkit), please clear out values in your .env files that are assigned by Teams Toolkit. 


For example, you might put **.env.local** and **.env.local.user** in **.gitignore**, and provide a sample files instead. **.env.local.sample** might look like this:

```text
# Generated during provision
BOT_ID=
TEAMS_APP_ID=
BOT_DOMAIN=
BOT_ENDPOINT=

# Set by the developer
OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=text-davinci-03
```

and a sample secrets file called **.env.local.user.sample** might look like this:

```text
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The instructions would tell developers to copy the **.env.local.sample** to a new file **.env.local**, and to also copy **.env.local.user.sample** to **.env.local.user**, and then to fill in certain values.

Notice that:

 * Values generated by Teams Toolkit, such as BOT_ID, are blank. Teams Toolkit will generate new values and fill them in during provisioning.
 * Values that are likely to work for all developers are filled in, and
 * Values to be provided manually by each developer are shown with the details removed to convey the format while not revealing the sample author's personal settings.

### 5. Screen shot

You will need to have a screenshot picture of your sample in action in the `README.md` file ("pics or it didn't happen"). This is manditory since we've found that users tend not to try samples that lack a screen shot. Please use a standard format such as .png, .jpg, or .gif for your screen shot so it will work in various places, such as in the [sample browser](https://adoption.microsoft.com/en-us/sample-solution-gallery/){target=_blank}. Animated .png or .gif files are welcome.

The preview image must be located in the `/assets/` folder in the root your solution. Even if it's a simple bot sending a single chat message, please include a screen shot!

### 6. Teams manifest

Your sample should include a clearly marked folder containing a Teams `manifest.json` file and well-formed Teams application icons. 

 * If the manifest works as-is, you may optionally include an installable Teams application package (zip archive containing these files).

 * If the `manifest.json` requires modification before use, please do not include a zip archive. Instead, include instructions in your `README.md` file explaining how to modify the manifest and create the Teams application package

### 7. Telemetry

Each `README` template contains a specific tracking image at the bottom of the file with an `img` tag, where the `src` attribute points to `https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/xxx`. This is a transparent image which is used to track viewership of individual samples in GitHub. We only count the number of times each page is accessed, and capture no personal information or correlation with other pages.

Please update the image `src` attribute according with the repository name and folder information. For example, if your sample is named `bot-todo` in the `samples` folder, you should update the `src` attribute to `https://m365-visitor-stats.azurewebsites.net/sp-dev-fx-webparts/samples/bot-todo`.

## Detailed steps for submitting pull requests

Here's a high-level process for submitting new samples or updates to existing ones.

1. Sign the Contributor License Agreement (see below)
2. Fork this repository [PnP/teams-dev-samples](https://github.com/PnP/teams-dev-samples) to your GitHub account
3. Ensure the main branch is up-to-date with the PnP version (if you didn't just fork it). Create a new branch from the `main` branch in your fork for the contribution
4. Include your changes to your branch
5. Commit your changes using descriptive commit message. 
6. Create a pull request for your fork and branch, and target the `main` branch in the PnP version
7. Fill up the provided PR template with the requested details

Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/PnP/teams-dev-samples/pulls) for an open or closed Pull Request which relates to your submission. You don't want to duplicate effort.

* Make sure you have a link in your local cloned fork to the [PnP/teams-dev-samples](https://github.com/PnP/teams-dev-samples):

  ```shell
  # check if you have a remote pointing to the Microsoft repo:
  git remote -v

  # if you see a pair of remotes (fetch & pull) that point to https://github.com/pnp/teams-dev-samples, you're ok... otherwise you need to add one

  # add a new remote named "upstream" and point to the Microsoft repo
  git remote add upstream https://github.com/PnP/teams-dev-samples.git
  ```

* Make your a new git branch in your local git repo:

  ```shell
  git checkout -b mysamplebranch main
  ```

* Ensure your fork is updated and not behind the upstream **teams-dev-samples** repo. Refer to these resources for more information on syncing your repo:

  * [GitHub Help: Syncing a Fork](https://help.github.com/articles/syncing-a-fork/)
  * [Keep Your Forked Git Repo Updated with Changes from the Original Upstream Repo](http://www.andrewconnell.com/blog/keep-your-forked-git-repo-updated-with-changes-from-the-original-upstream-repo)
  * For a quick cheat sheet:

    ```shell
    # assuming you are in the folder of your locally cloned fork....
    git checkout main

    # assuming you have a remote named `upstream` pointing official **sp-dev-fx-webparts** repo
    git fetch upstream

    # update your local main to be a mirror of what's in the main repo
    git pull --rebase upstream main

    # switch to your branch where you are working, say "react-taxonomypicker"
    git checkout react-taxonomypicker

    # update your branch to update it's fork point to the current tip of main & put your changes on top of it
    git rebase main
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
    git pull origin main
    ```

* Pull your other project from GitHub into the `samples` folder of your local copy of `teams-dev-samples`

    ```shell
    git subtree add --prefix=samples/projectname https://github.com/yourgitaccount/projectname.git main
    ```

* Push the changes up to your forked repository

    ```shell
    git push origin main
    ```

## Signing the CLA

Before we can accept your pull requests you will be asked to sign electronically Contributor License Agreement (CLA), which is a pre-requisite for any contributions all PnP repositories. This will be one-time process, so for any future contributions you will not be asked to re-sign anything. After the CLA has been signed, our PnP core team members will have a look at your submission for a final verification of the submission. Please do not delete your development branch until the submission has been closed.

You can find Microsoft CLA from the following address - https://cla.microsoft.com.

Thank you for your contribution.

> Sharing is caring.