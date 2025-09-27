/*! time: 2025/9/2 15:53:10; branch: master describe: a5a458eaa commit: a5a458eaa9bf68029f66b1a68081ce87c8783674 */
function isRemoteURL(URL) {
  return /^(blob:http|https?):\/\/.+/.test(URL);
}
function createResourceURL(URL, baseUrl) {
  return isRemoteURL(URL) ? URL : baseUrl + URL;
}
function getImageWidgetStyle(asset, baseUrl) {
  return getBackgroundStyle(getImageWidgetSrc(asset), baseUrl || "");
}
function getImageWidgetSrc(asset) {
  if (!asset) {
    return "";
  }
  if (asset.type === "custom" || asset.type === "internal") {
    return asset.name;
  }
  return asset.value;
}
function getBackgroundStyle(imageSource, baseUrl) {
  if (!imageSource) {
    return {};
  }
  const url = createResourceURL(imageSource, baseUrl);
  return {
    background: `url(${url})`
  };
}
function getSourceFromResource(resource, baseUrl) {
  if (!resource) {
    return "";
  }
  if (resource.type === "internal" || resource.type === "custom") {
    return resource.name && createResourceURL(resource.name, baseUrl || "");
  }
  return resource.value;
}
function isImageContentProps(content) {
  if (!content) return false;
  return content.type === "image";
}
function isVideoContentProps(content) {
  if (!content) return false;
  return content.type === "video";
}
const templateLoadStyles = {
  templateLoadContainer: {
    position: "absolute",
    zIndex: "99999",
    backgroundSize: "auto",
    inset: "0",
    overflow: "hidden"
  },
  templateLoadClose: {
    position: "absolute",
    top: "5%",
    right: "5%",
    display: "flex",
    width: "46px",
    height: "46px",
    border: "none",
    backgroundColor: "#00000073",
    backgroundImage: 'url("data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTAyNCAxMDI0JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzIwMCcgaGVpZ2h0PScyMDAnPjxwYXRoIGQ9J001NjMuODQgNTEybDI2Mi40LTMxMi45NmE3LjkzNiA3LjkzNiAwIDAgMC02LjAxNi0xMy4wNTZoLTc5LjgwOGExNi4yNTYgMTYuMjU2IDAgMCAwLTEyLjI4OCA1Ljc2TDUxMS42MTYgNDQ5LjcyOCAyOTUuMDQgMTkxLjY4YTE2IDE2IDAgMCAwLTEyLjI4OC01LjY5NkgyMDMuMDA4YTcuOTM2IDcuOTM2IDAgMCAwLTYuMDggMTMuMTJMNDU5LjM5MiA1MTJsLTI2Mi40NjQgMzEyLjk2YTcuOTM2IDcuOTM2IDAgMCAwIDYuMDggMTMuMDU2aDc5LjgwOGExNi4zMiAxNi4zMiAwIDAgMCAxMi4yODgtNS43NmwyMTYuNTEyLTI1OC4wNDggMjE2LjUxMiAyNTguMTEyYTE2IDE2IDAgMCAwIDEyLjI4OCA1LjY5Nmg3OS44MDhhNy45MzYgNy45MzYgMCAwIDAgNi4wOC0xMy4xMkw1NjMuNzc2IDUxMnonIGZpbGw9JyNmZmZmZmYnPjwvcGF0aD48L3N2Zz4=")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "22px 22px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "22px",
    borderRadius: "4px",
    visibility: "hidden"
  },
  templateLoadingVideoImage: {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain"
  }
};
function updateLoadingContent() {
  const {
    templateLoadConfig
  } = window;
  if (!templateLoadConfig || Object.keys(templateLoadConfig).length === 0) return;
  const {
    loadConfig,
    resourceBaseUrl: baseUrl
  } = templateLoadConfig;
  const loadingContentElement = document.createElement("div");
  loadingContentElement.id = "template-load-container";
  loadingContentElement.style.background = loadConfig.backgroundColor;
  Object.assign(loadingContentElement.style, templateLoadStyles.templateLoadContainer);
  document.body.appendChild(loadingContentElement);
  if (!loadConfig.enableLoad) return;
  if (loadingContentElement) {
    const {
      content
    } = loadConfig;
    if (isImageContentProps(content)) {
      const imageElement = document.createElement("div");
      imageElement.id = "template-loading-image";
      const {
        resource,
        hue,
        opacity,
        contrast,
        brightness,
        saturation
      } = content;
      imageElement.style.backgroundImage = getImageWidgetStyle(resource, baseUrl).background || "";
      imageElement.style.filter = `hue-rotate(${hue}deg) saturate(${saturation + 100}%) brightness(${brightness + 100}%) contrast(${contrast + 100}%)`;
      imageElement.style.opacity = `${opacity / 100}`;
      Object.assign(imageElement.style, templateLoadStyles.templateLoadingVideoImage);
      loadingContentElement.appendChild(imageElement);
    } else if (isVideoContentProps(content)) {
      const {
        resource,
        fillType
      } = content;
      loadingContentElement.innerHTML = "";
      const src = getSourceFromResource(resource, baseUrl);
      const videoElement = document.createElement("video");
      videoElement.setAttribute("playsinline", "true");
      videoElement.setAttribute("webkit-playsinline", "true");
      videoElement.id = "template-loading-video";
      videoElement.src = src;
      videoElement.style.objectFit = fillType;
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.loop = true;
      Object.assign(videoElement.style, templateLoadStyles.templateLoadingVideoImage);
      loadingContentElement.appendChild(videoElement);
    }
  }
}
function closeTemplateLoad() {
  const {
    templateLoadConfig
  } = window;
  if (!templateLoadConfig) return;
  const {
    loadConfig
  } = templateLoadConfig;
  function removeTemplateLoad() {
    const templateLoadContainer = document.getElementById("template-load-container");
    if (templateLoadContainer) {
      templateLoadContainer.style.display = "none";
      const clonedTemplateLoadContainer = templateLoadContainer.cloneNode(true);
      templateLoadContainer.replaceWith(clonedTemplateLoadContainer);
      document.body.removeChild(clonedTemplateLoadContainer);
    }
    window.closeTemplateLoad = void 0;
  }
  if (!loadConfig || !loadConfig.enableLoad || loadConfig.loadTimeConfig.type === "auto") {
    removeTemplateLoad();
    return;
  }
  const loadingContentElement = document.getElementById("template-load-container");
  const closeButton = document.createElement("div");
  closeButton.id = "template-load-close";
  Object.assign(closeButton.style, templateLoadStyles.templateLoadClose);
  loadingContentElement.appendChild(closeButton);
  if (!closeButton) return;
  let mousemove = null;
  function handleMouseMove() {
    if (mousemove) {
      clearTimeout(mousemove);
    }
    closeButton.style.visibility = "visible";
    mousemove = setTimeout(() => {
      closeButton.style.visibility = "hidden";
    }, 3e3);
  }
  function handleKeyDown(event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      cleanupEventListeners();
      removeTemplateLoad();
    }
  }
  function handleCloseButtonClick() {
    cleanupEventListeners();
    removeTemplateLoad();
  }
  function cleanupEventListeners() {
    window.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("keydown", handleKeyDown);
    closeButton.removeEventListener("click", handleCloseButtonClick);
  }
  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("keydown", handleKeyDown);
  closeButton.addEventListener("click", handleCloseButtonClick);
}
function setTemplateTimeoutClose() {
  const {
    templateLoadConfig
  } = window;
  if (!templateLoadConfig) return;
  const {
    loadConfig
  } = templateLoadConfig;
  if (!loadConfig || !loadConfig.enableLoad || loadConfig.loadTimeConfig.type === "auto" || !loadConfig.loadTimeConfig.time) {
    return;
  }
  setTimeout(() => {
    const closeButton = document.getElementById("template-load-close");
    if (templateLoadConfig && closeButton) {
      closeButton.click();
    } else {
      if (templateLoadConfig.loadConfig.loadTimeConfig) {
        templateLoadConfig.loadConfig.loadTimeConfig.type = "auto";
      }
    }
  }, loadConfig.loadTimeConfig.time * 1e3);
}
updateLoadingContent();
window.closeTemplateLoad = closeTemplateLoad;
setTemplateTimeoutClose();
