
"use strict"
const AppySelectStore = {};
let AppyMultiIndex = 0;

/* @Props
    multiple: boolean
    selector: string
    options: <label, value>[]
    onChange: fn
*/

const selectFactoryAdd = (multiple, selector, options, onChange) => {
    if(!options.length) {
        options = [{ value: '', label: ''}];
    }
    
    const changeMultiSelections = (optionEl, label) => {
        if (AppySelectStore[key].includes(label)) {
            AppySelectStore[key].splice(AppySelectStore[key].indexOf(label), 1);
            optionEl.classList.remove('selected');
        } else {
            AppySelectStore[key].push(label);
            optionEl.classList.add('selected');
        }
        updateContainer(AppySelectStore[key]);
    }

    const changeSingleSelections = (optionEl, label) => {
        if (AppySelectStore[key].includes(label)) {
            AppySelectStore[key] = undefined;
        } else {
            AppySelectStore[key] = label;
        }
        container.classList.remove('opened')
        updateContainer(AppySelectStore[key]);
    }

    const changeSelections = multiple ? changeMultiSelections : changeSingleSelections;
    
    const updateContainer = (selected) => {
        if (selected.length > 0) {
            container.value = selected;
            inner.innerText = multiple ? selected.join(', ') : selected;
        } else {
            container.value = '';
            inner.innerText = options[0].label;
        }
        container.dispatchEvent(new window.Event('change', { bubbles: true }));
    };
    
    // stores values of dropdown
    AppySelectStore[AppyMultiIndex] = [];
    const key = AppyMultiIndex;
    
    const container = document.createElement('div');
    container.classList.add('multi');
    container.setAttribute('key', key);
    
    // create inner (displays the values)
    const inner = document.createElement('div');
    inner.classList.add('multi__inner');
    inner.innerText = options[0].label;

    const display = document.createElement('button');
    container.appendChild(display);
    display.appendChild(inner);

    // add to parent
    const parent = document.querySelector(selector);
    parent.appendChild(container);

    // create dropdown
    const dropdown = document.createElement('div');
    dropdown.classList.add('multi__dropdown');

    // create ul
    const list = document.createElement('ul');
    for (let i = 1; i < options.length; i++) {
        const li = document.createElement('li');
        li.innerText = options[i].label;
        
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            const label = e.target.innerText;
            changeSelections(e.target, label)
        });
        list.appendChild(li);
    }

    container.addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.toggle('opened');
    });

    if(onChange) {
        container.addEventListener('change', e => {
            onChange(container.value);
        })
    }

    container.appendChild(dropdown);
    dropdown.appendChild(list);
    AppyMultiIndex ++;
};

// add event listener to window
document.addEventListener('click', (e) => {
    document.querySelectorAll('.multi').forEach((el) => {
        el.classList.remove('opened');
    });
});

window.selectFactory = {
    add (multiple, selector, options, onChange) {
        selectFactoryAdd(multiple, selector, options, onChange);
    }
};