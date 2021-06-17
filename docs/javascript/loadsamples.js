/**
 * This file is unique for each sample browser. It contains the logic specific to each repo for loading the samples as needed.
 */
var jsonPath = "https://raw.githubusercontent.com/pnp/teams-dev-samples/gh-pages/samples.json";

/**
 * Reads a sample metadata and returns a pre-populated HTML element
 * @param {*} sample 
 * @returns 
 */
function loadSample(sample, filter) {
  try {
    var title = _.escape(sample.title);
    var escapedDescription = _.escape(sample.shortDescription);

    var shortDescription = sample.shortDescription; //.length > 80 ? sample.shortDescription.substr(0, 77)  : sample.shortDescription;
    var thumbnail = "https://pnp.github.io/teams-dev-samples/img/_nopreview.png";
    //var categories = sample.categories[0];

    if (sample.thumbnails && sample.thumbnails.length > 0) {
      thumbnail = sample.thumbnails[0].url;
    } else {
      // Grab the name of the sample and hard-coded path
      var appName = sample.name.substr(24);
      thumbnail = `https://github.com/pnp/teams-dev-samples/blob/gh-pages/img/thumbnails/${appName}.png?raw=true`;
    }
  
    var framework = "";
    var sampleType = "";
    var features = "";
    var clientLanguage = "";
    var serverLanguage = "";
    var sampleSource = "";
    var clientPlatform = "";
    var botFramework = "";
    var serverPlatform = "";

    var metadata = sample.metadata;
    metadata.forEach(meta => {
      switch (meta.key) {
        case "TEAMS-SAMPLE-TYPE":
          sampleType = meta.value;
          break;
        case "TEAMS-SAMPLE-SOURCE":
          sampleSource = meta.value;
          break;
        case "TEAMS-CLIENT-LANGUAGE":
          clientLanguage = meta.value;
          break;
        case "TEAMS-CLIENT-PLATFORM":
          clientPlatform = meta.value;
          break;
        case "TEAMS-SERVER-LANGUAGE":
          serverLanguage = meta.value;
          break;
        case "TEAMS-SERVER-PLATFORM":
          serverPlatform = meta.value;
          break;
        case "TEAMS-FEATURES":
          features = meta.value;
          break;
        case "TEAMS-CLIENT-UI": 
          framework = meta.value;
          break;
        case "TEAMS-BOT-FRAMEWORK":
          botFramework = meta.value;
          break;
        default:
          break;
      }
    });

    var modified = new Date(sample.updateDateTime).toString().substr(4).substr(0, 12);
    var authors = sample.authors;
    var authorsList = "";
    var authorAvatars = "";
    var authorName = "";
    var authorsGitHub = "";
    //var productTag = framework.toLowerCase();
    //var productName = framework;
    var productTag = "teams";
    var productName = "Microsoft Teams";
    
// Type: barebones
// Features: msgext
// Client language: None
// Server language: typescript
// Sample source: pnp

    // Build the authors array
    if (authors.length < 1) {
      console.log("Sample has no authors", sample);
    } else {
      authors.forEach(author => {
        if (authorsList !== "") {
          authorsList = authorsList + ", ";
        }
        authorsList = authorsList + author.name;
        authorsGitHub = authorsGitHub + " " + author.gitHubAccount;

        var authorAvatar = `<div class="author-avatar">
              <div role="presentation" class="author-coin">
                <div role="presentation" class="author-imagearea">
                  <div class="image-400">
                    <img class="author-image" loading="lazy" src="${author.pictureUrl}" alt="${author.name}" title="${author.name}">
                  </div>
                </div>
              </div>
            </div>`;
        authorAvatars = authorAvatar + authorAvatars;
      });

      authorName = authors[0].name;
      if (authors.length > 1) {
        authorName = authorName + ` +${authors.length - 1}`;
      }
    }

    // Extract tags
    var tags = "";
    $.each(sample.tags, function (_u, tag) {
      tags = tags + "#" + tag + ",";
    });

    // Build a keyword tag for searching
    var keywords = title + " " + escapedDescription + " " + authorsList + " " + authorsGitHub + " " + tags + " " + features + " " + clientLanguage + " " + serverLanguage + " " + sampleSource + " " + sampleType + " " + framework;
    keywords = keywords.toLowerCase();

    // Build the HTML to insert
    var $items = $(`
<a class="sample-thumbnail" href="${sample.url}" data-modified="${sample.modified}" data-title="${title}" data-keywords="${keywords}" data-sample-type="${sampleType}" data-framework="${framework}" data-feature="${features}" data-source="${sampleSource}" data-client-language="${clientLanguage}" data-client-platform="${clientPlatform}" data-bot-framework="${botFramework}" data-server-language="${serverLanguage}" data-server-platform="${serverPlatform}">
  <div class="sample-inner">
    <div class="sample-preview">
      <img src="${thumbnail}" loading="lazy" alt="${title}">
    </div>
    <div class="sample-details">
      <div class="producttype-item ${productTag}">${productName}</div>
      <p class="sample-title" title="${sample.title}">${sample.title}</p>
      <p class="sample-description" title='${escapedDescription}'>${shortDescription}</p>
      <div class="sample-activity">
        ${authorAvatars}
        <div class="activity-details">
          <span class="sample-author" title="${authorsList}">${authorName}</span>
          <span class="sample-date">Modified ${modified}</span>
        </div>
      </div>
    </div>
  </div>
</a>`);

    return $items;
  } catch (error) {
    console.log("Error with one sample", error, sample);
  }
  return null;
}