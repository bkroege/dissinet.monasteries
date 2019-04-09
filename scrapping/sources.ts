import { benedictinesWikiFrParser } from "./parse/wiki/benedictines";
import { cisteciennesWikiFrParser } from "./parse/wiki/cisterciennes";
import { praemonstratensiansWikiFrParser } from "./parse/wiki/praemonstratensians";
import { templarsWikiFrParser } from "./parse/wiki/templars";
import { teutonsWikiDeParser } from "./parse/wiki/teutons";
import { augustiniansWikiEnParser } from "./parse/wiki/en-augustinians";
import { carthusiansWikiEnParser } from "./parse/wiki/en-carthusians";

import { cisteciennesSpreadsheetParser } from "./parse/spreadsheet/cisteciennes";
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
  id;
  meta: {
    id: string;
    url: string;
    status?: false | string;
    lang?: string;
    gender?: string;
    order?;
    time?;
    rootUrl?;
    reliability?;
  };
}> = [
  /* OTHER */
  {
    parse: false,
    parser: cisteciennesSpreadsheetParser,
    id: 12,
    meta: {
      id: "spreadsheet-cisteciennes",
      url: "1NoF9TVOQmqQuEsiGpYjFHPlfHSIiF7v3SzYhcdZjwpg"
    }
  },

  /* DARMC */
  {
    parse: false,
    parser: earlyFoundationsDarmcParser,
    id: 14,
    meta: {
      id: "darmc-early",
      url: darmcUrl(42)
    }
  },
  {
    parse: false,
    parser: cisterciennesDarmcParser,
    id: 2,
    meta: {
      id: "darmc-cisterciennes",
      url: darmcUrl(44)
    }
  },
  {
    parse: false,
    parser: cluniacDarmcParser,
    id: 4,
    meta: {
      id: "darmc-cluniac",
      url: darmcUrl(45)
    }
  },
  {
    parse: false,
    parser: praemonstratensiansDarmcParser,
    id: 7,
    meta: {
      id: "darmc-praemonstratensians",
      url: darmcUrl(46)
    }
  },
  {
    parse: false,
    parser: dominicanDarmcParser,
    id: 5,
    meta: {
      id: "darmc-dominican",
      url: darmcUrl(48)
    }
  },
  {
    parse: false,
    parser: franciscanDarmcParser,
    id: 6,
    meta: {
      id: "darmc-franciscan",
      url: darmcUrl(49)
    }
  },

  /* WIKIPEDIA */
  {
    parse: false,
    parser: carthusiansWikiEnParser,
    id: 11,
    meta: {
      id: "wiki-en-carthusians",
      rootUrl: "https://en.wikipedia.org",
      url: "https://en.wikipedia.org/wiki/List_of_Carthusian_monasteries"
    }
  },
  {
    parse: false,
    parser: augustiniansWikiEnParser,
    id: 10,
    meta: {
      id: "wiki-en-augustinians",
      rootUrl: "https://en.wikipedia.org",
      url:
        "https://en.wikipedia.org/wiki/Category:Augustinian_monasteries_in_France"
    }
  },
  {
    parse: false,
    parser: benedictinesWikiFrParser,
    id: 1,
    meta: {
      id: "wiki-fr-benedictines",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France"
    }
  },
  {
    parse: false,
    parser: cisteciennesWikiFrParser,
    id: 3,
    meta: {
      id: "wiki-fr-cisterciennes",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_cisterciennes_de_France"
    }
  },
  {
    parse: false,
    parser: templarsWikiFrParser,
    id: 8,
    meta: {
      id: "wiki-fr-templars",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_des_commanderies_templi%C3%A8res"
    }
  },
  {
    parse: false,
    parser: teutonsWikiDeParser,
    id: 9,
    meta: {
      id: "wiki-de-teutons",
      rootUrl: "https://de.wikipedia.org",
      url:
        "https://de.wikipedia.org/wiki/Liste_der_Kommenden_des_Deutschen_Ordens"
    }
  },

  /* NOT FINISHED */
  {
    parse: false,
    parser: praemonstratensiansWikiFrParser,
    id: 26,
    meta: {
      id: "wiki-fr-praemonstratensians",
      rootUrl: "https://fr.wikipedia.org",
      url:
        "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_pr%C3%A9montr%C3%A9es_de_France"
    }
  }
];

export default sources;
