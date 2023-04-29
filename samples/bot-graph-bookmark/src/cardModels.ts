/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */
export interface CardData {
  title: string;
  body: string;
}
export interface BookmarkData{
  header: string;
}

export interface IBookmarkForm{
  Title: string
  URL: string;
  BookmarkComments: string;
  Tags:string;
}