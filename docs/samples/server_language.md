# Samples by Server Language

You can build Teams solutions using many of the programming languages you're already familiar with. For solutions that have server-side code (bots, messaging extensions, and tabs or task modules that have a back-end service), you can select the language you're interested in.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-facet*='csharp']" title="Server code written in C#">C#</button>
    <button class="button" data-filter="[data-facet*='javascript']" title="Server code written in JavaScript/ECMAScript for NodeJS">JavaScript</button>
    <button class="button" data-filter="[data-facet*='powerautomate']" title="Back-end using Power Automate workflow(s)">Power Automate</button>
    <button class="button" data-filter="[data-facet*='python']" title="Server code written in Python">Python</button>
    <button class="button" data-filter="[data-facet*='typescript']" title="Server code written in TypeScript for NodeJS">TypeScript</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-facet="{{sample.server_language}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/language" />