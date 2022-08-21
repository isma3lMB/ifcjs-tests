import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { IfcWallStandardCase } from 'web-ifc';

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
    const project = await viewer.IFC.getSpatialStructure(model.modelID);
    createSpatialTreeMenu(project)

}

function createSpatialTreeMenu(ifcProject){
   
    const spatialTreeElement = document.getElementById("treeViewRoot");
    // clean tree before
    createParentNode(spatialTreeElement,ifcProject);

}



const modelId = location.search.substring(1).split('=')[1];

const modelPath = `./resources/IFC_Files/${modelId}.ifc`;


loadIfc(modelPath);

var toggler = document.getElementsByClassName("caret");

// for (var i = 0; i < toggler.length; i++) {
//   toggler[i].addEventListener("click", function() {
//     console.log("caret element clicked");
//     this.parentElement.querySelector(".nested").classList.toggle("active");
//     this.classList.toggle("caret-down");
//   });
// }


function nodeToString(node) {
    return `${node.type} - ${node.expressID}`
}

function createParentNode(parent, node){
    const content = nodeToString(node);
    const root = document.createElement('li');
    const span = document.createElement('span');
    span.dataset.expressID = node.expressID;
    span.classList.add('caret');
    span.textContent = content;

    span.addEventListener("click", function(event) {
        console.log(span.dataset.expressID);
        
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      })


    const nestedList = generateNestedList(node);
    root.appendChild(span);
    root.appendChild(nestedList);
    parent.appendChild(root);
 
}

function createSimpleNode(parent, node){
    const content = nodeToString(node);
    const simpleNode = document.createElement('li');
    simpleNode.textContent = content;
    parent.appendChild(simpleNode)
}

function generateNestedList(node){

    const nestedList = document.createElement("ul");
    nestedList.classList.add("nested");


    for (var child of node.children){
        var childElement;
        if (child.children.length === 0){
            childElement = createSimpleNode(nestedList, child);
        }
        else{
            childElement = createParentNode(nestedList, child);}
       

    }
    return nestedList;

}

dragElement(document.getElementById("treeView"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }