import { parseBenedictinesWiki } from "./parse/wiki/benedictines";
import { parseCisterciennesWiki } from "./parse/wiki/cisterciennes";
import { parsePremonstratensiansWiki } from "./parse/wiki/premonstratensians";
import { type } from "os";

/*
 list of sources to parse
*/

const sources: Array<{
  parse: boolean;
  parseFn: Function;
  meta: { id: string; type: string; url: string; order?; rootUrl? };
}> = [
  {
    parse: true,
    parseFn: parseBenedictinesWiki,
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
    parseFn: parsePremonstratensiansWiki
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
    parseFn: parseCisterciennesWiki
  }
];
