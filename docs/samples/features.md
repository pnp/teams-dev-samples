---
title: Browse by Feature
template: filter.html
filteroptions:
    - name: all
      title: All frameworks
      displayname: All
      filter: '*'
      active: true
    - name: bot
      displayname: Bot
      title: Bot/chatbot
      filter: '[data-feature=''bot'']'
    - name: meetings
      displayname: Meetings
      title: Meetings
      filter: '[data-feature=''meetings'']'
    - name: msgext
      displayname: Messaging extensions
      title: Message extensions
      filter: '[data-feature=''msgext'']'
    # - name: webhook
    #   displayname: Web hook
    #   title: Outgoing web hook
    #   filter: '[data-feature=''webhook'']'
    - name: webhook
      displayname: Tab
      title: Tab
      filter: '[data-feature=''tab'']'
    # - name: taskmodule
    #   displayname: Task module
    #   title: Task module
    #   filter: '[data-feature=''taskmodule'']'      
    - name: other
      title: Other
      filter: '[data-feature=''other'']'   
---

Teams applications can include one or more features such as tabs and bots.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.
