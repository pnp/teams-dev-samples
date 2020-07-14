# Metadata Structure

There are too many variations in Teams samples to easily find them through simple navigation. The intention is for people to locate the sample they need through the [Teams Sample Navigator](https://pnp.github.io/teams-dev-samples)

The current solution is driven by a [single YAML file](https://github.com/pnp/teams-dev-samples/blob/Docs/docs/metadataStructure.md) that is maintained manually. Entries in this file are as follows:

~~~YAML

    - name: microsoft-teams-apps-attendance
      title: Attendance App Template
      type: apptemplate, barebones, demo, solution
      features: bot, msgext, tab, taskmodule
      summary: Attendance app is a Power Apps based solution ...
      thumbnail: https://github.com/OfficeDev/microsoft-teams-apps-attendance/wiki/Images/Attendance_Readme_01.png
      url: https://github.com/OfficeDev/microsoft-teams-apps-attendance
      author: Microsoft
      client_language: typescript, javascript, powerapps, powerautomate
      client_platform: spa, spfx, powerapps, powerautomate
      client_ui: react, angularjs, angular, knockout, jquery, vueJS
      server_language: csharp, typescript, javascript, python, java
      server_platform: netcore, express, restify
      server_framework: bot3.x, bot4.x
      modifiedtext: May 14, 2020
      modified: 2020-05-14

~~~
