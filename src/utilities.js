import "jquery";

const importAll = (r) => r.keys().forEach(r);
importAll(require.context("./utilities", true));
