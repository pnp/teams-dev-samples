# Sample metadata

The [Microsoft 365 Sample Solution Gallery](https://adoption.microsoft.com/sample-solution-gallery/) uses metadata from each sample to support discovery and filtering.

Every new sample must include both of these files:

- `samples/{sample-folder}/README.md`
- `samples/{sample-folder}/assets/sample.json`

The README and `assets` folder must be at the sample root. A README inside a nested project, API, infrastructure, or dependency folder does not replace the sample-root README.

## Creating `assets/sample.json`

Copy `assets/sample.json` from a similar current sample and update all sample-specific values. The file contains a JSON array with one sample object.

At minimum, verify these fields:

- `name` is unique and follows the existing `pnp-sp-dev-teams-sample-*` pattern.
- `reponame` exactly matches the sample folder name.
- `title`, `shortDescription`, and `longDescription` describe this sample.
- `url` points to `https://github.com/pnp/teams-dev-samples/tree/main/samples/{sample-folder}`.
- `creationDateTime` and `updateDateTime` use `YYYY-MM-DD`.
- `products` and each `metadata` value accurately describe the sample.
- `thumbnails` points to an image that exists and includes meaningful alternative text.
- `authors` identifies the sample authors.
- `references` contains relevant documentation links.
- `version` matches the submitted sample version.

Keep `assets/sample.json`, the sample folder name, and the sample-root README consistent when updating or renaming a sample.

## Sample-root README

Use the appropriate template from [`samples/_SAMPLE_templates`](../samples/_SAMPLE_templates/). The README must include the sample summary, screenshot, prerequisites, setup and usage instructions, features, version history, and disclaimer described in the [contribution guidance](../CONTRIBUTING.md).

End the README with the visitor-tracking image, replacing `{sample-path}` with the repository-relative sample folder path:

```html
<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/{sample-path}" />
```

For a sample in `samples/bot-todo`, the suffix is `samples/bot-todo`.
