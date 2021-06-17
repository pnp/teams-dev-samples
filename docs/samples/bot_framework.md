---
title: Browse by Bot Framework Version
template: filter.html
filteroptions:
    - name: all
      title: All frameworks
      displayname: All
      filter: '*'
      active: true
    - name: bot46
      title: Bot Framework 4.6+
      displayname: 4.6+
      filter: '[data-bot-framework=''bot46'']'
    - name: bot40
      displayname: 4.0 - 4.5
      title: Bot Framework 4.0 - 4.5
      filter: '[data-bot-framework=''bot46'']'
    - name: bot4beta
      title: Bot Framework 4 Beta
      displayname: 4 Beta
      filter: '[data-bot-framework=''bot4beta'']'
    - name: bot3
      displayname: 3.x
      title: Bot Framework 3.x
      filter: '[data-bot-framework=''bot3'']'
---

Teams bots generally use the Bot Framework SDK (the alternative is to handle all the REST calls to the Bot Channel Service in your code).

Note that **Bot Framework SDK v4 is not backward compatible with v3**, which is no longer supported. Because of these breaking changes, the bot samples are tagged as follows:

 * __Bot Framework 4.6+:__ Bot uses Bot Framework SDK 4.6 or greater, which provides supported access to Teams bot activities (strongly recommended)
 * __Bot Framework 4.0-4.5:__ Bot uses Bot Framework SDK 4.0-4.5, before it officially supported Teams, so Teams messages are handled directly in the code
 * __Bot Framework 4 Beta:__ Bot uses Bot Framework SDK 4.0-4.5 with a deprecated beta of early Teams support. This may work but is not recommended
 * __Bot Framework 3.x:__ Bot uses the previous Bot Framework SDK which is not forward compatible with the current version. These bots should continue to work because the underlying REST calls did not change, but the SDK is no longer supported and is not recommended for new projects

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.
