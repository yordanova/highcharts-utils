
"use strict"
const AppySelectStore = {};
let AppyMultiIndex = 0;

/**
  * @param multiple: boolean
  * @param selector: string
  * @param options: {label, value}[]
  * @param onChange: fn
  * @param defaultLabel: string
  */

const selectFactoryAdd = (multiple, props) => {
    let options = props.options;
    const onChange = props.onChange;
    const defaultLabel = props.defaultLabel;
    const defaultValue = props.defaultValue;

    if(!options.length) {
        options = [{ value: ' ', label: ' '}];
    }
    const selectOption = (el) => {
        const value = el.innerText;
        const idx = AppySelectStore[key].indexOf(value);
        if(idx === -1) {
            AppySelectStore[key].push(value);
        }
        el.classList.add('selected');
    }

    const unselectOption = (el) => {
        const value = el.innerText;
        const idx = AppySelectStore[key].indexOf(value);
        if (idx > -1) {
            AppySelectStore[key].splice(idx, 1);
        }
        el.classList.remove('selected');
    }

    const onMultiSelectChange = (el) => {
        const value = el.innerText;
        const idx = AppySelectStore[key].indexOf(value);
        if (idx == -1) {
            selectOption(el)
        } else {
            unselectOption(el);
        }
        updateMultiContainer();
    }

    const toggleSelectAll = (select, doNotDispatchChange) => {
        container.querySelectorAll('li')
            .forEach(el => {
                if(el.id !== 'selectAll') {
                    if(!select) {
                        unselectOption(el);
                    }
                    else selectOption(el);
                } 
            });
        updateMultiContainer(doNotDispatchChange);
    }

    const updateMultiContainer = (doNotDispatchChange) => {
        const selected = AppySelectStore[key];
        inner.querySelector('i').innerText = selected.length  || '';

        const sli = container.querySelector("#selectAll");
        if(options.length === selected.length) {
            sli.classList.add('selected');
            container.value = undefined;
        } else {
            sli.classList.remove('selected');
            container.value = selected;
        }
        if(!doNotDispatchChange) {
            container.dispatchEvent(new window.Event('change', { bubbles: true }));
        }
    }

    const onSingleSelectChange = (el) => {
        if(!el) {
            el = dropdown.querySelector('li');
        }
        const value = el.innerText;
        if (AppySelectStore[key].includes(value)) {
            AppySelectStore[key] = undefined;
        } else {
            AppySelectStore[key] = value;
        }
        container.classList.remove('opened')
        const selected = AppySelectStore[key];
        if (selected.length > 0) {
            container.value = selected;
            inner.innerText = selected;
        } else {
            container.value = '';
            inner.innerText = options[0].label;
        }
        container.dispatchEvent(new window.Event('change', { bubbles: true }));
    }

    const createOption = (value)=> {
        const li = document.createElement('li');
        li.innerText = value;
        li.setAttribute('data-value', value);
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            if(multiple) {
                onMultiSelectChange(e.target)
            }
            else onSingleSelectChange(e.target)
        });
        return li;
    }

    const createSelectAllOption = () => {
        const li = document.createElement('li');
        li.innerText = 'Select All';
        li.id = 'selectAll';
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            const allSelected = e.target.classList.contains('selected');
            toggleSelectAll(!allSelected);
        });
        return li;
    }
    
    // stores values of dropdown
    AppySelectStore[AppyMultiIndex] = [];
    const key = AppyMultiIndex;
    
    const container = document.createElement('div');
    container.classList.add('multi');
    container.setAttribute('key', key);
    
    // create inner (displays the values)
    const inner = document.createElement('div');
    inner.classList.add('multi__inner');
    inner.innerHTML = multiple ? `<span>${defaultLabel}<i></i></span>` : options[0].label;
    
    const display = document.createElement('button');
    container.appendChild(display);
    display.appendChild(inner);

    // create dropdown
    const dropdown = document.createElement('div');
    dropdown.classList.add('multi__dropdown');

    // create list
    const list = document.createElement('ul');
    if(multiple) {
        list.appendChild(createSelectAllOption())
    }
    options.forEach(option => {
        list.appendChild(createOption(option.label));
    });

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
    if (multiple) {
        toggleSelectAll(true, true);
    } 
    AppyMultiIndex ++;
    return container;
};

// add event listener to window
document.addEventListener('click', (e) => {
    document.querySelectorAll('.multi').forEach((el) => {
        el.classList.remove('opened');
    });
});

// if iframe add event listener to parent
if(parent) {
    parent.document.addEventListener('click', function(e) {
        document.querySelectorAll('.multi').forEach((el) => {
            el.classList.remove('opened');
        });
    });
}

window.selectFactory = {
    // @TODO change custom record
    createMulti (props) {
        return selectFactoryAdd(true, props);
    },
    createSingle (props) {
        return selectFactoryAdd(false, props);
    },
    create(multiple, props) {
        return selectFactoryAdd(multiple, props)
    }
};