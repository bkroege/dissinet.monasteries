import { benedictinesWikiFrParer } from "./parse/wiki-fr/benedictines";
import { cisteciennesWikiFrParer } from "./parse/wiki-fr/cisterciennes";
import { premonstransiansWikiFrParer } from "./parse/wiki-fr/premonstratensians";

/*
 list of sources to parse
*/

var sources: Array<{
  parse: boolean;
  parser: any;
  meta: { id: string; type: string; url: string; order?; rootUrl? };
}> = [
  {
    parse: true,
    parser: benedictinesWikiFrParer,
    meta: {
      id: "wiki-fr-benedictines",
      type: "wiki",
      order: "benedictines",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    }
  },
  {
    meta: {
      id: "wiki-fr-premonstratensians",
      type: "wiki",
      order: "premonstratensians",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    },
    parse: true,
    parser: premonstransiansWikiFrParer
  },
  {
    meta: {
      id: "wiki-fr-cisterciennes",
      type: "wiki",
      order: "cisterciennes",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    },
    parse: true,
    parser: cisteciennesWikiFrParer
  }
];

export default sources;
