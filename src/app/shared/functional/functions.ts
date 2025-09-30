export function setBackground(path: string, color: boolean = false) {
  const pageElement = document.getElementById('page');
  if (pageElement && !color) {
    pageElement.style.background = `url(${path})`;
  } else if (pageElement && color) {
    pageElement.style.background = path;
  }
}
