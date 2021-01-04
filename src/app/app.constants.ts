export const PHOTO_API_KEY =
  "563492ad6f91700001000001b20ca47cb5e84fc4bd9c31aef18f1985";
export const NEWS_API_KEY = "ae230f263ba24e9e8106e38970b4c747";
export function randomize(collection: Array<any>): Array<any> {
  return collection.map(f => {
    return {f, b: Math.random() * collection.length};
  })
    .sort((a, b) => a.b > b.b ? 1 : -1).map(f => f.f);
}
