const mainContainer = document.querySelector(".main-container");

const models = [
  {
    id: "01",
    name: "Model #1",
    thumbnail: "model_1.png",
  },
  {
    id: "02",
    name: "Model #2",
    thumbnail: "model_2.png",
  },
  { id: "03", name: "Model #3", thumbnail: "model_3.png" },
  { id: "04", name: "Model #4", thumbnail: "model_4.png" },
  { id: "05", name: "Model #5", thumbnail: "model_5.png" },
];

models.forEach((model) => {
  const modelCard = createModelCard(model);
  mainContainer.appendChild(modelCard);
});

function createModelCard(model) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("model-card");
  const thumbnail = document.createElement("img");
  thumbnail.src = `./resources/Models/${model.thumbnail}`;
  const innerDiv = document.createElement("div");
  const title = document.createElement("p");
  title.textContent = model.name;
  const description = document.createElement("span");
  description.textContent =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem nesciunt dignissimos assumenda exercitationem.";
  innerDiv.appendChild(title);
  innerDiv.appendChild(description);
  mainDiv.appendChild(thumbnail);
  mainDiv.appendChild(innerDiv);
  mainDiv.addEventListener(
    "click",
    () => (location.href = `model.html?${model.id}`),
    true
  );
  return mainDiv;
}
