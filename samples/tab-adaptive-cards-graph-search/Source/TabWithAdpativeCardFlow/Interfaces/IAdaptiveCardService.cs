using AdaptiveCards;
using Microsoft.Bot.Schema;
using TabWithAdpativeCardFlow.Models.Search;
using System;
using System.Collections.Generic;
using System.Text;

namespace TabWithAdpativeCardFlow.Interfaces
{
    public interface IAdaptiveCardService
    {
        List<AdaptiveElement> GetElements<T>(List<T> items);
        string BindData<T>(string adaptiveCard, T data);
        AdaptiveElement ConvertJsonToAdaptiveElement(string content);
        List<AdaptiveElement> GetSearchResultsContainers(SearchResults results);
    }
}
