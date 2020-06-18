# Samples with Status



<table id="samplestable" >
    <thead>
        <tr>
            <th>name</th>
            <th>Title</th>
            <th>Written by</th>
            <th>Language</th>
            <th>Modified</th>
            <th>Preview</th>
        </tr>
    </thead>
<tbody>
    {% for sample in samples %}
    <tr>
        <td>{{ sample.name }}</td>
        <td><a href="{{ sample.url }}" target="_blank" title="{{sample.summary}}">{{ sample.title }}</a></td>
        <td>{{ sample.author }}</td>
<td>
        {% if sample.language == "netcore" %}
            .NET Core
        {% elif sample.language == "python" %}
            Python
        {% elif sample.language == "javascript" %}
            JavaScript
        {% elif sample.language == "javascript_es6" %}
            JavaScript ES6
        {% elif sample.language == "typescript" %}
            TypeScript
        {% elif sample.language == "netwebapi" %}
            .NET Web API
{% endif %}
        </td>
        <td>{{ sample.modifiedtext }}</td>
        <td><picture>
          <img src="../../img/thumbnails/{{ sample.name }}.png" width="302" alt="{{sample.name}}" data-fullsize="{{sample.thumbnail}}" data-orig="../../img/thumbnails/{{ sample.name }}.png"/>
        </picture></td>
    </tr>
    {% endfor %}
    </tbody>
</table>
Count: {{ samples|count }}
<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/docs/samples/allstatus" />