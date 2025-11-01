const importAll = (r) => r.keys().forEach(r);
importAll(require.context("./channels", true));
