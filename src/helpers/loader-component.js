export async function loadComponent(path, targetId) {
  const res = await fetch(path);
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const template = temp.querySelector("template");
  const clone = template.content.cloneNode(true);

  document.getElementById(targetId).appendChild(clone);
}
