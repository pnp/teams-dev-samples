# Samples by Server Framework

Teams bots often use the Bot Framework SDK. Note that version 4 is not backward compatible with version 3, which is no longer supported. Therefore it is strongly
recommended to use v4. Beginning with Bot Framework SDK 4.6, the SDK understands
Teams-specific messages.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='bot4.x']" title="Uses Bot Framework 4.x">Bot Framework 4.x</button>
    <button class="button" data-filter="[data-facet*='bot3.x']" title="Uses Bot Framework 3.x">Bot Framework 3.x</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.server_framework}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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
<span class="location" title="Framework: {{sample.framework}}">{{ sample.framework }}</span>
  <h2 class="name">
      {{sample.title}}</h2>
      <div class="sample-activity">
  <span class="author" title="{{ sample.author }}">{{ sample.author }}</span>
  <span class="modified">Modified {{ sample.modifiedtext }}</span>
  </div>
  </a>

</div>
    {% endfor %}
</div>

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/server_framework" />