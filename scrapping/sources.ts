import { benedictinesWikiFrParser } from "./parse/wiki-fr/benedictines";
import { cisteciennesWikiFrParser } from "./parse/wiki-fr/cisterciennes";
import { praemonstratensiansWikiFrParser } from "./parse/wiki-fr/praemonstratensians";

import { collegialesVaflParser } from "./parse/other/vafl-collegiales";

import { cluniacDarmcParser } from "./parse/darmc/cluniac";
import { dominicanDarmcParser } from "./parse/darmc/dominican";
import { franciscanDarmcParser } from "./parse/darmc/franciscan";
import { praemonstratensiansDarmcParser } from "./parse/darmc/praemonstratensians";

/*
 list of sources to parse
*/

var darmcUrl = id => {
  return (
    "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/DARMC_Medieval_World/FeatureServer/" +
    id +
    "/query?f=json&where=1%3D1&outFields=*&outSR=4326&resultOffset=0&resultRecordCount=100000" +
    '&resultType=tile&quantizationParameters=%7B"mode"%3A"view"%2C"' +
    'originPosition"%3A"upperLeft"%2C"tolerance"%3A100%2C"extent"%3A%7B"xmin"%3A-1000000%2C"ymin"%3A4000000%2C"xmax"%3A1000000%2C"ymax"%3A7900000%2C"' +
    'spatialReference"%3A%7B"wkid"%3A4326%2C"latestWkid"%3A4326%7D%7D%7D'
  );
};
console.log(darmcUrl(46));
var sources: Array<{
  parse: boolean;
  parser: any;
  meta: { id: string; type: string; url: string; order?; rootUrl? };
}> = [
  {
    parse: true,
    parser: cluniacDarmcParser,
    meta: {
      id: "darmc-cluniac",
      type: "darmc",
      order: "cluniac",
      url: darmcUrl("45")
    }
  },
  {
    parse: true,
    parser: praemonstratensiansDarmcParser,
    meta: {
      id: "darmc-praemonstratensians",
      type: "darmc",
      order: "praemonstratensians",
      url: darmcUrl(46)
    }
  },
  {
    parse: true,
    parser: dominicanDarmcParser,
    meta: {
      id: "darmc-dominican",
      type: "darmc",
      order: "dominican",
      url: darmcUrl(48)
    }
  },
  {
    parse: false,
    parser: franciscanDarmcParser,
    meta: {
      id: "darmc-franciscan",
      type: "darmc",
      order: "franciscan",
      url: darmcUrl + "89"
    }
  },
  {
    parse: false,
    parser: collegialesVaflParser,
    meta: {
      id: "vafl-benedictines",
      type: "web",
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
    parser: praemonstratensiansWikiFrParser,
    meta: {
      id: "wiki-fr-praemonstratensians",
      type: "wiki",
      order: "praemonstratensians",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_pr%C3%A9montr%C3%A9es_de_France"
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
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_cisterciennes_de_France"
    }
  }
];

export default sources;
