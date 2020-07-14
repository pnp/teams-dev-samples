# Samples by Type

Microsoft Teams is highly extensible, allowing 3rd party and custom applications to run alongside the many Office 365 services already included in Teams. Just as you can add a Word tab or the Who bot in Teams, you can write your own tabs and bots. You can also write applications that run outside the Teams UI and use the Microsoft Graph API to access and curate Teams content.

This sample browser includes both Microsoft provided and community samples. We welcome [your contributions](contributing/index.md)! To learn more about how to use these samples, please refer to our [getting started](./gettingstarted/index.md) section.

 <div class="well">
  <div class="button-group filters-button-group">
    <button class="button is-checked" data-filter="*">All</button>
    <button class="button" data-filter="[data-type='apptemplate']" title="App Templates are production-quality Teams applications from Microsoft that you can use as-is or as a basis for your own project">App Templates</button>
    <button class="button" data-filter="[data-type='barebones']" title="Bare bones samples are very simple, and show a single programming technique">Bare Bones</button>
    <button class="button" data-filter="[data-type='demo']" title="Demos are Teams applications that demonstrate one or more concepts but may not be complete, and are not production-ready">Demos</button>
    <button class="button" data-filter="[data-type='solution']" title="Solutions are Teams applications that may or may not be production-quality">Solutions</button>
  </div>
</div>

<div class="grid">

{% for sample in samples %}

<div class="sample-item" data-type="{{sample.type}}" data-modified="{{sample.modified}}" data-title="{{ sample.title }}"  data-thumbnail="{{sample.thumbnail}}">
  <div class="sample">
    <div class="sample-video"><i class="ms-Icon ms-Icon--VideoSolid" aria-hidden="true"></i></div>
    <div class="sample-img">
      <a class="sample-link"
        href="{{sample.url}}"
        title="{{sample.summary}}">
        <picture>
          <img src="./img/thumbnails/{{ sample.name }}.png" width="302" alt="{{sample.name}}" data-fullsize="{{sample.thumbnail}}" data-orig="./img/thumbnails/{{ sample.name }}.png"/>
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/type" />