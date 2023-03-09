// function to create new layer
export const createLayer = (layer) => {
    const node = document.createElement('div');
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = layer.get('visible');
    checkbox.name = btoa(layer.get('title'));
    checkbox.addEventListener('click', (e) => {
      layer.set('visible', e.target.checked);
    });
  
    const label = document.createElement('label');
    label.setAttribute('for', checkbox.name);
    label.textContent = layer.get('title');
    
    node.appendChild(checkbox);
    node.appendChild(label);
    node.classList.add('layer');
  
    return node;
}

export const selectThis = (elem) => {
  const tools = document.querySelectorAll('div[data-type]');
  for(const tool of tools) {
    if(tool === elem) {
      tool.classList.add('selected');
    } else {
      tool.classList.remove('selected');
    }
  }
}