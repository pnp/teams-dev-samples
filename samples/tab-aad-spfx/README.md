# tab-aad-spfx

## Summary

This sample shows how to write a Teams tab using SharePoint Framework, and to call the Graph API from that tab. The web part is bare bones; all it does is display recent emails in the logged-in user's inbox.

![picture of the app in action](docs/images/tab-aad-spfx.png)

## Frameworks

_Please indicate the SPFx version required_

![SPFx 1.x.0](https://img.shields.io/badge/SPFx-1.11.1-green.svg)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [SPFx Development environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|August 25, 2020|Bob German|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* In the command line run:
  * `npm install`
  * `gulp serve`

_Does your sample work in the offline workbench? In the SharePoint workbench? Are any API permissions required that would need to be approved in the SharePoint admin center?"

## Features

Description of the web part with possible additional details than in short summary. 
This Web Part illustrates the following concepts on top of the SharePoint Framework:

* topic 1
* topic 2
* topic 3

_Below there is a clear image used for telemetry. Please change "readme-template" to your sample name._

<img src="https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/readme-template" />


## tab-aad-spfx

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
