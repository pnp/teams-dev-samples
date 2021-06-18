---
title: Browse by Capability
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

Teams applications can include one or more capabilities:

 * Bot - A conversational user interface that interacts with users in the Teams chat user interface
 * Meetings - An application that can interact with users attending a Teams meeting
 * Messaging extensions, which allow you to add to the Teams command bar, compose box, and context menus
 * Tab - A visual user interface implemented as a web page running in an IFrame
 * Other capabilities include connectors (configurable services that can send notifications to Teams channels), task modules (modal dialog boxes) and webhooks (a simplified way for users in a Teams channel to send messages to a web service)


