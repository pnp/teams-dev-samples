import { IOfferDocument } from "../../model/IOfferDocument";

export default class CardService {
  public static reviewCard = (doc: IOfferDocument) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            }                     
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: "View",
          url: doc.url
        },
        {
          type: "Action.Execute",
          title: "Reviewed",
          verb: "review",
          data: {
            doc: doc
          }
        }
      ]
    }
  }

  public static reviewedCard = (doc: IOfferDocument) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            }                     
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "View",
        url: doc.url
      }
    ]
    }
  }

  public static reviewCardUA = (doc: IOfferDocument, userIds: string[]) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    refresh: {
        action: {
            type: "Action.Execute",
            title: "Refresh",
            verb: "alreadyreviewed",
            data: {
              doc: doc,
              userIds: userIds
            }
        },
        userIds: userIds
    },

    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            }                     
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "View",
        url: doc.url
      },
      {
        type: "Action.Execute",
        title: "Reviewed",
        verb: "review",
        data: {
          doc: doc
        }
      }
    ]
    }
  }

  public static reviewedCardUA = (doc: IOfferDocument) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            },
            {
              type: "ColumnSet",
              columns: [
                  {
                    type: "Column",
                    width: "stretch",
                    items: [
                      {
                        type: "TextBlock",
                        text: `Reviewed by: ${doc.reviewer}`,
                        wrap: true
                      }
                    ]
                  },
                  {
                    type: "Column",
                    width: "stretch",
                    items: [
                      {
                        type: "TextBlock",
                        text: `Reviewed on: ${doc.reviewedOn!.toLocaleDateString()}`,
                        wrap: true
                      }
                    ]
                  }
              ]
          }                   
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "View",
        url: doc.url
      }
    ]
    }
  }

  public static publishCardUA = (doc: IOfferDocument, userIds: string[]) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    refresh: {
        action: {
            type: "Action.Execute",
            title: "Refresh",
            verb: "alreadypublished",
            data: {
              doc: doc,
              userIds: userIds
            }
        },
        userIds: userIds
    },

    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            }                     
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "View",
        url: doc.url
      },
      {
        type: "Action.Execute",
        title: "Publish",
        verb: "publish",
        data: {
          doc: doc
        }
      }
    ]
    }
  }

  public static publishedCardUA = (doc: IOfferDocument) => {
    return {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
            {
              type: "ColumnSet",
              columns: [
                    {
                      type: "Column",
                      width: 25,
                      items: [
                        {
                          type: "Image",
                          url: `https://${process.env.PUBLIC_HOSTNAME}/assets/icon.png`,
                          style: "Person"
                        }
                      ]
                    },
                    {
                      type: "Column",
                      width: 75,
                      items: [
                        {
                          type: "TextBlock",
                          text: doc.name,
                          size: "Large",
                          weight: "Bolder"
                        },
                        {
                          type: "TextBlock",
                          text: doc.description,
                          size: "Medium"
                        },
                        {
                          type: "TextBlock",
                          text: `Author: ${doc.author}`
                        },
                        {
                          type: "TextBlock",
                          text: `Modified: ${doc.modified.toLocaleDateString()}`
                        }
                      ]
                    }
                ]
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `Reviewed by: ${doc.reviewer}`,
                      wrap: true
                    }
                  ]
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `Reviewed on: ${doc.reviewedOn!.toLocaleDateString()}`,
                      wrap: true
                    }
                  ]
                }
              ]
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `Published by: ${doc.publisher}`,
                      wrap: true
                    }
                  ]
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: `Published on: ${doc.publishedOn!.toLocaleDateString()}`,
                      wrap: true
                    }
                  ]
                }
              ]
            }                  
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "View",
        url: doc.publishedFileUrl
      }
    ]
    }
  }
};