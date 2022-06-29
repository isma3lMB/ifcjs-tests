const modelId = location.search.substring(1);

const modelURL = `https://ifcjs.github.io/ifcjs-crash-course/sample-apps/${modelId}`;

const iframe = document.querySelector("iframe");

iframe.src = modelURL;
