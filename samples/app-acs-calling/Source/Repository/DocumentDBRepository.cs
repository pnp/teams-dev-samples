// <copyright file="DocumentDBRepository.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Repository
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;

    /// <summary>
    /// Document DB Repository Class.
    /// </summary>
    public static class DocumentDBRepository
    {
        private static readonly string DatabaseId = Startup.StaticConfig["database"];
        private static readonly string CollectionId = Startup.StaticConfig["collection"];
        private static DocumentClient client;

        /// <summary>
        /// Retrieves the item of the specified ID.
        /// </summary>
        /// <typeparam name="T">Type parameter.</typeparam>
        /// <param name="id">id of the item.</param>
        /// <returns>Return item of the specified type.</returns>
        public static async Task<T> GetItemAsync<T>(string id)
            where T : class
        {
            try
            {
                Document document = await client.ReadDocumentAsync(UriFactory.CreateDocumentUri(DatabaseId, CollectionId, id));
                return (T)(dynamic)document;
            }
            catch (DocumentClientException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return null;
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Retrieves items for the specified predicate.
        /// </summary>
        /// <typeparam name="T">Type parameter.</typeparam>
        /// <param name="predicate">Predicate.</param>
        /// <returns>Items for the given predicate.</returns>
        public static async Task<IEnumerable<T>> GetItemsAsync<T>(Expression<Func<T, bool>> predicate)
            where T : class
        {
            IDocumentQuery<T> query = client.CreateDocumentQuery<T>(
                UriFactory.CreateDocumentCollectionUri(DatabaseId, CollectionId),
                new FeedOptions { MaxItemCount = -1 })
                .Where(predicate)
                .AsDocumentQuery();

            List<T> results = new List<T>();
            while (query.HasMoreResults)
            {
                results.AddRange(await query.ExecuteNextAsync<T>());
            }

            return results;
        }

        /// <summary>
        /// Create item for the given type.
        /// </summary>
        /// <typeparam name="T">Type parameter.</typeparam>
        /// <param name="item">Item to be created.</param>
        /// <returns>JSON document.</returns>
        public static async Task<Document> CreateItemAsync<T>(T item)
        {
            return await client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri(DatabaseId, CollectionId), item);
        }

        /// <summary>
        /// Update item of the given id.
        /// </summary>
        /// <typeparam name="T">Type parameter.</typeparam>
        /// <param name="id">Id of the item to be updated.</param>
        /// <param name="item">Item to be updated.</param>
        /// <returns>JSON document.</returns>
        public static async Task<Document> UpdateItemAsync<T>(string id, T item)
        {
            return await client.ReplaceDocumentAsync(UriFactory.CreateDocumentUri(DatabaseId, CollectionId, id), item);
        }

        /// <summary>
        /// Delete item of the given id.
        /// </summary>
        /// <param name="id">Id of the item.</param>
        /// <returns>The task object representing the service response for the asynchronous operation.</returns>
        public static async Task DeleteItemAsync(string id)
        {
            await client.DeleteDocumentAsync(UriFactory.CreateDocumentUri(DatabaseId, CollectionId, id));
        }

        /// <summary>
        /// Initialize the Database.
        /// </summary>
        public static void Initialize()
        {
            try
            {
                client = new DocumentClient(new Uri(Startup.StaticConfig["endpoint"]), Startup.StaticConfig["authKey"]);
                CreateDatabaseIfNotExistsAsync().Wait();
                CreateCollectionIfNotExistsAsync().Wait();
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static async Task CreateDatabaseIfNotExistsAsync()
        {
            try
            {
                await client.ReadDatabaseAsync(UriFactory.CreateDatabaseUri(DatabaseId));
            }
            catch (DocumentClientException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    await client.CreateDatabaseAsync(new Database { Id = DatabaseId });
                }
                else
                {
                    throw;
                }
            }
        }

        private static async Task CreateCollectionIfNotExistsAsync()
        {
            try
            {
                await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DatabaseId, CollectionId));
            }
            catch (DocumentClientException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    await client.CreateDocumentCollectionAsync(
                        UriFactory.CreateDatabaseUri(DatabaseId),
                        new DocumentCollection { Id = CollectionId },
                        new RequestOptions { OfferThroughput = 1000 });
                }
                else
                {
                    throw;
                }
            }
        }
    }
}
