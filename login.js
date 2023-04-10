import { login } from "./api";

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {};
    const formData = new FormData(form);

    for(const [k, v] of formData.entries()) {
        data[k] = v;
    }

    const response = await login(data);
    
    if(response.status === 200) {
        window.location.href = "/";
    } else {
        const msg = await response.json();
        
        if('detail' in msg) {
            alert(msg['detail']);
        } else {
            alert('<other message>')
        }

        form.reset();
    }
})