# All Samples

To learn more about how to use these samples, please refer to our [getting started](../gettingstarted/index.md) section.

<table id="samplestable">
    <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Client Language</th>
            <th>Server Language</th>
            <th>Preview</th>
        </tr>
    </thead>
<tbody>
    {% for sample in samples %}
    <tr>
        <td><a href="{{ sample.url }}" target="_blank" title="{{sample.summary}}">{{ sample.title }}</a></td>
        <td>{{ sample.author }}</td>
        <td>
        {% if sample.clientLanguage == "csharp" %}
            .NET Core
        {% elif sample.clientLanguage == "powerapps" %}
            Power Apps
        {% elif sample.clientLanguage == "javascript" %}
            JavaScript
        {% elif sample.clientLanguage == "javascript_es6" %}
            JavaScript ES6
        {% elif sample.clientLanguage == "typescript" %}
            TypeScript
        {% endif %}
        </td>
        <td>
        {% if sample.serverLanguage == "csharp" %}
            C#
        {% elif sample.serverLanguage == "python" %}
            Python
        {% elif sample.serverLanguage == "powerautomate" %}
            Power Automate
        {% elif sample.serverLanguage == "javascript" %}
            JavaScript
        {% elif sample.serverLanguage == "typescript" %}
            TypeScript
        {% endif %}
        </td>
        <td><div class="sample-img">
      <a class="sample-link"
        href="{{sample.url}}"
        title="{{sample.summary}}">
        <picture>
          <img src="../../img/thumbnails/{{ sample.name }}.png" width="302" alt="{{sample.name}}" data-fullsize="{{sample.thumbnail}}" data-orig="../../img/thumbnails/{{ sample.name }}.png"/>
        </picture>
      </a>
    </div></td>
    </tr>
    {% endfor %}
    </tbody>
</table>

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/all" />
