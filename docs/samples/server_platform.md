# Microsoft Teams Development Samples
## Browse by Server Platform

You can build Teams solutions using many of the programming languages you're already familiar with. For solutions that have server-side code (bots, messaging extensions, and tabs or task modules that have a back-end service), you can select the hosting platform you're interested in.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='netcore']" title="Web server is ASP.NET Core">ASP.NET Core</button>
    <button class="button" data-filter="[data-facet*='netframework']" title="Web server is ASP.NET Framework">ASP.NET (classic)</button>
    <button class="button" data-filter="[data-facet*='express']" title="Web server is Node with Express">Express (Node)</button>
    <button class="button" data-filter="[data-facet*='powerautomate']" title="Server features provided by Power Automate workflow(s)">Power Automate</button>
    <button class="button" data-filter="[data-facet*='restify']" title="Web server is Node with Restify">Restify (Node)</button>
    <button class="button" data-filter="[data-facet*='requests']" title="Web server is Python with Requests">Requests (Python)</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.server_platform}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/server_platform" />