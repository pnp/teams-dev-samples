# Microsoft Teams Development Samples
## Browse by Source

While the community samples are all in the PnP Github repository [teams-dev-samples](https://github.com/PnP/teams-dev-samples), the Microsoft samples come from a number of locations. To view samples based on their location/source, use this page.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='appTemplate']" title="Microsoft Teams App Templates">App Templates</button>
    <button class="button" data-filter="[data-facet*='botBuilder']" title="Microsoft Bot Builder samples">Bot Builder</button>
    <button class="button" data-filter="[data-facet*='msftTeams']" title="Msft-Teams Solutions">Msft-Teams</button>
    <button class="button" data-filter="[data-facet*='officeDev']" title="Office Developer samples">OfficeDev</button>
    <button class="button" data-filter="[data-facet*='pnp']" title="PnP Community samples">PnP Community</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.source}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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