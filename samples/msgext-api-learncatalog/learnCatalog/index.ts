/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest } from "@azure/functions";
import { LearnCatalogService } from "../service/learnCatalogService";
import { Module } from "../models/learnCatalog";
import FuzzySearch from 'fuzzy-search';
import { genericBadgeIcon } from "../icons/genericBadge";



// Define a Response interface.
interface Response {
  status: number;
  body: {
    results: any[];
  };
}

/**
 * This function handles the HTTP request and returns the Microsoft learn module information.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the Microsoft learn module information.
 */
export default async function run(context: Context, req: HttpRequest): Promise<Response> {
  // Initialize response.
  const res: Response = {
    status: 200,
    body: {
      results: [] as any[]
    },
  };

  // Get the assignedTo query parameter.
  const queryText = req.query.title;

  // If the assignedTo query parameter is not provided, return the response.
  if (!queryText) {
    return res;
  }


  //Fetch all modules
  const modules = await LearnCatalogService.getModulesAsync();

  const searcher = new FuzzySearch(modules, ['title', 'summary'], {
    caseSensitive: false,
    sort: true
  });

  const searchResults = searcher.search(queryText);


  const filteredModules = searchResults.map((module: Module) => {            
    return {
      uid: module.uid,
      title: module.title,
      summary: module.summary,
      url: module.url,
      image: module.social_image_url,
      icon: genericBadgeIcon,
      duration: module.duration_in_minutes,
      roles: module.roles.join(", ") || "",
    };
  });

  // Return filtered repair records, or an empty array if no records were found.
  res.body.results = filteredModules || [];
  return res;
}
