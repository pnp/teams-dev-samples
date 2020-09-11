# Microsoft Teams Development Samples
## Browse by Bot Framework Version

Teams bots generally use the Bot Framework SDK (the alternative is to handle all the REST calls to the Bot Channel Service in your code).

Note that **Bot Framework SDK v4 is not backward compatible with v3**, which is no longer supported. Because of these breaking changes, the bot samples are tagged as follows:

 * __Bot Framework 4.6+:__ Bot uses Bot Framework SDK 4.6 or greater, which provides supported access to Teams bot activities (strongly recommended)
 * __Bot Framework 4.0-4.5:__ Bot uses Bot Framework SDK 4.0-4.5, before it officially supported Teams, so Teams messages are handled directly in the code
 * __Bot Framework 4 Beta:__ Bot uses Bot Framework SDK 4.0-4.5 with a deprecated beta of early Teams support. This may work but is not recommended
 * __Bot Framework 3.x:__ Bot uses the previous Bot Framework SDK which is not forward compatible with the current version. These bots should continue to work because the underlying REST calls did not change, but the SDK is no longer supported and is not recommended for new projects

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='bot46']" title="Uses Bot Framework 4.x (recommended)">Bot Framework 4.6+</button>
    <button class="button" data-filter="[data-facet*='bot40']" title="Uses early Bot Framework 4.x before Teams was supported">Bot Framework 4.0-4.5</button>
    <button class="button" data-filter="[data-facet*='bot4beta']" title="Uses early Bot Framework 4.x with deprecated Teams beta SDK">Bot Framework 4 Beta</button>
    <button class="button" data-filter="[data-facet*='bot3']" title="Uses Bot Framework 3.x">Bot Framework 3.x</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.bot_framework}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
  <div class="sample">
    <div class="sample-video"><i class="ms-Icon ms-Icon--VideoSolid" aria-hidden="true"></i></div>
    <div class="sample-img">
      <a class="sample-link"
        href="{{sample.url}}"
        title="{{sample.summary}}">
        <picture>
          <img src="../../img/thumbnails/{{ sample.name }}.png" width="302" alt="{{sample.name}}" data-fullsize="{{sample.thumbnail}}" data-orig="../../img/thumbnails/{{ sample.name }}.png"/>
        </picture>
      </a>
    </div>
  </div>
  <a href="{{sample.url}}"
     title="{{ sample.summary }}">
    <div class="sample-activity">
      <div class="name">{{sample.title}}</div>
      <span class="author" title="{{ sample.author }}">{{ sample.author }}</span>
      <div class="summary">{{ sample.summary }}</div>
      <span class="modified">Type: {{ sample.type }}</span>
      <span class="modified">Features: {{ sample.features }}</span>
      <span class="modified">Client language: {{ sample.client_language}}</span>
      <span class="modified">Server language: {{ sample.server_language}}</span>
      <span class="modified">Sample source: {{ sample.source}}</span>
      <span class="modified">Modified {{ sample.modifiedtext }}</span>
    </div>
  </a>

</div>
    {% endfor %}
</div>

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/server_framework" />