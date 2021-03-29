# Microsoft Teams Development Samples
## Browse by Feature

Teams applications can include one or more features such as tabs and bots.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='bot']" title="Solution contains a chatbot">Bot</button>
    <button class="button" data-filter="[data-facet*='meetings']" title="Solution contains a meetings application">Meetings</button>
    <button class="button" data-filter="[data-facet*='msgext']" title="Solution contains one or more messaging extensions">Messaging Extension</button>
    <button class="button" data-filter="[data-facet*='other']" title="Other solution (outside Teams UI)">Other</button>
    <button class="button" data-filter="[data-facet*='webhook']" title="Solution consumes an outgoing webhook">Outgoing Webhook</button>
    <button class="button" data-filter="[data-facet*='tab']" title="Solution contains one or more tabs">Tab</button>
    <button class="button" data-filter="[data-facet*='taskmodule']" title="Solution contains one or more task modules">Task Module</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.features}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/features" />