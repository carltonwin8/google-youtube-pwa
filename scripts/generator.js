require("babel-register")({ presets: ["react"] });
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const prettier = require("prettier");

const debounce = require("./debounce");

const cl = console.log;
const watcher = chokidar.watch("src", { ignored: /^\./, persistent: true });
watcher
  .on("add", fpth => cl(fpth, "added") || debouncedGenerate())
  .on("change", fpth => cl(fpth, "changed") || debouncedGenerate())
  .on("unlink", fpth => cl(fpth, "removed"))
  .on("error", error => console.error("Error happened", error));

const templates = `../src/templates/pages`;
const components = `../src/templates/components`;

const genfile = file => {
  const page = require(path.join(__dirname, templates, file));
  const pageStr = ReactDOMServer.renderToString(React.createElement(page));
  const pretty = prettier.format(pageStr, { parser: "babel" });
  const outStr = pretty.replace("</html>;", "</html>");
  const outStr2 = outStr.replace(' data-reactroot=""', "");
  const outStr3 = "<!DOCTYPE html>\n" + outStr2;
  const outDir = path.join(__dirname, "../build");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, file.replace(".js", ".html"));
  fs.writeFileSync(outFile, outStr3);
  console.log(`Processed ${file}`);
};

const generate = () => {
  try {
    const componentFs = fs.readdirSync(path.join(__dirname, components));
    const files = fs.readdirSync(path.join(__dirname, templates));
    const pages = files.map(f => path.join(__dirname, templates, f));
    const comps = componentFs.map(c => path.join(__dirname, components, c));
    [...pages, ...comps].forEach(
      req => delete require.cache[require.resolve(req)]
    );
    files.forEach(file => genfile(file));
  } catch (e) {
    console.log(`Failed with`, e);
  }
};
const debouncedGenerate = debounce(generate, 1000);
