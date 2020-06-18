# Samples by Language

You can build Teams solutions using many of the programming languages you're already familiar with. Use the filters below to find samples by language.

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-language='netcore']">.NET Core</button>
    <button class="button" data-filter="[data-language='javascript']">JavaScript</button>
    <button class="button" data-filter="[data-language='netwebapi']">.NET Web API</button>
    <button class="button" data-filter="[data-language='javascript_es6']">JavaScript (ES6)</button>
    <button class="button" data-filter="[data-language='typescript']">TypeScript</button>
    <button class="button" data-filter="[data-language='python']">Python</button>
  </div>
</div>

<div class="grid">

{% for sample in samples|sort(attribute='modified', reverse=True) %}

<div class="sample-item" data-language="{{sample.language}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
  <div class="sample">
    <div class="sample-video"><i class="ms-Icon ms-Icon--VideoSolid" aria-hidden="true"></i></div>
    <div class="sample-img">
      <a class="sample-link"
        href="{{sample.url}}"
        title="{{sample.summary}}">
        <picture>
          <img src="thumbnails/{{ sample.name }}.png" width="302" alt="{{sample.name}}" data-fullsize="{{sample.thumbnail}}" data-orig="https://pnp.github.io/teams-dev-samples/img/thumbnails/{{ sample.name }}.png"/>
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