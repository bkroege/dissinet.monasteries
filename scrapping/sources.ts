import { benedictinesWikiFrParser } from "./parse/wiki/benedictines";
import { cisteciennesWikiFrParser } from "./parse/wiki/cisterciennes";
import { praemonstratensiansWikiFrParser } from "./parse/wiki/praemonstratensians";
import { templarsWikiFrParser } from "./parse/wiki/templars";
import { teutonsWikiDeParser } from "./parse/wiki/teutons";
import { augustiniansWikiEnParser } from "./parse/wiki/en-augustinians";

import { collegialesVaflParser } from "./parse/other/vafl-collegiales";

import { earlyFoundationsDarmcParser } from "./parse/darmc/earlyfoundations";
import { cluniacDarmcParser } from "./parse/darmc/cluniac";
import { dominicanDarmcParser } from "./parse/darmc/dominican";
import { franciscanDarmcParser } from "./parse/darmc/franciscan";
import { cisterciennesDarmcParser } from "./parse/darmc/cisterciennes";
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

var sources: Array<{
  parse: boolean;
  parser: any;
  meta: {
    id: string;
    type: string;
    status: false | string;
    lang?: String;
    url: string;
    order?;
    rootUrl?;
  };
}> = [
  /* DARMC */
  {
    parse: true,
    parser: earlyFoundationsDarmcParser,
    meta: {
      id: "darmc-early",
      type: "darmc",
      status: false;
      order: false,
      url: darmcUrl(42)
    }
  },
  {
    parse: true,
    parser: cisterciennesDarmcParser,
    meta: {
      id: "darmc-cisterciennes",
      type: "darmc",
      status: false;
      order: "cistercians",
      url: darmcUrl(44)
    }
  },
  {
    parse: true,
    parser: cluniacDarmcParser,
    meta: {
      id: "darmc-cluniac",
      type: "darmc",
      status: false;
      order: "cluniac",
      url: darmcUrl(45)
    }
  },
  {
    parse: true,
    parser: praemonstratensiansDarmcParser,
    meta: {
      id: "darmc-praemonstratensians",
      type: "darmc",
      status: false;
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
      status: false;
      order: "dominican",
      url: darmcUrl(48)
    }
  },
  {
    parse: true,
    parser: franciscanDarmcParser,
    meta: {
      id: "darmc-franciscan",
      type: "darmc",
      status: false;
      order: "franciscan",
      url: darmcUrl(49)
    }
  },

  /* WIKIPEDIA */
  {
    parse: true,
    parser: augustiniansWikiEnParser,
    meta: {
      id: "wiki-en-augustinians",
      lang: "en",
      type: "wiki",
      status: false;
      order: "augustinians",
      rootUrl: "https://en.wikipedia.org",
      url:
        "https://en.wikipedia.org/wiki/Category:Augustinian_monasteries_in_France"
    }
  },
  {
    parse: true,
    parser: benedictinesWikiFrParser,
    meta: {
      id: "wiki-fr-benedictines",
      type: "wiki",
      order: "benedictines",
      status: false;
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    }
  },
  {
    parse: true,
    parser: cisteciennesWikiFrParser,
    meta: {
      id: "wiki-fr-cisterciennes",
      type: "wiki",
      order: "cistercians",
      status: false;
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_cisterciennes_de_France"
    }
  },
  {
    parse: true,
    parser: templarsWikiFrParser,
    meta: {
      id: "wiki-fr-templars",
      type: "wiki",
      order: "templars",
      status: false;
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_des_commanderies_templi%C3%A8res"
    }
  },
  {
    parse: true,
    parser: teutonsWikiDeParser,
    meta: {
      id: "wiki-de-teutons",
      type: "wiki",
      order: "teutonic knights",
      status: false;
      rootUrl: "https://de.wikipedia.org",
      url:
        "https://de.wikipedia.org/wiki/Liste_der_Kommenden_des_Deutschen_Ordens"
    }
  },

  /* NOT FINISHED */
  {
    parse: false,
    parser: praemonstratensiansWikiFrParser,
    meta: {
      id: "wiki-fr-praemonstratensians",
      type: "wiki",
      order: "praemonstratensians",
      status: false;
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_pr%C3%A9montr%C3%A9es_de_France"
    }
  },
  {
    parse: false,
    parser: collegialesVaflParser,
    meta: {
      id: "vafl-benedictines",
      type: "web",
      order: "collegiales",
      status: false;
      rootUrl: "http://vafl-s-applirecherche.unilim.fr/collegiales/?i=fiche&j=",
      url:
        "http://vafl-s-applirecherche.unilim.fr/collegiales/cartes/current.geojson.php?type=gen"
    }
  }
];

export default sources;
