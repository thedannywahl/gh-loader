const gh = {};const version = "4.0.1";
const packageJSON = {
  version
};
gh.debug = false;
const getLogMethod = (type) => {
  return console[type] || console.log;
};
const isConsole = (value) => {
  return typeof value === "string" && [
    "log",
    "warn",
    "error",
    "info",
    "group",
    "groupCollapsed",
    "groupEnd"
  ].includes(value);
};
const log = (...args) => {
  if (gh.debug) {
    const [methodOrMessage, ...rest] = args;
    const type = isConsole(methodOrMessage) ? methodOrMessage : "log";
    const logArgs = typeof methodOrMessage === "object" ? [JSON.stringify(methodOrMessage), ...rest] : [methodOrMessage, ...rest];
    const logMethod = getLogMethod(type);
    if (type === "group" || type === "groupCollapsed") {
      logMethod(...rest);
    } else if (type === "groupEnd") {
      console.groupEnd();
    } else {
      logMethod(...logArgs);
    }
  }
};
const insert = ({
  content,
  raw_url,
  type = "inline",
  source = "gist",
  tag = "script",
  attributes = {},
  async = false,
  defer = false
}) => {
  log(`Type: ${type} ${tag}`, "Source:", { content, raw_url });
  const elementType = type === "inline" ? tag : tag === "script" ? "script" : "link";
  const element = document.createElement(elementType);
  if (type === "inline") {
    element.textContent = content;
    if (tag === "style") {
      element.setAttribute("type", "text/css");
    }
  } else {
    const src = source === "gist" ? raw_url.replace("gist.githubusercontent", "gistcdn.githack") : `https://rawcdn.githack.com/${content}`;
    const attr = tag === "script" ? "src" : "href";
    element.setAttribute(attr, src);
    if (tag === "style") {
      element.setAttribute("rel", "stylesheet");
    }
  }
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  if (tag === "script") {
    if (async) element.setAttribute("async", "true");
    if (defer) element.setAttribute("defer", "true");
  }
  log(`${tag.charAt(0).toUpperCase() + tag.slice(1)} Element:`, element);
  const target = tag === "script" ? document.body : document.head;
  target.appendChild(element);
};
const getFileInfo = (fileName) => {
  var _a;
  const ext = typeof fileName === "string" && fileName.includes(".") ? ((_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase()) || "" : "";
  const status = ext === "js" || ext === "css" ? "Loading" : "Skipping";
  const color = ext === "js" || ext === "css" ? "green" : "gray";
  return { status, color, ext };
};
const processFile = async ({
  data: fileData,
  name: fileName,
  id: sourceId,
  type: sourceType,
  isTruncated = false
}) => {
  const { status, color, ext } = getFileInfo(fileName);
  const logMessage = [
    `%c${status} %cfile '${fileName}' from ${sourceType} '${sourceId}'`,
    `color: ${color}; font-weight: normal`,
    "font-weight: normal"
  ];
  log("groupCollapsed", ...logMessage);
  if (ext !== "js" && ext !== "css") {
    log("Source:", fileData);
  } else {
    insert({
      content: fileData,
      raw_url: fileData,
      type: isTruncated ? "remote" : "inline",
      source: sourceType,
      tag: ext === "js" ? "script" : "style",
      attributes: {
        "data-gh-id": sourceId,
        "data-gh-file": fileName,
        "data-gh-type": isTruncated ? "remote" : "inline",
        "data-gh-source": sourceType
      }
    });
  }
  log("groupEnd");
};
const process = async ({
  source,
  isRepo = false
}) => {
  if (isRepo) {
    const cleanedPath = source.replace(/^\//, "").replace("blob/", "");
    const [user, repo, ...rest] = cleanedPath.split("/");
    const fileName = rest.pop() || "";
    const filePath = rest.join("/");
    const fileData = { content: filePath };
    await processFile({
      data: fileData.content,
      name: fileName,
      id: `${user}/${repo}`,
      type: "repo",
      isTruncated: true
    });
  } else {
    try {
      const response = await fetch(`https://api.github.com/gists/${source}`);
      const data = await response.json();
      const files = data.files;
      for (const [fileName, fileData] of Object.entries(files)) {
        await processFile({
          data: fileData.content,
          name: fileName,
          id: source,
          type: "gist",
          isTruncated: fileData.truncated
        });
      }
    } catch (error) {
      log("error", `Failed to fetch gist ${source}:`, error);
    }
  }
};
const load = async (list) => {
  const { version: version2 } = packageJSON;
  log("group", `%cgh-loader ${version2}`, "color: inherit; font-weight: bold;");
  if (Array.isArray(list) && list.length === 0) {
    log("warn", "No Gist ID or repository file path provided.");
    return;
  }
  const items = Array.isArray(list) ? list : [list];
  for (const item of items) {
    await process({ source: item, isRepo: item.includes("/") });
  }
  log("groupEnd");
};
load("thedannywahl/gh-loader/blob/main/public/default.js");
