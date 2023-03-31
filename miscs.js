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


export const selection = (ref, selector, selectedClass) => {
  const items = document.querySelectorAll(selector);

  for(const item of items) {
    item.classList.remove(selectedClass);
  }

  ref.classList.add(selectedClass);
}


export class PersistMap {  
  #obj;

  constructor() {
      this.#obj = new Map();
  }
  
  put(key, value) {
      this.#obj.set(key, value);
  }

  get(value) {
      return this.#obj.get(value);
  }

  setDefault(key, defaultValue) {
      const prev = this.#obj.get(key);
      if(prev !== undefined) {
          return prev
      }
      this.#obj.set(key, defaultValue);
      
      return this.#obj.get(key);
  }
  
  pop(key) {
      if(key !== undefined) {
          const value = this.#obj.get(key);
          this.#obj.delete(key);
          
          return value
      }
      const last = this.#obj.size - 1;
      const lastKey = Array.from(this.#obj.keys())[last];
      const value = this.#obj.get(lastKey);
      
      this.#obj.delete(lastKey);

      return value
  }
}

export const createLabel = (id, title, checked, onChecked) => {
  const node = document.createElement('div');
  node.dataset.id = id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.name = btoa(title);
  checkbox.addEventListener('click', () => {
    onChecked(checkbox.checked);
  });

  const label = document.createElement('label');
  label.setAttribute('for', checkbox.name);
  label.textContent = title;
  
  node.appendChild(checkbox);
  node.appendChild(label);
  node.classList.add('draw-label');

  return node;
}
