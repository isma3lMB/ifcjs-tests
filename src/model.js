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
    const project = await viewer.IFC.getSpatialStructure(model.modelID);
    await createSpatialTreeMenu(project)

}

async function createSpatialTreeMenu(ifcProject){
   
    const spatialTreeElement = document.getElementById("treeViewRoot");
    // clean tree before
    await createParentNode(spatialTreeElement,ifcProject);

}



const modelId = location.search.substring(1).split('=')[1];

const modelPath = `./resources/IFC_Files/${modelId}.ifc`;


loadIfc(modelPath);




async function nodeToString(node) {

  const nodeProps =  await viewer.IFC.loader.ifcManager.properties.getItemProperties(0,node.expressID) ; /// should not hard code modelId
  return `${nodeProps.Name.value} \u2011 ${node.expressID}`
}

async function createParentNode(parent, node){
    const content = await nodeToString(node);
    const root = document.createElement('li');
    const span = document.createElement('span');
    span.dataset.expressID = node.expressID;
    span.classList.add('caret');
    span.classList.add(node.type.toLowerCase())
    span.textContent = content;
    

    span.addEventListener("click", function(event) {
        console.log(span.dataset.expressID);
        
        this.parentElement.querySelector(".nested").classList.toggle("active-tree");
        this.classList.toggle("caret-down");
      })


    const nestedList = await generateNestedList(node);
    root.appendChild(span);
    root.appendChild(nestedList);
    parent.appendChild(root);
 
}

async function createSimpleNode(parent, node){
    const content = await nodeToString(node);
    const simpleNode = document.createElement('li');
    simpleNode.textContent = content;
    parent.appendChild(simpleNode)
}

async function generateNestedList(node){

    const nestedList = document.createElement("ul");
    nestedList.classList.add("nested");


    for (var child of node.children){
        var childElement;
        if (child.children.length === 0){
            childElement = await createSimpleNode(nestedList, child);
        }
        else{
            childElement = await createParentNode(nestedList, child);}
       

    }
    return nestedList;

}


dragElement(document.getElementById("tree-view"));
dragElement(document.getElementById("property-view"));
dragElement(document.getElementById("viewer-toolbox"));


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
window.ondblclick = async () =>{
  if(viewer.dimensions.active){
    viewer.dimensions.create();
    return;
  }
  
  var selection = await viewer.IFC.selector.pickIfcItem();
  if (! selection){
    viewer.IFC.selector.unpickIfcItems();
    return;
  }

  const properties = await viewer.IFC.getProperties(selection.modelID , selection.id,true,true);
  
  console.log(properties)
  removeChildren(propMenuContent);
  populatePropPanel(getAttributesFromProperties(properties),getPsetsFromProperties(properties))


} 
// window.onmousemove = async () => await viewer.IFC.selector.prePickIfcItem();

const propMenuContent = document.getElementById("property-view-content");

function removeChildren(htmlElement){
  while(htmlElement.firstChild){
    htmlElement.removeChild(htmlElement.firstChild);
  }

}

function getAttributesFromProperties(properties){
  return{
    Name : (properties.Name)? properties.Name.value : "undefined",
    GlobalId : properties.GlobalId.value,
    ObjectType: (properties.ObjectType)? properties.ObjectType.value : "undefined",
    PredefinedType : (properties.PredefinedType)? properties.PredefinedType.value : "",
    Tag : (properties.Tag)? properties.Tag.value : "",
    ExpressId : properties.expressID
  }
};

function getPsetsFromProperties(properties){
  const psetsMap = {};
  if (properties.psets){
    properties.psets.map(pset => {
      const props = {};
      pset.HasProperties.map(prop => {
        props[prop.Name.value] = prop.NominalValue.value; // Should check for property type prop.constructor.name
      })

      psetsMap[pset.Name.value] = props
    })
  }

  return psetsMap;
};

function populatePropPanel(attributes, properties){
  generateSection("Attributes" , attributes);
  for (var pset in properties){
    generateSection(pset, properties[pset]);
  }
}

function generateSection(name, keyValues){
  const title = document.createElement("button");
  title.textContent = name;
  title.classList.add("accordion");
  
  const panel = document.createElement("div");
  panel.classList.add("panel");
  for (var propName in keyValues){
    const propLine = document.createElement("div");
    propLine.classList.add('prop-line');
    const name = document.createElement('p');
    name.textContent = propName;
    const value = document.createElement('p');
    value.textContent = keyValues[propName];
    propLine.appendChild(name);
    propLine.appendChild(value);
    panel.appendChild(propLine);
  }
  title.classList.add("active");
  propMenuContent.appendChild(title);
  propMenuContent.appendChild(panel);
  title.addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "none") {
    panel.style.display = "block";
    } else {
    panel.style.display = "none";
    }
});

}

viewer.IFC.selector.defSelectMat.color = new Color(0x00ffff);
// viewer.IFC.selector.defSelectMat.depthTest = true;
viewer.clipper.active = true ;


window.onkeydown = (event) => {
  console.log(event)
  if (event.key === 'p'){
    viewer.clipper.createPlane();
  }
  if (event.key === 'r'){
    viewer.clipper.deletePlane();
  }
  if (event.key === 'd'){
    viewer.clipper.deleteAllPlanes();
  }
  if (event.key === 'm' ){
    
  }
  if(event.code === 'Delete') {
    viewer.dimensions.delete();
}
  
}



document.getElementById("measure-tool").onclick = ()=>{
  const isActive =  viewer.dimensions.active;
  viewer.dimensions.active = !isActive;
  viewer.dimensions.previewActive = !isActive;
  if (isActive){
    viewer.dimensions.deleteAll();
  };

}

