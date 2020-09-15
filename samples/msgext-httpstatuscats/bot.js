const httpstatus = require('./httpstatus');
const { TeamsActivityHandler, CardFactory } = require('botbuilder');

class HttpCatsBot extends TeamsActivityHandler {
  
  // Triggers when the action is invoked either in the search box or message menu by a user
  
  async handleTeamsMessagingExtensionQuery(context, query) {

    const {name, value} = query.parameters[0];
    
    if(name !== 'statusCode') { 
      return;
    }

    console.log(value)
    
    
    // Defining the content - https://docs.microsoft.com/en-us/microsoftteams/platform/resources/messaging-extension-v3/search-extensions
    // Using the preview property within the attachment object. The preview attachment can only be a Hero or Thumbnail card.
    
    const status = httpstatus[value];
    const previewText = (status) ? `${value}: ${status}` : '[⚠️ Cannot find the status code]';
    const previewImg = (status) ? `https://http.cat/${value}` : null;
    const preview = CardFactory.heroCard(previewText, '', [{url: previewImg}]);

    
    // Adaptive Card for the content after click
    
    let content = {
      type: 'TextBlock',
      text: 'This is not a valid status code. Try again!'
    }
    
    if(status) {
      content = {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: value,
              size: 'large'
            },
            {
              type: 'TextBlock',
              text: status,
              isSubtle: true,
              wrap: true
            },
            {
              type: 'Image',
              url: `https://http.cat/${value}`, 
              alt: 'cat',
            }
          ]
        }
    }
    
    const card = {
      type: 'AdaptiveCard',
      version: '1.0',
      body: [
        content
      ],
    };
    
    const adaptiveCard = CardFactory.adaptiveCard(card);
    
    const attachment = { ...adaptiveCard, preview};  
    

    return {
      composeExtension: {
        type: 'result',
        attachmentLayout: 'list',
        attachments: [attachment]
      }
    };

  }
}

module.exports.HttpCatsBot = HttpCatsBot;

