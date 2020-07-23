# Metadata Structure

There are too many variations in Teams samples to easily find them through simple navigation. The intention is for people to locate the sample they need through the [Teams Sample Navigator](http://aka.ms/pnpteams)

This page describes the metadata that makes the Sample Navigator work. Each sample should be in its own folder with a README.md file that begins with the metadata in YAML format. Here is the entire YAML structure, with all the value options shown. Simply paste it to the top of your README.md file and delete the options that don't apply.

~~~YAML
---
page_type: sample
products:
- teams
languages:
- csharp
- java
- javascript
- powerapps
- powerautomate
- python
- typescript
extensions:
  contentType: samples
  app_features:
  - Bot
  - Connector
  - Messaging Extension
  - Tab
  - Task Module
  technologies:
  - AngularJS
  - Angular
  - Bot Framework SDK v3
  - Bot Framework SDK v4
  - jQuery
  - Knockout
  - React
  - VueJS
  platforms:
  - ASP.NET Core MVC
  - Express
  - None
  - Restify
  - SPFx
  origin:
  - Community
  - Microsoft
createdDate: 5/1/2019 12:00:00 AM
---
~~~

## Key to Metadata

#### page_type

In this repo, should always be "sample"

### products

In this repo, should always be "teams"

### languages

One or more languages may be used in solutions, including:

- csharp
- java
- javascript
- powerapps
- powerautomate
- python
- typescript

### extensions:contentType

In this repo, should always be "samples"

### extensions:app_features

One or more Teams application features included in the sample:

  - Bot
  - Connector
  - Messaging Extension
  - Tab
  - Task Module

### extensions:technologies

One or more frameworks or libraries used in the sample:

  - AngularJS
  - Angular
  - Bot Framework SDK v3
  - Bot Framework SDK v4
  - React
  - VueJS

### extensions:platforms

One or more service platforms required by the solutions. This may include REST API service platforms, web server platforms, and hosted platforms like Power Apps, Power Automate, or SharePoint.

  - ASP.NET Core MVC
  - Express
  - None
  - PowerApps
  - PowerAutomate
  - Restify
  - SPFx

### extensions:origin

In the samples folder of this repo, should always be set to "Community"

### createdDate

The date the sample was created, in US style 

~~~JSON
  m/d/yyyy hh:mm:ss AM/PM
~~~

such as 5/1/2019 12:00:00 AM
