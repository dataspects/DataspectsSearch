var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

const mw0__text = (hit, instantsearch) => {
  if (["Template", "Form", "Module", "Concept"].includes(hit.mw0__namespace)) {
    return `<pre>${instantsearch.snippet({
      attribute: "mw0__wikitext",
      highlightedTagName: "mark",
      hit,
    })}</pre>`;
  }
  return instantsearch.snippet({
    attribute: "mw0__text",
    highlightedTagName: "mark",
    hit,
  });
};

const mw0__attachment = (hit, instantsearch) => {
  if (["File"].includes(hit.mw0__namespace)) {
    return `<fieldset>
              <legend>${hit.mw0__attachment.type}</legend>
              <div class="mw0__attachmentsText">
                ${instantsearch.snippet({
                  attribute: "mw0__attachment.text",
                  highlightedTagName: "mark",
                  hit,
                })}
              </div>
            </fieldset>`;
  }
  return "";
};

const eppo0__hasEntityType = (hit) => {
  if (hit.eppo0__hasEntityType) {
    return `<a href="${hit.eppo0__hasEntityType}"><span class="badge eppo0__hasEntityType">${hit.eppo0__hasEntityType}</span></a>`;
  }
  return "";
};

const eppo0__categories = (hit) => {
  if (hit.eppo0__categories) {
    return hit.eppo0__categories.map((category) => {
      return `<a href="https://localhost/wiki/Category:${category}"><span class="eppo0__category">${category}</span></a>`;
    });
  }
  return "";
};

const annotations = (hit, instantsearch) => {
  if (hit.annotations.length > 0) {
    return `<table class="eppo0__hasAnnotations">
              <tbody>
                ${hit.annotations
                  .map((annotation) => {
                    return `<tr>
                            <td><a href="https://localhost/wiki/Property:${annotation.predicate}">${annotation.predicate}</a></td>
                            <td>::</td>
                            <td>${annotation.objectLiteral}</td>
                          </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>`;
  }
  return "";
};

$(function () {
  require("./instant-meilisearch.umd.min.js");
  require("./instantsearch.js@4");
  console.debug(window.location.host);
  const search = instantsearch({
    indexName: "mediawiki",
    // FIXME: How to get these from $GLOBALS?
    searchClient: instantMeiliSearch(
      "http://" + window.location.host + ":7700",
      mw.config.get("wgDataspectsSearchKey")
    ),
    searchFunction(helper) {
      if (!helper.state.query) {
        let q = getUrlParameter("q");
        if (q) {
          helper.state.query = q;
        }
      }
      helper.search();
    },
  });
  search.addWidgets([
    instantsearch.widgets.configure({
      attributesToSnippet: ["mw0__text"],
    }),
    instantsearch.widgets.searchBox({
      container: "#searchbox",
      showReset: false,
      showSubmit: false,
    }),
    instantsearch.widgets.hierarchicalMenu({
      container: "#topic-types-hierarchical-menu",
      attributes: ["eppo0__hasEntityType.1v10", "eppo0__hasEntityType.1v11"],
      templates: {
        item: `
          <a class="{{cssClasses.link}}" href="{{url}}">
            <span class="badge eppo0__hasEntityType">{{label}}</span>
            <span class="badge ms-count">
              {{#helpers.formatNumber}}{{count}}{{/helpers.formatNumber}}
            </span>
          </a>
        `,
      },
    }),
    instantsearch.widgets.hierarchicalMenu({
      container: "#sources-hierarchical-menu",
      attributes: [
        "ds0__source.1v10",
        "ds0__source.1v11",
        "ds0__source.1v12",
        "ds0__source.1v13",
      ],
      templates: {
        item: `{{=<% %>=}}
          <a class="<%cssClasses.link%>" href="<%url%>">
            <span class="ds0__source"><%label%></span>
            <span class="ms-count">
              <%#helpers.formatNumber%><%count%><%/helpers.formatNumber%>
            </span>
          </a>
        `,
      },
      cssClasses: {
        parentItem: "parentItem",
        selectedItem: "selectedItem",
      },
    }),
    // FIXME: https://localhost/wiki/ by variable
    instantsearch.widgets.hits({
      container: "#hits",
      templates: {
        item(hit) {
          return `
            <div class="hit">
              <div>
                ${eppo0__hasEntityType(hit)}
                <a href="${hit.mw0__rawUrl}" class="eppo0__hasEntityTitle">
                  ${instantsearch.snippet({
                    attribute: "eppo0__hasEntityTitle",
                    highlightedTagName: "mark",
                    hit,
                  })}
                </a>
                ${eppo0__categories(hit)}
              </div>
              <div>
                ${mw0__text(hit, instantsearch)}
              </div>
              ${mw0__attachment(hit, instantsearch)}
              ${annotations(hit, instantsearch)}
            </div>`;
        },
        empty: `No results for <q>{{ query }}</q>`,
      },
    }),
  ]);
  search.start();
})();
