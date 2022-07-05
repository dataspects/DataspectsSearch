$(function () {
  require("./meilisearch.umd.min.js");
  const client = new MeiliSearch({
    host: "http://" + window.location.host + ":7700",
    apiKey: mw.config.get("wgDataspectsSearchMasterKey"),
  });
})();
