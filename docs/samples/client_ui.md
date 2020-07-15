# Microsoft Teams Development Samples
## Browse by Client Platform

You can build Teams solutions using many of the development platforms you're already familiar with. For solutions that have client-side code (tabs, some task modules), you can select the development platform you're interested in.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='angular']" title="Web UI built in Angular 2.0 or greater">Angular</button>
    <button class="button" data-filter="[data-facet*='angularjs']" title="Web UI built using Angular JS 1.x">AngularJS</button>
    <button class="button" data-filter="[data-facet*='jquery']" title="Web UI built using jQuery">jQuery</button>
    <button class="button" data-filter="[data-facet*='knockout']" title="Web UI built using Knockout">Knockout</button>
    <button class="button" data-filter="[data-facet*='react']" title="Web UI built using React">React</button>
    <button class="button" data-filter="[data-facet*='vuejs']" title="Web UI built using Vue">VueJS</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.client_ui}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/client_ui" />