import { benedictinesWikiFrParser } from "./parse/wiki-fr/benedictines";
import { cisteciennesWikiFrParser } from "./parse/wiki-fr/cisterciennes";
import { premonstransiansWikiFrParser } from "./parse/wiki-fr/premonstratensians";
import { collegialesVaflParser } from "./parse/other/vafl-collegiales";

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
    parser: collegialesVaflParser,
    meta: {
      id: "vafl-benedictines",
      type: "wiki",
      order: "collegiales",
      rootUrl: "http://vafl-s-applirecherche.unilim.fr/collegiales/?i=fiche&j=",
      url:
        "http://vafl-s-applirecherche.unilim.fr/collegiales/cartes/current.geojson.php?type=gen"
    }
  },
  {
    parse: false,
    parser: benedictinesWikiFrParser,
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
    parse: false,
    parser: premonstransiansWikiFrParser,
    meta: {
      id: "wiki-fr-premonstratensians",
      type: "wiki",
      order: "premonstratensians",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    }
  },
  {
    parse: false,
    parser: cisteciennesWikiFrParser,
    meta: {
      id: "wiki-fr-cisterciennes",
      type: "wiki",
      order: "cisterciennes",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    }
  }
];

export default sources;
