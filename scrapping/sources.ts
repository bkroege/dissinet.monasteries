import { benedictinesWikiFrParser } from "./parse/wiki-fr/benedictines";
import { cisteciennesWikiFrParser } from "./parse/wiki-fr/cisterciennes";
import { premonstransiansWikiFrParser } from "./parse/wiki-fr/premonstratensians";
import { collegialesVaflParser } from "./parse/other/vafl-collegiales";
import { cluniacDarmcParser } from "./parse/darmc/cluniac";

/*
 list of sources to parse
*/

var darmcUrl =
  "http://ags.cga.harvard.edu/arcgis/rest/services/darmc/roman/MapServer/identify?f=json&geometry=%7B%22x%22%3A10%2C%22y%22%3A40%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%2C%22&tolerance=100000&returnGeometry=true&mapExtent=%7B%22xmin%22%3A-40%2C%22ymin%22%3A-40%2C%22xmax%22%3A80%2C%22ymax%22%3A100%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%2C%22&imageDisplay=713%2C826%2C96&geometryType=esriGeometryPoint&sr=4326&layers=all%3";

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
      url: darmcUrl + "A87"
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
