import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-canvas-container');

const isDarkMode = localStorage.getItem("isDarkMode");


const backgroundColor = isDarkMode == "true" ? new Color(0x212121) : new Color(0xe8e8e8);

const viewer = new IfcViewerAPI({ container, backgroundColor: backgroundColor });
viewer.grid.setGrid();

viewer.axes.setAxes();

async function loadIfc(url) {
    await viewer.IFC.setWasmPath("../");
    const model = await viewer.IFC.loadIfcUrl(url);
    console.log(model)
    viewer.shadowDropper.renderShadow(model.modelID);
}



const modelId = location.search.substring(1).split('=')[1];

const modelPath = `./resources/IFC_Files/${modelId}.ifc`;

loadIfc(modelPath);

// const iframe = document.querySelector("iframe");

// iframe.src = modelURL;
