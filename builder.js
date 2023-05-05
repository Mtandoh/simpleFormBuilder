
// Custom JavaScript Library for Drag & Drop Form Builder
const formBuilderLibrary = (function (options) {

    //to prevent multiple ajax calls
    var elementOptionsAJAX = {};
    var mathRegExp = /\s*{.*?}\s*/g;

    // Public API functions
    return {
        /**
         * Attach the formBuilder or renderForm function to the given element.
         * @param options
         */
        attachToElement: function (options) {
            const {
                initialFormData,
                mode,
                buttons,
                eventHandlers,
                formElement,
                saveFormAction,
            } = options;
            options = options || {};
            options.buttons = options.buttons || [];
            options.eventHandlers = options.eventHandlers || {};
            options.saveFormAction = options.saveFormAction || '';
            options.initialFormData = options.initialFormData || [];
            options.mode = options.mode || 0;
            let elem = document.querySelector(options.formElement);
            if (elem) {
                if (options.mode === 1) {
                    formBuilder(elem,options);
                    elem = document.querySelector('ul.sfb-connected');
                }
                    renderForm(options.initialFormData,options.mode,elem);
            }
        }

    }
    // Private utility functions

    /**
     * Initialize the drag and drop plugin.
     * @param {HTMLElement} elem - The DOM element to initialize the form builder on.
     * @param options
     */
    function formBuilder(elem,options) {

        const formica = getFormicaHTML();
        const menu = getMenuHTML(options);

        elem.classList.add("sfb-row", "sfb-formized");
        elem.innerHTML = formica + menu;

        attachEventListeners(elem,options);
    }



    /**
     * Renders elements from a JSON array.
     * @param {Array} jsons - The JSON array to render elements from.
     * @param {number} mode - The rendering mode (2 or 3).
     * @param element
     * @returns {string | undefined} The rendered elements, or undefined if mode is not 2.
     */
    function renderForm(jsons, mode, element) {
        if (!Array.isArray(jsons) || typeof mode !== "number") {
            return;
        }
        let outDiv = "";
        jsons.forEach((json) => {
            let outputType;
            outputType = checkType(json, mode);
            outDiv += outputType;
        });

            element.innerHTML = outDiv;
    }

    /**
     * Get the Formica HTML string.
     * @returns {string} Formica HTML string.
     */
    function getFormicaHTML() {
        return `<div id="mainFormEdit" class="sfb-col-md-9 sfb-formica">
      <ul class="sfb-connected" data-content="Drag a field from the right to this area"></ul>
    </div>
  `;
    }

    /**
     * Get the Menu HTML string.
     * @returns {string} Menu HTML string.
     */
    function getMenuHTML(options) {

        let customButtonsHTML = '';
        options.buttons.forEach((button) => {
            customButtonsHTML += `<button class="sfb-btn ${button.className}" id="${button.id}">${button.text}</button>`;
        });

        return `
        <div class="sfb-col-md-2">
            <div id="FormEditItems">
                <ul id="sortable1" class="sfb-connectedSortable">
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="checkbox" data-class="sfb-main-form " data-index="15">Checkbox Group</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="radio" data-class="sfb-main-form " data-index="14">Radio Group</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="select" data-class="sfb-main-form " data-index="17">Select</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="datalist" data-class="sfb-main-form " data-index="27">Data List</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="text" data-class="sfb-main-form " data-index="1">Text Field</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="textarea" data-class="sfb-main-form " data-index="16">Text Area</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="date" data-class="sfb-main-form " data-index="9">Date Field</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="number" data-class="sfb-main-form " data-index="2">Number</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="range" data-class="sfb-main-form " data-index="23">Range</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="hidden" data-class="sfb-main-form " data-index="28">Hidden</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="paragraph" data-class="sfb-main-form " data-index="18">Paragraph</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="header" data-class="sfb-main-form " data-index="21">Header</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="picture" data-class="sfb-main-form " data-index="24">Picture</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="payment" data-class="sfb-main-form " data-index="25">Payment</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="conjoint" data-class="sfb-main-form" data-index="30">Conjoint</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="table" data-class="sfb-panel sfb-panel-default sfb-main-form " data-index="22">Table</li>
        <li class="sfb-btn sfb-btn-default sfb-btn-block sfb-input-drag-btn" data-type="button" data-class="sfb-main-form " data-index="29">Button</li>
                </ul>
                <div class="sfb-pull-right">
                    <button class="sfb-btn sfb-btn-danger"  id="resetBtn">Reset</button>
                    <button class="sfb-btn sfb-btn-success" id="saveBtn">Save</button>
                    ${customButtonsHTML}
                </div>
            </div>
        </div>
    `;
    }

    /**
     * Attach event listeners to the elements.
     * @param {HTMLElement} container - The container element.
     * @param options
     */
    function attachEventListeners(container,options) {
        const containerID = container.getAttribute('id')
        container.addEventListener("mouseover", handleDelButtonHover);
        container.addEventListener("mouseout", handleDelButtonHover);

        Object.keys(options.eventHandlers).forEach((eventId) => {
            const handler = options.eventHandlers[eventId];
            const element = container.querySelector(`#${eventId}`);
            if (element) {
                element.addEventListener('click', handler);
            }
        });
        container.addEventListener("click", (event) => {
            const target = event.target;
            if (target.closest("#resetBtn")) {
                resetForm(containerID);
            } else if (target.closest("#saveBtn")) {
                saveFormData(options.saveFormAction);
            } else if (target.closest(".sfb-toggle-form")) {
                const element = target.closest(".sfb-toggle-form");
                editElement(element.dataset.id, element.dataset.elementtype);
            } else if (target.closest(".sfb-copy-button")) {
                const element = target.closest(".sfb-copy-button");
                copyElement(element.dataset.id);
            } else if (target.closest(".sfb-del-button")) {
                const element = target.closest(".sfb-del-button");
                deleteFormElement(element.dataset.id);
            }
        });

        const btns = Array.from(container.querySelectorAll(".sfb-input-drag-btn"));
        btns.forEach((btn) => {
            btn.setAttribute('draggable', 'true');
        });

        // Initialize the draggable and sortable features
        initializeDraggableAndSortable(container);
    }

    /**
     * Initialize the draggable and sortable features for the elements in the container
     * @param {HTMLElement} container - The container element.
     */
    function initializeDraggableAndSortable(container) {
        let draggedItem = null;

        const draggables = container.querySelectorAll(".sfb-input-drag-btn");
        draggables.forEach((draggable) => {
            draggable.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", "");
                draggedItem = event.target;
            });
        });

        const sortables = container.querySelectorAll(".sfb-connected");
        sortables.forEach((sortable) => {
            sortable.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            sortable.addEventListener("drop", (event) => {
                event.preventDefault();
                const newItem = checkType({...draggedItem.dataset}, 1);
                sortable.appendChild(createElementFromHTML(newItem));
                draggedItem = null;
            });
        });
    }

    function createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    /**
     * Handle the hover event for the delete button.
     * @param {Event} ev - The event object.
     */
    function handleDelButtonHover(ev) {
        const target = ev.target;

        if (target.classList.contains("sfb-del-button")) {
            const container = target.parentElement.parentElement;
            if (ev.type === "mouseover") {
                container.classList.add("sfb-del-button_main-form_hover");
            } else {
                container.classList.remove("sfb-del-button_main-form_hover");
            }
        }
    }

    /**
     * Generates field label and actions elements.
     * @param {string} id - The field id.
     * @param {string} dataType - The data type of the field.
     * @returns {object} - An object containing the field label and actions elements.
     */
    function generateFieldLabelAndActions(id, dataType) {
        const fieldLabel = `
    <label id="field_${id}" for="${id}" class="sfb-fb-repType-Label sfb-formzone sfb-pull-left">
      <span id="label_span_${id}">Text Field</span>
      <span id="history_span_${id}"></span>
    </label>
  `;
        const fieldActions = `
    <div class="sfb-pull-right sfb-field-actions">
      <a class="sfb-toggle-form sfb-btn glyphicon glyphicon-pencil" data-id="${id}" data-elementType="${dataType}" title="Edit"></a>
      <a class="sfb-copy-button sfb-btn glyphicon glyphicon-duplicate" data-id="${id}" data-elementType="${dataType}" title="Copy"></a>
      <a class="sfb-del-button sfb-btn sfb-delete-confirm" data-id="${id}" data-elementType="${dataType}" title="Remove Element">×</a>
    </div>
  `;

        const actionsElement = document.createElement('div');
        actionsElement.innerHTML = fieldActions;

        return {
            fieldLabelElement: fieldLabel,
            fieldActionsElement: actionsElement.innerHTML
        };
    }

    /**
     * Generates the output for an element based on its type and mode.
     * @param {Object} elementType - The element type object with properties like name, type, label, etc.
     * @param {number} mode - The mode for generating output (1, 2, or 3).
     * @returns {string} The generated output for the element.
     *
     * @example
     * const elementType = {
     *   name: 'example',
     *   type: 'text',
     *   label: 'Example Label'
     * };
     * const output = checkType(elementType, 1);
     */
function checkType(elementType, mode) {
    let outputType;
    let elementID = elementType.name || 'v' + Math.floor(Math.random() * (1e13 - 1e12) + 1e12);
    let dataType = elementType.type || '';
    let label = elementType.label || '';
    let required = elementType.required || '';
    let demographic = elementType.required || '';
    let className = elementType.class || '';
    let placeholder = elementType.placeholder || '';
    let readonly = elementType.readonly || '';
    let min = elementType.min || '';
    let max = elementType.max || '';
    let value = elementType.value || '';
    let defaultValue = elementType.defaultValue || '';
    let conditionalOption = elementType.conditionalOption || '';
    let conditionalValue = elementType.conditionalValue || '';
    let price = elementType.price || '';
    let product = elementType.product || '';
    let conditionalChildOption = elementType.conditionalChildOption || '';
    let tableType = elementType.tableType || '';
    const {fieldLabelElement , fieldActionsElement} = generateFieldLabelAndActions(elementID, dataType);

    const fieldBuilder = createFieldBuilder(dataType, elementID, label,fieldLabelElement);
    const actions = (mode === 1) ? createAction(elementID, dataType,fieldActionsElement) : '';

    outputType = generateOutput({
        dataType: dataType,
        elementID: elementID,
        elementType: elementType,
        mode: mode,
        label: label,
        fieldBuilder: fieldBuilder,
        actions: actions,
        defaultValue: defaultValue,
        placeholder: placeholder,
        conditionalOption: conditionalOption,
        conditionalValue: conditionalValue,
        conditionalChildOption: conditionalChildOption,
        demographic: demographic,
        className: className,
        required: required,
        readonly: readonly,
        min: min,
        max: max,
        value: value,
        product: product
    });
    return outputType;

    function createFieldBuilder(elementType, elementID, label,fieldLabel) {
        if (elementType === 'paragraph' || elementType === 'header') {
            return fieldLabel.replace(/field_repIIDD/g, elementID)
                .replace(/Text Field/g, elementType)
                .replace(/repIIDD/g, elementID);
        } else if (elementType === 'hidden') {
            return `<label id="field_${elementID}" for="${elementID}" class="sfb-fb-repType-Label sfb-formzone sfb-pull-left ${required} sfb-form-hidden"><span id="label_span_${elementID}">${label !== '' ? label : elementType}</span><span id="history_span_${elementID}"></span></label>`;
        } else {
            return fieldLabel.replace(/repIIDD/g, elementID)
                .replace(/Text Field/g, label !== '' ? label : elementType);
        }
    }

    function createAction(elementID, dataType,fieldActionsElement) {
        return fieldActionsElement.replace(/counter/g, elementID)
            .replace(/dataType/g, `'${dataType}'`);
    }
}


    /**
     * Function to generate the output based on dataType.
     * @param {Object} options - The options object containing dataType, elementID, elementType, mode, label, fieldBuilder, actions, defaultValue, placeholder, conditionalOption, conditionalValue, demographic, className, required, readonly, min, max, value, and product properties.
     * @returns {string} The generated output.
     */
function generateOutput(options) {
    const {
        dataType,
        elementID,
        elementType,
        mode,
        label,
        fieldBuilder,
        actions,
        defaultValue,
        placeholder,
        conditionalOption,
        conditionalValue,
        demographic,
        className,
        required,
        readonly,
        min,
        max,
        value,
        product,
    } = options;

    const generators = {
        text: generateInputType,
        date: generateInputType,
        conjoint: generateInputType,
        number: generateInputType,
        currency: generateInputType,
        percentage: generateInputType,
        range: generateInputType,
        email: generateInputType,
        password: generateInputType,
        hidden: generateInputType,
        tel: generateInputType,
        textarea: generateTextareaType,
        button: generateButtonType,
        picture: generatePictureType,
        datalist: generateDatalistType,
        select: generateSelectType,
        checkbox: generateCheckboxType,
        radio: generateRadioType,
        paragraph: generateParagraphType,
        header: generateHeaderType,
        table: generateTableType,
    };

    if (generators.hasOwnProperty(dataType)) {
        return generators[dataType](options);
    }

    return '';
}

/**
 * Generates the HTML for an input field based on the given options.
 * @param {Object} options - The options for the input field.
 */
function generateInputType(options) {
    let {dataType, elementID, label, fieldBuilder,
        actions,defaultValue, placeholder, demographic, conditionalOption, conditionalValue, className, required, readonly, min, max, value, product} = options;

    let currency = '';
    let money = '';

    switch(dataType) {
        case 'currency':
            currency = '<span class="sfb-input-group-addon">&#8373;</span>';
            money = 'class="sfb-input-group"';
            break;
        case 'percentage':
            currency = '<span class="sfb-input-group-addon">%</span>';
            money = 'class="sfb-input-group"';
            break;
    }

    let outputValue = '';
    let rangeJs = '';

    if (dataType === 'range') {
        outputValue = '<output></output>';
        rangeJs = 'oninput="this.nextElementSibling.value = this.value"';
    }

    let inputType = dataType;
    if (getLogTypeFromJwt() === '3' && dataType === 'hidden' && elementID !== 'hidden_fallback') {
        inputType = 'text';
    }

    function getLogTypeFromJwt() {
        //todo find away of bringing jwt. You can just copy the cookie
      //  return JSON.parse(atob(jwt.split('.')[1]))['logType'];
    }

    function replaceSpecialChars(str) {
        return str.replace(/~~/g, '\n').replace(mathRegExp, ' ');
    }

    placeholder = replaceSpecialChars(placeholder);
    value = replaceSpecialChars(value);

    return `
        <div ${money} class="${className}" data-label="${label}" data-demographic="${demographic}" data-value="${defaultValue}" data-placeholder="${placeholder}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="${dataType}" id="main${elementID}">
            ${fieldBuilder}${actions}<br>
            ${currency}
            <input ${rangeJs} step="${product}" ${required} min="${min}" max="${max}" type="${inputType}" ${readonly} class="sfb-form-control sfb-formzone sfb-pipe" placeholder="${placeholder}" name="${elementID}" id="${elementID}" value="${value}">${outputValue}
        </div>`;
}

function generateTextareaType(options) {
    const {
        elementID,
        label,
        defaultValue,
        placeholder,
        demographic,
        conditionalOption,
        conditionalValue,
        className,
        required,
        readonly,
        max,
        value,
        fieldBuilder,
        actions,
    } = options;

    const formattedPlaceholder = placeholder.replace(/~~/g, '\n').replace(mathRegExp, ' ');
    const formattedValue = value.replace(/~~/g, '\n');

    return `
    <div class="${className}" data-label="${label}" data-demographic="${demographic}" data-value="${defaultValue}" data-placeholder="${formattedPlaceholder}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="textarea" id="main${elementID}">
      ${fieldBuilder}${actions}<br>
      <textarea ${required} ${readonly} data-max="${max}" class="sfb-form-control sfb-formzone sfb-pipe" name="${elementID}" placeholder="${formattedPlaceholder}" id="${elementID}">${formattedValue}</textarea>
    </div>`;
}

function generateButtonType(options) {
    const {
        elementID,
        label,
        defaultValue,
        placeholder,
        conditionalOption,
        conditionalValue,
        className,
        actions,
        fieldBuilder,
    } = options;

    return `
        <div class="${className}" data-label="${label}" data-value="${defaultValue}" data-placeholder="${placeholder}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="button" id="main${elementID}">
            ${actions}<br>
            <button type="button" class="sfb-form-control sfb-formzone sfb-btn-primary sfb-btn sfb-btn-sm" name="${elementID}" id="${elementID}">
                ${fieldBuilder}
            </button>
        </div>`;
}
function generatePictureType(options) {
    const {
        elementID,
        label = '',
        conditionalOption = '',
        conditionalValue = '',
        className = '',
        required = false,
        readonly = false,
        max = '',
        value = '',
        fieldBuilder,
        actions,
    } = options;

    const requiredAttribute = required ? 'required' : '';
    const readonlyAttribute = readonly ? 'readonly' : '';

    return `
        <div class="${className}" data-label="${label}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="picture" id="main${elementID}">
            ${fieldBuilder}
            ${actions}
            <input type="hidden" class="sfb-form-control sfb-formzone" name="${elementID}" id="${elementID}" value="${value}">
            <input ${requiredAttribute} type="file" ${readonlyAttribute} data-max="${max}" class="sfb-form-control sfb-formzone sfb-js-image-upload" accept="image/*" name="u___${elementID}" id="u___${elementID}" value="${value}" capture="environment">
            <div class="js-image-container" id="img${elementID}"></div>
        </div>
    `;
}

function generateDatalistType(options) {
    const { elementID, label, demographic, conditionalOption,mode, conditionalValue, className, required, elementType,
        fieldBuilder,
        actions,} = options;

    let output = `<div class='${className}' data-label='${label}' data-demographic='${demographic}' data-conditionalOption='${conditionalOption}' data-conditionalValue='${conditionalValue}' data-type='datalist' id='main${elementID}'>${fieldBuilder}${actions}<br>`;

    if (mode === 1) {
        elementType.value = [
            { value: "option-1", label: "Option 1" },
            { value: "option-2", label: "Option 2" },
            { value: "option-3", label: "Option 3" }
        ];
    }

    if (validURL(elementType.defaultValue)) {
        fetchElementOptions(elementID, elementType.defaultValue)
            .then((options) => {
                elementOptionsAJAX[elementID] = options;
                buildDatalist(elementID, elementOptionsAJAX, elementType.defaultValue);
            });
    } else {
        elementOptionsAJAX[elementID] = elementType.value;
    }

    let dataList = '';
    if (typeof elementType.value !== 'object') {
        dataList = elementType.value;
    }
    output += `<input autocomplete='off' ${required} list='${elementID}_list' class='sfb-form-control sfb-pipe sfb-formzone' name='${elementID}' id='${elementID}' value='${dataList}'>`;
    output += `<datalist id='${elementID}_list'></datalist></div>`;

    return output;
}


function fetchElementOptions(elementID, url) {
    const headers = {};
    if (jwt) {
        headers.Authorization = 'Basic ' + jwt;
    }
    return fetch(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    }).then((data) => {
        if (data.message === 'success') {
            jwt = data.jwt_token;
            return data.data;
        }
    });
}


function generateSelectType(options) {
    const {
        elementID, label, demographic, conditionalChildOption, conditionalOption, conditionalValue, className, required, readonly, mode, elementType, fieldBuilder,
        actions,
    } = options;

    const mainDiv = document.createElement('div');
    mainDiv.className = className;
    mainDiv.dataset.label = label;
    mainDiv.dataset.demographic = demographic;
    mainDiv.dataset.conditionalchildoption = conditionalChildOption;
    mainDiv.dataset.conditionalOption = conditionalOption;
    mainDiv.dataset.conditionalvalue = conditionalValue;
    mainDiv.dataset.type = "select";
    mainDiv.id = "main" + elementID;
    mainDiv.innerHTML += fieldBuilder;

    mainDiv.innerHTML += actions;

    const selectElement = document.createElement('select');
    selectElement.className = "sfb-form-control sfb-pipe";
    selectElement.name = elementID;
    selectElement.id = elementID;
    if (required) selectElement.setAttribute('required', '');
    if (readonly) selectElement.setAttribute('readonly', '');

    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = '';
    defaultOption.textContent = '-- select an option --';
    selectElement.appendChild(defaultOption);

    if (elementID === '2029') {
        elementType.value = shuffle(elementType.value);
    }
    if (mode === 1) {
        elementType.value = [
            { value: "option-1", label: "Option 1" },
            { value: "option-2", label: "Option 2" },
            { value: "option-3", label: "Option 3" }
        ];
    }
    for (const option of elementType.value) {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        optionElement.dataset.condshowon = option.show_on;
        if (option.selected) optionElement.setAttribute('selected', '');
        selectElement.appendChild(optionElement);
    }

    mainDiv.appendChild(selectElement);

    return (document.createElement('div').appendChild(mainDiv)).outerHTML;
}
function generateCheckboxType(options) {
    const { elementID, label, demographic, conditionalChildOption, conditionalOption, conditionalValue, className, readonly, mode, elementType, fieldBuilder,
        actions, } = options;
    let output;
    let disabled = readonly ? 'disabled' : '';
    let inline = className.includes('sfb-inline') ? 'sfb-inline' : '';

    output = `<div class="${className}" data-label="${label}" data-demographic="${demographic}" data-cond-child-option="${conditionalChildOption}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="checkbox" id="main${elementID}">${fieldBuilder}${actions}<br>`;
    output += `<div id="${elementID}">`;

    if (mode === 1) {
        output += generateDefaultCheckboxes(elementID);
    } else {
        for (const option of elementType.value) {
            const selected = option.selected ? 'checked' : '';

            output += `<div class="sfb-checkbox ${inline}"><label><input type="checkbox" ${selected} ${readonly ? 'readonly' : ''} ${disabled} data-cond-show_on="${option.show_on}" value="${option.value}" id="${elementID}" name="${elementID}">${option.label}</label></div>`;
        }
    }

    output += '</div></div>';

    return output;
}

function generateDefaultCheckboxes(elementID, options = ['Option 1', 'Option 2', 'Option 3']) {
    let defaultCheckboxes = '';

    for (const option of options) {
        defaultCheckboxes += `<div class="sfb-checkbox"><label><input type="checkbox" value="${option}" id="check-1528713131180-preview-0" name="${elementID}">${option}</label></div>`;
    }

    return defaultCheckboxes;
}

function generateRadioType(options) {
    const {
        elementID,
        label,
        demographic,
        conditionalChildOption,
        conditionalOption,
        conditionalValue,
        className,
        required,
        readonly,
        mode,
        elementType,
        fieldBuilder,
        actions,
    } = options;

    let output;
    let inline = className.includes('sfb-inline') ? 'sfb-inline' : '';
    output = `<div class="${className}" data-label="${label}" data-demographic="${demographic}" data-cond-child-option="${conditionalChildOption}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-type="radio" id="main${elementID}">
            ${fieldBuilder}
            ${actions}
            <br>
                <div id="${elementID}">`;

    if (mode === 1) {
        elementType.value = [
            { value: 'Option 1', label: 'Option 1' },
            { value: 'Option 2', label: 'Option 2' },
            { value: 'Option 3', label: 'Option 3' },
        ];

    }
        for (let option of elementType.value) {
            let selected = option.selected ? 'checked' : '';
            output += `<div class="sfb-radio ${inline}"><label><input ${required ? 'required' : ''} type="radio" ${selected} ${readonly ? 'readonly disabled' : ''} data-cond-show_on="${option.show_on}" value="${option.value}" name="${elementID}">${option.label}</label></div>`;
        }


    output += '</div></div>';

    return output;
}


function generateParagraphType(options) {
    const {
        elementID,
        label,
        conditionalOption,
        conditionalValue,
        className,
        fieldBuilder,
        actions,
    } = options;


    return `<div class="${className}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-label="${label}" data-type="paragraph" id="main${elementID}">${fieldBuilder}${actions}<br><br><br></div>`;
}
//.replace(/<(\/)?label/g, '<$1p>')
//.replace(/<(\/)?label/g, '<$1h3>')

function generateHeaderType(options) {
    const {
        elementID,
        label,
        conditionalOption,
        conditionalValue,
        className,
        fieldBuilder,
        actions,
    } = options;


    return `<div class="${className}" data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" data-label="${label}" id="main${elementID}">${fieldBuilder}${actions}<br><br><br></div>`;
}
/**
 * Generate the HTML for a table element.
 * @param {Object} options - The options for the table element.
 * @param {string} options.elementID - The id of the table element.
 * @param {string} options.label - The label for the table element.
 * @param {string} options.conditionalOption - The conditional option for the table element.
 * @param {string} options.conditionalValue - The conditional value for the table element.
 * @param {string} options.className - The class name for the table element.
 * @param {Object} options.elementType - The type of the table element.
 * @param {string} options.fieldBuilder - The field label template.
 * @param {string} options.actions - The value to replace in the field label template.
 * @param {number} options.mode - The mode for creating the table.
 * @returns {string} The generated HTML for the table element.
 */
function generateTableType(options) {
        let {
            elementID,
            label,
            demographic,
            conditionalChildOption,
            conditionalOption,
            conditionalValue,
            className,
            required,
            readonly,
            mode,
            elementType,
            fieldBuilder,
            actions,
        } = options;
    let output = `<div data-type="table" data-label="${label}" class="${className}"  data-demographic="${demographic}"  data-conditionalOption="${conditionalOption}" data-conditionalValue="${conditionalValue}" id="main${elementID}">`;
    output += fieldBuilder.replace(/repIIDD/g, elementID).replace(/fb-repType-Label/g, 'panel-body') + actions+'<br>';

    if (mode === 1) {
        elementType = {
            id: 'tableId',
            columns: [
                {"name": "option 1"},
                {"name": "option 2"},
                {"name": "option 3"},
                {"name": "option 4"}
            ],
            rows: [
                {"name": "option 1", "value": "option-1"},
                {"name": "option 2", "value": "option-2"},
                {"name": "option 3", "value": "option-3"},
                {"name": "option 4", "value": "option-4"}
            ],
            tableType: 'Text Area',
            values:[]
        };
    }
    output += createTable({rows:elementType.rows.length, cols:elementType.columns.length, id:elementID, rowsData:elementType.rows, colsData:elementType.columns, values:elementType.values, tableType:elementType.tableType, elementType});

    output += '</div>';

    return output;
}

/**
 * Creates a table with the given options.
 * @param {Object} options - The options for the table.
 * @returns {HTMLElement} The created table element.
 */
function createTable(options) {
    const defaultOptions = {
        rows: 0,
        cols: 0,
        id: '',
        rowsData: [],
        colsData: [],
        values: [],
        tableType: 'radio',
        allProperties: {}
    };

    options = Object.assign({}, defaultOptions, options);

    const table = document.createElement('table');
    table.className = 'sfb-table sfb-table-hover sfb-table-striped';
    table.id = options.id;
    table.dataset.tabletype = options.tableType;

    table.appendChild(createTableHead(options));
    for (let i = 1; i < options.rows; i++) {
        table.appendChild(createTableRow(options, i));
    }

    return (document.createElement('div').appendChild(table)).outerHTML;
   // return ;
}

    /**
     * Creates a table head element with the given options.
     * @param {Object} options - The options for the table head.
     * @returns {HTMLElement} The created table head element.
     */
function createTableHead(options) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (let j = 0; j < options.cols; j++) {
        const cell = document.createElement('th');
        cell.id = `${options.id}_0_${j}`;

        if (j > 0) {
            cell.textContent = options.colsData[j].name;
        }

        tr.appendChild(cell);
    }

    thead.appendChild(tr);
    return thead;
}

    /**
     * Creates a table row element with the given options and row index.
     * @param {Object} options - The options for the table row.
     * @param {number} i - The row index.
     * @returns {HTMLElement} The created table row element.
     */
function createTableRow(options, i) {
    const tr = document.createElement('tr');

    for (let j = 0; j < options.cols; j++) {
        tr.appendChild(createTableCell(options, i, j));
    }

    return tr;
}

    /**
     * Creates a table cell element with the given options and row and column indices.
     * @param {Object} options - The options for the table cell.
     * @param {number} i - The row index.
     * @param {number} j - The column index.
     * @returns {HTMLElement} The created table cell element.
     */
function createTableCell(options, i, j) {
    const cell = document.createElement('td');
    cell.id = `${options.id}_${i}_${j}`;

    if (j === 0) {
        cell.textContent = options.rowsData[i].name;
        cell.setAttribute("data-value", options.rowsData[i].value);
    } else {
        // Fill the cell with the appropriate input element
        switch (options.tableType){
            case 'Text':
            case 'Number':
            case 'Checkbox':
            case 'Radio':
                cell.innerHTML =`<input type="${options.tableType}" value="" name="">`
                break;
            case 'Text Area':
                cell.innerHTML = `<textarea name=""></textarea>`
                break;
            case 'Dropdown':
                cell.innerHTML =  `<select name="">
                                        <option disabled="" value="">-- select an option --</option>
                                        <option value="option-1" data-cond-show-on="">Option 1</option>
                                        <option value="option-2" data-cond-show-on="">Option 2</option>
                                        <option value="option-3" data-cond-show-on="">Option 3</option>
                                     </select>`
                break;
        }
    }

    return cell;
}



    /**
     * Edits a specified HTML element based on the elementID and dataType provided, applying changes
     * to related elements and configurations if necessary.
     *
     * @function
     * @param {string} elementID - The ID of the target HTML element to edit.
     * @param {string} dataType - The type of the target HTML element (e.g., 'select', 'checkbox', 'radio', or 'table').
     */
    function editElement(elementID, dataType) {
        let element = document.getElementById(elementID);
        let formattedElement = '';
        let mainElement = document.getElementById('main' + elementID);

        if (element) {
            formattedElement = mainElement.getAttribute("data-label");
            generateFieldEdit(elementID, dataType, formattedElement);

            document.getElementById(elementID).remove();

            let conditionalOption = mainElement.getAttribute("data-conditionalOption");

            if (conditionalOption) {
                updateOption(elementID, conditionalOption);
            }

            // Replace with vanilla JavaScript implementation if sortable library is used
            // Assuming you have implemented a vanilla JS sortable function named "initializeSortable"
            initializeSortable(document.querySelector(".sfb-sortable-options"));

        } else {
            const labelSpan = document.getElementById('label_span_' + elementID);
            if (labelSpan) {
                labelSpan.remove();
            }
            if (mainElement) {
                mainElement.insertAdjacentHTML('afterend', checkType(convertInputToJson(elementID)[0], 1));
                mainElement.remove();
            }
        }
    }

    /**
     * Initialize the sortable functionality for the given element.
     * @param {HTMLElement} container - The container element.
     */
    function initializeSortable(container) {
        let draggedItem = null;

        // Make all children draggable
        Array.from(container.children).forEach(function (item) {
            item.draggable = true;
        });

        container.addEventListener("dragstart", (event) => {
            draggedItem = event.target;
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("Text", draggedItem.textContent);

            container.addEventListener("dragover", onDragOver);
            container.addEventListener("dragend", onDragEnd);

            setTimeout(() => {
                draggedItem.classList.add("sfb-ghost");
            }, 0);
        });

        function onDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";

            const target = event.target;
            if (target && target !== draggedItem && target.classList.contains("sfb-ui-sortable-handle")) {
                const offsetY = getMouseOffset(event).y;
                const middleY = getElementVerticalCenter(target);

                if (offsetY > middleY) {
                    container.insertBefore(draggedItem, target.nextSibling);
                } else {
                    container.insertBefore(draggedItem, target);
                }
            }
        }

        function onDragEnd(event) {
            event.preventDefault();

            draggedItem.classList.remove("sfb-ghost");
            container.removeEventListener("dragover", onDragOver);
            container.removeEventListener("dragend", onDragEnd);
        }

        function getMouseOffset(event) {
            const targetRect = event.target.getBoundingClientRect();
            return {
                x: event.pageX - targetRect.left,
                y: event.pageY - targetRect.top,
            };
        }

        function getElementVerticalCenter(el) {
            const rect = el.getBoundingClientRect();
            return (rect.bottom - rect.top) / 2;
        }
    }
/**
 * Adds an option to the specified element.
 *
 * @param {string} [label='Option 3'] - The label for the new option.
 * @param {string} [value='Option 3'] - The value for the new option.
 * @param {string} fieldId - The identifier for the element to append the option to.
 */
function addOption(label = 'Option 3', value = 'Option 3', fieldId) {
    if (typeof fieldId !== 'string') {
        throw new TypeError('The "fieldId" argument must be a string.');
    }

    const ele = document.querySelector(fieldId);
    let output = document.createElement("li");
    output.classList.add("sfb-ui-sortable-handle");

    if (fieldId.includes('#rl_')) {
        output.innerHTML = `<input type="text" class="sfb-option-label" value="${label}" name="select-optionRowName" placeholder="Label">
            <input type="text" class="sfb-option-label" value="${value}" name="select-optionRowValue" placeholder="Value/placeholder">
            <input type="text" class="sfb-option-label" value="" name="select-optionR_filter" placeholder="show On Filter">`;
    } else if (fieldId.includes('#cl_')) {
        output.innerHTML = `<input type="radio" class="sfb-option-selected" value="false" name="selected-option" placeholder="">
                    <input type="text"  class="sfb-option-label" value="${label}" name="select-optionC" placeholder="Label">`;
    } else {
        output.innerHTML = `<input type="radio" class="sfb-option-selected" value="false" name="selected-option" placeholder="">
            <input type="text" class="sfb-option-label" value="${label}" name="select-option" placeholder="Label">
            <input type="text" class="sfb-option-value" value="${value}" name="select-value" placeholder="value">
            <input type="text" class="sfb-option-filter" value="" name="select-filter" placeholder="show On Filter">`;
    }

    const removeButton = document.createElement("a");
    removeButton.className = "sfb-remove sfb-btn";
    removeButton.title = "Remove Element";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", function() {
        output.remove();
    });

    output.appendChild(removeButton);
    ele.appendChild(output);
}
    /**
     * Modifies the row and column inputs based on the selected table type.
     * Hides and disables option-value inputs for Text, Text Area, and Number types.
     * Shows and enables option-value inputs for Radio and Checkbox types.
     * Creates and manages dropdown options for the Dropdown type.
     *
     * @param {string} tableType - The selected table type (Text, Text Area, Number, Radio, Checkbox, Dropdown).
     * @param {string} fieldId - The identifier for the parent element containing the Trow and table-dropdown-values divs.
     */
    function modifyRowColumn(tableType, fieldId) {
        const parentElement = document.querySelector(`#div_${fieldId}`);
        const TrowDiv = parentElement.querySelector(".sfb-Trow");
        const optionValueInputs = TrowDiv.querySelectorAll("input.sfb-option-value");
        const tableDropdownValuesDiv = parentElement.querySelector(".sfb-table-dropdown-values");

        // Function to enable or disable elements based on the condition
        function toggleElements(elements, condition) {
            elements.forEach((element) => {
                element.disabled = !condition;
                element.style.display = condition ? "" : "none";
            });
        }

        // Function to create and add a new dropdown option
        function createDropdownOption() {
            const newFieldId = `dropdown-value-${fieldId}-${tableDropdownValuesDiv.children.length}`;
            addOption(`Option ${tableDropdownValuesDiv.children.length + 1}`, `Option ${tableDropdownValuesDiv.children.length + 1}`, newFieldId);
            tableDropdownValuesDiv.appendChild(newOption);
        }

        if (tableType === "Text" || tableType === "Text Area" || tableType === "Number") {
            toggleElements(optionValueInputs, false);
            toggleElements([tableDropdownValuesDiv], false);
        } else if (tableType === "Radio" || tableType === "Checkbox") {
            toggleElements(optionValueInputs, true);
            toggleElements([tableDropdownValuesDiv], false);
        } else if (tableType === "Dropdown") {
            toggleElements(optionValueInputs, false);
            tableDropdownValuesDiv.innerHTML = '';
            const dropdownLabel = document.createElement("label");
            dropdownLabel.textContent = "Dropdown Values:";
            tableDropdownValuesDiv.appendChild(dropdownLabel);

            // Create and add initial 3 dropdown options
            for (let i = 0; i < 3; i++) {
                createDropdownOption();
            }

            // Add the "add-opt" button for adding more dropdown options
            const addButton = document.createElement('a');
            addButton.classList.add('sfb-add', 'sfb-add-opt', 'sfb-btn', 'sfb-btn-default', 'sfb-pull-right');
            addButton.id = 'add-dropdown-value';
            addButton.textContent = 'Add Dropdown Value +';
            addButton.addEventListener('click', createDropdownOption);
            tableDropdownValuesDiv.appendChild(addButton);

            toggleElements([tableDropdownValuesDiv], true);
        }
    }

/**
 * Updates the inner HTML of the label span element with the given ID suffix and new content.
 * @param {string} idSuffix - The suffix to append to the "label_span_" ID.
 * @param {string} newContent - The new content to set as the inner HTML of the label span element.
 */
function updateLabelSpan(idSuffix, newContent) {
    const labelSpan = document.getElementById('label_span_' + idSuffix);

    if (labelSpan) {
        labelSpan.innerHTML = newContent;
    } else {
        console.error('Element with ID "label_span_' + idSuffix + '" not found.');
    }
}

/**
 * Generates an HTML string for editing a form field.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit.
 * @param {string} [fieldValue=''] - The initial value of the field.
 */
function generateFieldEdit(fieldId, fieldType, fieldValue = '') {
    // Declare and initialize variables
    const mainElement = document.querySelector(`#main${fieldId}`);
    const fieldClass = mainElement.getAttribute('class').trim();
    const labelText = mainElement.getAttribute("data-label");
    const hide = mainElement.getAttribute("data-hide");
    const demographic = mainElement.getAttribute("data-demographic");

    let fieldEdit = `<div id="div_${fieldId}" class="sfb-edit_template"></div>`;

    // Append the fieldEdit to the mainElement
    mainElement.innerHTML += fieldEdit;



    // Generate additional field edit HTML based on the field type
    let fieldContent = `
        <br><label class="sfb-pull-left">Label</label>
        <textarea name="label" data-elementType="${fieldType}" data-id="${fieldId}" placeholder="Label" class="sfb-fld-label sfb-form-control sfb-tribute">${labelText}</textarea><br>
        <br><label class="sfb-pull-left">Class (Separate multiple classes by space)</label>
        <input name="class" type="text" data-elementType="${fieldType}" data-id="${fieldId}" value="${fieldClass}" placeholder="class" class="sfb-fld-label sfb-form-control"><br>
        <label class="sfb-pull-left">Hide from Client Chart: </label>
        <input name="hide" type="checkbox" data-elementType="${fieldType}" data-id="${fieldId}" ${hide} class="sfb-checkbox"><br>
        <label class="sfb-pull-left">Demograhpic Variable: </label>
        <input name="demographic" value="Checked" type="checkbox" data-elementType="${fieldType}" data-id="${fieldId}" ${demographic} class="sfb-checkbox"><br>
        <div id="logic_${fieldId}" class="sfb-edit_template">
            <br><label class="sfb-pull-left">Display Logic</label>
            <select name="form_logic" class="sfb-fld-label sfb-form-control">
                ${fieldCondition(fieldId)}
            </select>
            <br>
            <div id="logic_option">
            <br>`;
    switch (fieldType) {
        case 'text':
        case 'date':
        case 'number':
        case 'textarea':
        case 'picture':
        case 'hidden':
        case 'range':
            fieldContent += generateTextInput(fieldId, fieldType, mainElement);
            break;
        case 'select':
        case 'checkbox':
        case 'radio':
            fieldContent += generateSelectInput(fieldId, fieldType, mainElement);
            break;
        case 'table':
            fieldContent += generateTableInput(fieldId, fieldType, mainElement);
            break;
        case 'payment':
            fieldContent += generatePaymentInput(fieldId, fieldType, mainElement);
            break;
        case 'datalist':
            fieldContent += generateDataListInput(fieldId, fieldType, mainElement);
            break;
        case 'conjoint':
            fieldContent += generateConjointInput(fieldId, fieldType, mainElement);
            break;
        default:
            console.warn(`Unsupported field type: ${fieldType}`);
    }

    // Add the fieldContent into the edit_template div
    const divFieldId = document.getElementById(`div_${fieldId}`);
    divFieldId.innerHTML = fieldContent;

    // Attach event listeners using event delegation
    divFieldId.addEventListener('keyup', function(event) {
        if (event.target.matches('textarea[name="label"]')) {
            updateLabelSpan(fieldId, event.target.value);
        }
    });

    divFieldId.addEventListener('change', function(event) {
        if (event.target.matches('select[name="form_logic"]')) {
            updateOption(fieldId, event.target.value);
        }
    });
    switch (fieldType) {
        case 'select':
        case 'checkbox':
        case 'radio':
            // Add event listener to the add-opt button
            document.getElementById(`add-opt-${fieldId}`).addEventListener('click', function () {
                addOption('label', 'value', `#ol_${fieldId}`);
            });
            // Add event listener to the optionsCSV button
            document.getElementById(`optionsCSV-${fieldId}`).addEventListener('click', function () {
                optionsCSV(fieldId);
            });
            break;
        case 'table':
            // Add event listener to the add-col button
            document.getElementById(`add-col-${fieldId}`).addEventListener('click', function () {
                addOption('label', 'value', `#cl_${fieldId}`);
            });
            // Add event listener to the add-row button
            document.getElementById(`add-row-${fieldId}`).addEventListener('click', function () {
                addOption('label', 'value', `#rl_${fieldId}`);
            });
            // Add event listener to tableType
            document.getElementById(`tableType_${fieldId}`).addEventListener('change', function () {
                modifyRowColumn(this.value, `${fieldId}`);
            });
            break;
    }
}

    /**
     * Generates an HTML string for text input fields.
     * @param {string} fieldId - The ID of the field.
     * @param {string} fieldType - The type of the field.
     * @param {HTMLElement} mainElement - The main element for the field.
     * @returns {string} The HTML string for text input fields.
     */
    function generateTextInput(fieldId, fieldType, mainElement) {
        const inputChild = mainElement.querySelector('input, textarea');
        const placeholder = mainElement.getAttribute("data-placeholder");
        const required = inputChild.getAttribute('required');
        const defaultValue = mainElement.getAttribute("data-value");
        const checked = required ? 'Checked' : '';

        let textInputHtml = `
    <label>Required</label> &nbsp; &nbsp;
    <input type="checkbox" class="sfb-fld-required" name="required" value="required" ${checked}><br>
    <label>Placeholder</label>
    <textarea name="placeholder" class="sfb-form-control sfb-tribute">${placeholder}</textarea><br>
    <label>Default Value</label>
    <textarea name="default_value" class="sfb-form-control sfb-tribute">${defaultValue}</textarea><br>
  `;

        if (fieldType === 'number' || fieldType === 'range') {
            const max = inputChild.getAttribute('max');
            const min = inputChild.getAttribute('min');
            const step = inputChild.getAttribute('step');

            textInputHtml += `
      <div class="sfb-form-group sfb-min-wrap">
        <label for="min-frmb-1610598484374-fld-4">Min</label>
        <div class="sfb-input-wrap">
          <input type="number" value="${min}" name="fld_min" class="sfb-fld-min sfb-form-control sfb-form-control" id="min-frmb-1610598484374-fld-4">
        </div>
      </div>
      <div class="sfb-form-group sfb-max-wrap">
        <label for="max-frmb-1610598484374-fld-4">Max</label>
        <div class="sfb-input-wrap">
          <input type="number" value="${max}" name="fld_max" class="sfb-fld-max sfb-form-control sfb-form-control" id="max-frmb-1610598484374-fld-4">
        </div>
      </div>
      <div class="sfb-form-group sfb-step-wrap">
        <label for="step-frmb-1610598484374-fld-4">Step</label>
        <div class="sfb-input-wrap">
          <input type="number" value="${step}" name="fld_step" class="sfb-fld-step sfb-form-control sfb-form-control" id="step-frmb-1610598484374-fld-4">
        </div>
      </div>
    `;
        }

        return textInputHtml;
    }

    /**
     * Generates an HTML string for select input fields.
     * @param {string} fieldId - The ID of the field to edit.
     * @param {string} fieldType - The type of the field to edit.
     * @param {HTMLElement} mainElement - The main element for the field.
     * @returns {string} The HTML string for the select input field.
     */
    function generateSelectInput(fieldId, fieldType, mainElement) {
        // Declare and initialize variables
        const fieldClass = mainElement.className;
        const isChecked = fieldClass.includes('sfb-inline') ? 'checked' : '';

        // Replace this with the actual options HTML string
        const {
            optionValues,
            outOptionsRows,
            outOptionsColumns
        } = editForOptions(fieldId, fieldType);

        return `
    ${fieldType === 'checkbox' || fieldType === 'radio' ? `
      <label class="">Inline</label>  &nbsp; &nbsp;
      <input ${isChecked} type="checkbox" class="sfb-fld-required" name="fld_inline" value="inline"  onclick="toggleInlineClass(this,'${fieldId}');">
      <br>` : ''}
    <br>
    <div class="sfb-form-group sfb-field-options">
      <label class="sfb-false-label">Options <button  id="optionsCSV-${fieldId}" class="sfb-btn sfb-btn-default"> Upload through CSV</button></label>
      <div class="sfb-sortable-options-wrap">
        <ol class="sfb-sortable-options sfb-ui-sortable" id="ol_${fieldId}">
          ${outOptionsRows}
        </ol>
        <div class="sfb-option-actions">
          <a class="sfb-add sfb-add-opt sfb-btn sfb-btn-default sfb-pull-right" id="add-opt-${fieldId}">Add Option +</a>
        </div>
      </div>
    </div>
  `;
    }

    /**
     * Generates an HTML string for table input fields.
     * @param {string} fieldId - The ID of the field to edit.
     * @param {string} fieldType - The type of the field to edit.
     * @param {HTMLElement} mainElement - The DOM element for the main element.
     * @returns {string} The HTML string for the table input fields.
     */
    function generateTableInput(fieldId, fieldType, mainElement) {
        const tableTypeLabel = mainElement.querySelector('table').getAttribute("data-tabletype");

        // Replace this with the actual options HTML string
        const {
            optionValues,
            outOptionsRows,
            outOptionsColumns
        } = editForOptions(fieldId, fieldType);

        return `
    <div class="sfb-row">
      <div class="sfb-col-sm-4"><label>Type of Table:</label></div>
      <div class="sfb-col-sm-8">
        <select name="table_type" id="tableType_${fieldId}" class="sfb-form-control">
          <option ${tableTypeLabel === "Dropdown" ? "selected" : ""} value="Dropdown">Dropdown</option>
          <option ${tableTypeLabel === "Radio" ? "selected" : ""} value="Radio">Radio</option>
          <option ${tableTypeLabel === "Checkbox" ? "selected" : ""} value="Checkbox">Checkbox</option>
          <option ${tableTypeLabel === "Text" ? "selected" : ""} value="Text">Text</option>
          <option ${tableTypeLabel === "Number" ? "selected" : ""} value="Number">Number</option>
          <option ${tableTypeLabel === "Text Area" ? "selected" : ""} value="Text Area">Text Area</option>
        </select>
      </div>
    </div>
    <br>
    <div class="sfb-form-group sfb-field-options">
      <label class="sfb-false-label">Options:</label>
      <div class="sfb-sortable-options-wrap">
        <label class="sfb-false-label">Rows &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</label>
        <div class="sfb-Trow">
          <ol class="sfb-sortable-options sfb-ui-sortable" id="rl_${fieldId}">
            ${outOptionsRows}
          </ol>
        </div>
        <div class="sfb-option-actions">
          <a class="sfb-add sfb-add-opt sfb-btn sfb-btn-default sfb-pull-right" id="add-row-${fieldId}">Add Row Option +</a>
        </div>
        <br>
        <div class="sfb-table-dropdown-values">
        
        </div>
        <label class="sfb-false-label">Columns &nbsp; &nbsp;</label>
        <div class="sfb-Tcol">
          <ol class="sfb-sortable-options sfb-ui-sortable" id="cl_${fieldId}">
            ${outOptionsColumns}
          </ol>
        </div>
        <div class="sfb-option-actions">
          <a class="sfb-add sfb-add-opt sfb-btn sfb-btn-default sfb-pull-right" id="add-col-${fieldId}">Add Column Option +</a>
        </div>
      </div>
    </div>
  `;

    }

/**
 * Generates an HTML string for editing a payment form field.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit (should be 'payment').
 * @param {Element} mainElement - The main element of the field in the form.
 * @returns {string} The HTML string for the payment field edit form.
 */
function generatePaymentInput(fieldId, fieldType, mainElement) {
    // Generate the HTML string for payment input fields
    return `
    <label>Product</label>
    <select name="product_logic" class="sfb-fld-label sfb-form-control">
      ${productOptions()}
    </select>
  `;
}


    /**
     * Generates an HTML string for editing data list input fields.
     * @param {string} fieldId - The ID of the field to edit.
     * @param {string} fieldType - The type of the field to edit.
     * @param {HTMLElement} mainElement - The main element of the field to edit.
     * @returns {string} The HTML string for the data list edit form.
     */
    function generateDataListInput(fieldId, fieldType, mainElement) {
        const dataListUrl = mainElement.getAttribute('data-url') || '';

        return `
    <div id="data_list_${fieldId}" class="sfb-edit_template">
      <label>URL</label>
      <input type="url" name="data_list_url" class="sfb-form-control" value="${dataListUrl}" placeholder="https://example.com" pattern="https://.*" required>
    </div>
  `;
    }

/**
 * Generates an HTML string for editing a conjoint input field.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit.
 * @param {Object} mainElement - The main element of the field to edit.
 * @returns {string} The HTML string for the conjoint input edit form.
 */
function generateConjointInput(fieldId, fieldType, mainElement) {
    // Generate the HTML string for conjoint input fields
    return `
    <button onclick="generate_div('${fieldId}')" id="generate-divs-${fieldId}" class="sfb-btn sfb-btn-primary sfb-generate_div">Generate Divs</button>
    <br><br>
    <div class="sfb-someclass">
        <div class="sfb-row" id="generated-divs-${fieldId}"></div>
    </div>`;
}

/**
 * Converts input elements within a div into a JSON format.
 * @param {string} jsonDivId - The id of the div containing input elements.
 * @returns {Array} - The generated JSON array.
 */
function convertInputToJson(jsonDivId) {
    const json = [];
    let values= [];
    let rows= [{name: 'option 1', value: 'option-1'}];
    let columns = [{name: 'option 1', value: 'option-1'}];
    let label, fieldType, fieldName, tableType, className, defaultValue;
    let placeholder, required , demographic;
    let max, min, conditionalOption, conditionalValue, product, price,selectedOption;

    const inputs = document.querySelectorAll(`#div_${jsonDivId} input, select, textarea`);

    inputs.forEach((input) => {
        const inputName = input.getAttribute('name');
        const inputValue = input.value;

        switch (inputName) {
            case "label":
                label = inputValue;
                fieldType = input.getAttribute("data-elementType");
                fieldName = input.getAttribute("data-id");
                break;
            case "placeholder":
                placeholder = inputValue;
                break;
            case "select-option":
                const isSelected = input.previousElementSibling.checked;
                const optionValue = input.nextElementSibling.value;
                const show_on = input.nextElementSibling && input.nextElementSibling.nextElementSibling
                    ? input.nextElementSibling.nextElementSibling.value
                    : '';
                const parentTrow = input.closest('.sfb-Trow');
                const parentTcol = input.closest('.sfb-Tcol');

                if (parentTrow !== null) {
                    rows.push({ "name": inputValue, "selected": isSelected, "value": optionValue,"show_on":show_on});
                } else if (parentTcol !== null) {
                    columns.push({ "name": inputValue, "value": optionValue});
                }else{
                    values.push({ "label": inputValue, "selected": isSelected, "value": optionValue,"show_on":show_on});
                }

                selectedOption = 1;
                break;
            case "select-optionR":
                const optionValueR = input.nextElementSibling.value;
                const show_onR = input.nextElementSibling.nextElementSibling.value;
                rows.push({ "name": inputValue , "value": optionValueR ,"show_on":show_onR});
                break;
            case "select-optionC":
                columns.push({ "name": inputValue});
                break;
            case "fld_max":
                max = inputValue;
                break;
            case "fld_min":
                min = inputValue;
                break;
            case "fld_step":
                tableType = inputValue;
                break;
            case "required":
                if (input.checked) {
                    required = inputValue;
                }
                break;
            case "demographic":
                if (input.checked) {
                    demographic = inputValue;
                }
                break;
            case "form_logic":
                conditionalOption = inputValue;
                break;
            case "logic_option":
                conditionalValue = inputValue;
                break;
            case "table_type":
                tableType = inputValue;
                break;
            case "product_logic":
                product = inputValue;
                price = products[products.findIndex(img => img.id === product)].price;
                break;
            case "class":
                className = inputValue;
                break;
            case "default_value":
                defaultValue = inputValue;
                break;
        }
    });

    if (selectedOption !== 1) {
        values = '';
    }
    json.push({
        "type": fieldType,
        "label": label,
        "name": fieldName,
        "rows": rows,
        "demographic": demographic,
        "columns": columns,
        "tableType": tableType,
        "class": className,
        "default_value": defaultValue,
        "choices": [],
        "placeholder": placeholder,
        "value": values,
        "readonly": " ",
        "min": min,
        "max": max,
        "required": required,
        "conditionalOption": conditionalOption,
        "conditionalValue": conditionalValue,
        "product": product,
        "price": price
    });

    return json;
}

    /**
     * Resets the form with the given ID by clearing all input fields.
     * Prompts the user with a confirmation message before performing the action.
     * @param {string} formId - The ID of the div which contains the form to reset.
     */
    function resetForm(formId) {
        const message = "Do you really want to clear fields? \n" +
            "You would lose unsaved changes.";

        showConfirm('Confirm', message, () => {
            const formElement = document.getElementById(formId);
            formBuilder(formElement);
        });
    }

/**
 * Save form data to a cookie and send it to the server.
 * @param callback
 */
function saveFormData(callback) {
    try {
        const formData = generateFormJson();
        if(callback && typeof(callback) === "function"){
            callback(formData);
        }else{
            console.log(formData);
            showAlert('Current Form JSON', JSON.stringify(formData))
        }
    } catch (error) {
        console.error('Error generating form data:', error);
    }
}

    /**
     * Deletes a form element with the given ID suffix.
     * @param {string} idSuffix - The suffix of the element's ID.
     */
    function deleteFormElement(idSuffix) {
        showConfirm('Confirm', 'Do you really want to delete this element?', () => {
            const element = document.getElementById("main" + idSuffix);
            if (element) {
                element.remove();
            }
        });
    }

    function createModal(title, body, footer) {
        const modal = document.createElement('div');
        modal.className = 'sfb-custom-modal';

        modal.innerHTML = `
    <div class="sfb-custom-modal-content">
      <div class="sfb-custom-modal-header">
        <h3 class="sfb-custom-modal-title">${title}</h3>
        <span class="sfb-custom-modal-close">&times;</span>
      </div>
      <div class="sfb-custom-modal-body">${body}</div>
      <div class="sfb-custom-modal-footer">${footer}</div>
    </div>
  `;

        // Close the modal when the close button or the backdrop is clicked
        modal.querySelector('.sfb-custom-modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        return modal;
    }

    function showAlert(title, message) {
        const footer = '<button class="sfb-modal-btn">OK</button>';
        const modal = createModal(title, message, footer);

        document.body.appendChild(modal);

        modal.style.display = 'block';

        modal.querySelector('.sfb-modal-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    function showConfirm(title, message, onConfirm) {
        const footer = `
    <button class="sfb-modal-btn sfb-confirm sfb-btn-success">Yes</button>
    <button class="sfb-modal-btn sfb-cancel sfb-btn-danger">No</button>
  `;
        const modal = createModal(title, message, footer);

        document.body.appendChild(modal);

        modal.style.display = 'block';

        modal.querySelector('.sfb-confirm').addEventListener('click', () => {
            onConfirm();
            modal.style.display = 'none';
        });

        modal.querySelector('.sfb-cancel').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
/**
 * Copies an element and generates a new one with a unique ID.
 *
 * @param {string} elementID - The ID of the element to be copied.
 * @return {void}
 */
function copyElement(elementID) {
    const element = document.getElementById(elementID);
    let formData;

    if (element) {
        formData = generateFormJson(`#main${elementID}`)[0];
    } else {
        formData = convertInputToJson(elementID)[0];
    }

    const uniqueCounter =  Math.floor(Math.random() * (1e13 - 1e12) + 1e12);
    formData.name = `v${uniqueCounter}`;

    const newElement = checkType(formData, 1);
    element.parentElement.insertAdjacentHTML('afterend', newElement);
}

/**
 * Generates a JSON object containing form data and settings.
 * @param {string} formId - The ID of the form to generate the JSON for.
 * @returns {Object} - The generated JSON object containing form data and settings.
 */
function generateFormJson(formId = '') {
    const json = [];
    document.querySelectorAll('.sfb-main-form' + formId).forEach((element) => {
        let optionValues = [], label = '', className, defaultValue = '', conditionalOption = element.dataset.conditionaloption,
            conditionalValue = element.dataset.conditionalvalue, placeholder = '',
            required = '', demographic = '', values = '', rows = [], columns = [], tableType = '', price = '',
            product = '', min = '', max = '';
        const tag = element.getAttribute('data-type');
        const id = element.getAttribute('id').split('main')[1];
        className = element.getAttribute('class');

        switch (tag) {
            case 'date':
            case 'number':
            case 'text':
            case 'picture':
            case 'hidden':
                // Logic for these tag types
                placeholder = element.dataset.placeholder;
                const inputElement= element.querySelector('input');
                required = inputElement.getAttribute('required');
                demographic = inputElement.getAttribute('demographic');
                if ((tag === 'number')) {

                    min = inputElement.getAttribute('min');
                    max = inputElement.getAttribute('max');
                    tableType = inputElement.getAttribute('step');
                }
                break;
            case 'select':
                values = generateSelectValues(id);
                break;
            case 'checkbox':
            case 'radio':
                values = generateCheckboxRadioValues(id);
                break;
            case 'textarea':
                // Logic for textarea tag type
                break;
            case 'table':
                const { rows: generatedRows, columns: generatedColumns } = generateTableRowsColumns(id);
                rows = generatedRows;
                columns = generatedColumns;
                break;
            case 'payment':
                // Logic for payment tag type
                break;
            default:
                break;
        }

        json.push({
            type: tag,
            label: label,
            name: id,
            demographic: demographic,
            rows: rows,
            columns: columns,
            tableType: tableType,
            class: className,
            defaultValue: defaultValue,
            choices: [],
            placeholder: placeholder,
            value: values,
            readonly: '',
            min: min,
            max: max,
            required: required,
            conditionalOption: conditionalOption,
            conditionalValue: conditionalValue,
            product: product,
            price: price,
        });
    });

    return json;
}
/**
 * Generates values for select tags.
 * @param {string} id - The ID of the select element.
 * @returns {Array} - The values array of the select element.
 */
function generateSelectValues(id) {
    const values = [];

    document.querySelectorAll(`#${id} option`).forEach((option) => {
        if (!option.disabled) {
            values.push({
                label: option.textContent,
                selected: option.selected,
                value: option.value,
            });
        }
    });

    return values;
}

/**
 * Generates values for checkbox and radio tags.
 * @param {string} id - The ID of the checkbox or radio input element.
 * @returns {Array} - The values array of the checkbox or radio input element.
 */
function generateCheckboxRadioValues(id) {
    const values = [];

    document.querySelectorAll(`#${id} input`).forEach((input) => {
        values.push({
            label: input.parentElement.textContent,
            selected: input.checked,
            value: input.value,
        });
    });

    return values;
}

/**
 * Generates table rows and columns for table tags.
 * @param {string} id - The ID of the table element.
 * @returns {Object} - An object containing table rows and columns.
 */
function generateTableRowsColumns(id) {
    const rows = [];
    const columns = [];

    const table = document.getElementById(id);
    const rowCount = table.rows.length;
    const colCount = table.rows[0].cells.length;

    columns.push({ name: 'generic 1', value: 'generic 1' });
    rows.push({ name: 'generic 1' });

    for (let i = 0; i < rowCount / 2; i++) {
        for (let j = 0; j < colCount; j++) {
            const cell = document.getElementById(`${id}_${i}_${j}`);
            if (i === 0 && j !== 0) {
                columns.push({ name: cell.textContent, value: cell.dataset.value });
            } else if (j === 0 && i !== 0) {
                rows.push({ name: cell.textContent });
            }
        }
    }

    return { rows, columns };
}

    /**
     * Edits the options for a specified HTML element based on the provided ID and tag, applying changes
     * to related elements and configurations if necessary.
     *
     * @param {string} id - The ID of the target HTML element to edit.
     * @param {string} tag - The type of the target HTML element (e.g., 'select', 'checkbox', 'radio', or 'table').
     * @returns {Object} An object containing the edited option values, output rows, and output columns.
     */
    function editForOptions(id, tag) {
        const optionValues = {
            rows: [],
            columns: []
        };
        const element = document.getElementById(id);
        let tableType = '';

        if (tag === 'select') {
            const options = element.querySelectorAll('option:not([disabled])');
            options.forEach((option) => {
                const selected = option.selected;
                optionValues.rows.push({
                    label: option.textContent,
                    selected: selected,
                    show_on: option.getAttribute('data-cond-show_on'),
                    value: option.value
                });
            });
        } else if (tag === 'checkbox' || tag === 'radio') {
            const inputs = element.querySelectorAll('input');
            inputs.forEach((input) => {
                const selected = input.checked;
                optionValues.rows.push({
                    label: input.parentElement.textContent,
                    selected: selected,
                    show_on: input.getAttribute('data-cond-show_on'),
                    value: input.value
                });
            });
        } else if (tag === 'table') {
            tableType = element.getAttribute("data-tabletype");
            const rows = element.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td, th');
                cells.forEach((cell, colIndex) => {
                    if (rowIndex === 0 && colIndex !== 0) {
                        optionValues.columns.push({
                            label: cell.textContent
                        });
                    } else if (colIndex === 0 && rowIndex !== 0) {
                        optionValues.rows.push({
                            label: cell.textContent,
                            value: cell.getAttribute('data-value')
                        });
                    }
                });
            });
        }

        // Generate the output HTML elements.
        const filterDatalist = updateFilterOption(id);

        const generateOptions = (options, isColumn) => {
            return options.map(option => {
                const checked = option.selected ? 'checked' : '';
                const showOn = option.show_on ? option.show_on : '';
                const hideOptionValue = (tableType === "Text" || tableType === "Text Area" || tableType === "Number") ? 'style="display:none;"' : '';
                const disableOptionValue = (tableType === "Text" || tableType === "Text Area" || tableType === "Number") ? 'disabled' : '';
                return `
              <li class="sfb-ui-sortable-handle">
                <input type="radio" class="sfb-selected-option" value="false" name="selected-option" ${checked}>
                <input type="text" class="sfb-option-label" value="${option.label}" name="select-option" placeholder="Label">
                ${!isColumn ? `
                <input type="text" class="sfb-option-value" value="${option.value}" name="select-value" placeholder="Value" ${disableOptionValue} ${hideOptionValue}>
                <input class="sfb-option-filter" list="filter-list-${id}" value="${showOn}" name="select-filter" id="filter-${id}" placeholder="show On Filter">
                    <datalist id="filter-list-${id}">
                    ${filterDatalist}
                    </datalist>` : ''}
                <a onclick="this.parentElement.remove();" class="sfb-remove sfb-btn" title="Remove Element">×</a>
              </li>`;
            }).join('');
        };

        const outOptionsRows = generateOptions(optionValues.rows, false);
        const outOptionsColumns = generateOptions(optionValues.columns, true);

        return {
            optionValues: optionValues,
            outOptionsRows: outOptionsRows,
            outOptionsColumns: outOptionsColumns
        };
    }

    /**
     * Generates an HTML string of options for a select element based on the provided field ID and the elements in the main-form class.
     * @param {string} fieldId - The ID of the field to conditionally display options for.
     * @returns {string} - The HTML string of options for the select element.
     */
    function fieldCondition(fieldId) {
        const mainElement = document.getElementById('main' + fieldId);
        const conditionalOption = mainElement.getAttribute("data-conditionalOption");
        let isSelected = 'selected';
        if (conditionalOption) {
            isSelected = '';
        }
        let optionsHtml = '<option value="" ' + isSelected + '>No Logic</option>';

        const mainFormElements = document.querySelectorAll('.sfb-main-form');
        mainFormElements.forEach((elem) => {
            const dataType = elem.getAttribute('data-type');
            if (dataType === 'select' || dataType === 'radio' || dataType === 'checkbox') {
                const id = elem.querySelector('label').getAttribute('for');
                isSelected = '';
                if (id === conditionalOption) {
                    isSelected = 'selected';
                }
                if (id !== fieldId) {
                    optionsHtml += '<option ' + isSelected + ' value="' + id + '">' + document.getElementById('field_' + id).textContent + '</option>';
                }
            }
        });

        return optionsHtml;
    }

    /**
     * Update the option based on the element ID and conditional option.
     * @param {string} elementID - The element ID to update the option for.
     * @returns {string} The updated options as an HTML string.
     */
    function updateFilterOption(elementID) {
        let optionValues = [];

        const mainFormElements = document.querySelectorAll(".sfb-main-form");
        mainFormElements.forEach((currentElement) => {
            const tag = currentElement.getAttribute("data-type");
            const currentelementID = currentElement.getAttribute("id").replace("main", "");
            if (currentelementID === elementID) {
                return;
            }
            const labelText = document.getElementById("label_span_" + currentelementID).innerHTML;

            if (tag === "select") {
                const options = currentElement.querySelectorAll("option");
                options.forEach((option) => {
                    if (!option.disabled) {
                        optionValues.push({ "label": `${labelText} - ${option.textContent}`, "value": `${currentelementID} - ${option.value}` });
                    }
                });
            } else if (tag === "checkbox" || tag === "radio") {
                const inputs = currentElement.querySelectorAll("input");
                inputs.forEach((input) => {
                    optionValues.push({ "label": `${labelText} - ${input.parentElement.textContent}`, "value": `${currentelementID} - ${input.value}` });
                });
            }
        });

        return optionValues.map(option => {
            return `
        <option value="${option.value}">${option.label}</option>`;
        }).join("");
    }

    /**
     * Update the option based on the element ID and conditional option.
     * @param {string} elementID - The element ID to update the option for.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     */
    function updateOption(elementID, conditionalOption) {
        let optionsCond = '';
        const mainElement = document.getElementById('main' + elementID);
        const conditionalValue = mainElement.getAttribute("data-conditionalValue");
        const logicOption = document.getElementById('logic_option');

        const mainFormElements = Array.from(document.querySelectorAll('.sfb-main-form'));
        mainFormElements.forEach((currentElement) => {
            const tag = currentElement.getAttribute('data-type');

            if (tag === 'select') {
                optionsCond = handleSelect(optionsCond, currentElement, conditionalOption, conditionalValue);
            } else if (tag === 'checkbox' || tag === 'radio') {
                optionsCond = handleCheckboxRadio(optionsCond, currentElement, conditionalOption, conditionalValue);
            }
        });

        const myClassInput = document.querySelector(`[data-id="${elementID}"][name="class"]`);
        let myClassInputValue = myClassInput.value;
        const hasConditionalClass = myClassInput.classList.contains('sfb-conditional');
        const hasInverseConditionalClass = myClassInput.classList.contains('sfb-con_inverse_ditional');
        let checkInverse = '';

        if (conditionalOption === '') {
            if (hasConditionalClass) {
                myClassInput.classList.remove('sfb-conditional');
            }
            if (hasInverseConditionalClass) {
                myClassInput.classList.remove('sfb-con_inverse_ditional');
            }
        } else {
            if (!hasConditionalClass && !hasInverseConditionalClass) {
                myClassInput.classList.add('sfb-conditional');
            }
            if (hasInverseConditionalClass) {
                checkInverse = 'checked';
            }
        }

        logicOption.innerHTML = `
        <select class="sfb-form-control" name="logic_option">${optionsCond}</select>
        <br>
        <input type="checkbox" ${checkInverse} id="sss"> Inverse
        <br>
    `;
    }

    /**
     * Handle select elements.
     * @param {string} optionsCond - The current options string.
     * @param {HTMLElement} currentElement - The current HTMLElement.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     * @param {string} conditionalValue - The conditional value from the main element.
     * @returns {string} - The updated options string.
     */
    function handleSelect(optionsCond, currentElement, conditionalOption, conditionalValue) {
        const selectElement = currentElement.querySelector('select');
        const id = selectElement.getAttribute('id');

        if (id === conditionalOption) {
            currentElement.querySelectorAll('option').forEach((optionElement) => {
                const selected = conditionalValue === optionElement.value ? 'selected' : '';
                optionsCond += `<option ${selected} value="${optionElement.value}">${optionElement.textContent}</option>`;
            });
        }

        return optionsCond;
    }

    /**
     * Handle checkbox and radio elements.
     * @param {string} optionsCond - The current options string.
     * @param {HTMLElement} currentElement - The current HTMLElement.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     * @param {string} conditionalValue - The conditional value from the main element.
     * @returns {string} - The updated options string.
     */
    function handleCheckboxRadio(optionsCond, currentElement, conditionalOption, conditionalValue) {
        const labelElement = currentElement.querySelector('label');
        const id = labelElement ? labelElement.getAttribute('for') : '';

        if (id === conditionalOption) {
            const inputs = Array.from(currentElement.querySelectorAll('input'));
            inputs.forEach((inputElement) => {
                const selected = conditionalValue === inputElement.value ? 'selected' : '';
                optionsCond += `<option ${selected} value="${inputElement.value}">${inputElement.parentElement.textContent}</option>`;
            });
        }

        return optionsCond;
    }
/**
 * Generates an HTML string for the product options in a payment field.
 * @returns {string} The HTML string for the product options.
 */
function productOptions(){
    let s = '';
    for(let val in products) {
        s = s + '<option value = "'+products[val].id+'">'+products[val].name+'</option>';
    }
    return s;
}

/**
 * Update the text of an element with the product value of two input elements.
 * @param {number} value - The value to be multiplied.
 * @param {string} parentId - The parent ID used as a prefix for the element IDs.
 * @return {boolean} - Returns true if the operation is successful, false otherwise.
 */
function updateProductValue(value, parentId) {
    try {
        const payTotalElement = document.querySelector(`#${parentId}_pay_total`);
        const payPriceElement = document.querySelector(`#${parentId}_payPrice`);

        if (!payTotalElement || !payPriceElement) {
            throw new Error('Element not found');
        }

        const payPriceValue = parseFloat(payPriceElement.value);

        if (isNaN(value) || isNaN(payPriceValue)) {
            throw new Error('Invalid value');
        }

        const product = value * payPriceValue;
        payTotalElement.textContent = `GHS ${product}`;
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

    /**
     * Toggles the 'inline' class for the specified element based on the checked status of the inline checkbox.
     * @param {HTMLInputElement} inlineCheckbox - The checkbox used to toggle the 'inline' class.
     * @param {string} fieldId - The attribute value to identify the target element.
     */
    function toggleInlineClass(inlineCheckbox, fieldId) {
        const myClassInput = document.querySelector(`[data-id="${fieldId}"][name="class"]`);

        if (myClassInput) {
            const myClassInputValue = myClassInput.value;
            const flag = myClassInputValue.includes('sfb-inline');

            if (!inlineCheckbox.checked) {
                if (flag) {
                    myClassInput.value = myClassInputValue.replace('sfb-inline', '').trim();
                }
            } else {
                if (!flag) {
                    myClassInput.value = `${myClassInputValue.trim()} sfb-inline`;
                }
            }
        }
    }

/**
 * Fisher-Yates-Durstenfeld shuffle algorithm to shuffle an array.
 * @param {Array} sourceArray - The array to be shuffled.
 * @returns {Array} - A new array containing the shuffled elements from the source array.
 */
function shuffle(sourceArray) {
    // Create a copy of the input array to avoid mutating the original array
    const newArray = [...sourceArray];

    for (let i = 0; i < newArray.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (newArray.length - i));

        let temp = newArray[j];
        newArray[j] = newArray[i];
        newArray[i] = temp;
    }

    return newArray;
}

/**
 * Checks if the given URL string is valid.
 * @param {string} url - The URL string to be checked.
 * @return {boolean} - Returns true if the URL is valid, false otherwise.
 */
function validURL(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.,~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(url);
}



    /**
     * Builds a datalist element and sets its inner HTML based on the provided data.
     *
     * @param {string} id - The ID of the datalist element.
     * @param {Object} elementOptionsAJAX - The data used to populate the datalist.
     * @param {string} url - The URL containing the order of the properties.
     */
    function buildDatalist(id, elementOptionsAJAX, url) {
        let tempType = '';

        const datalistElement = document.getElementById(`${id}_list`);
        if (datalistElement) {
            // Get the order of the properties from the URL
            const order = url.match(/column=([^&]+)/)[1].split(",");
            for (const x in elementOptionsAJAX[id]) {
                let additionalValue = '';
                if (Object.keys(elementOptionsAJAX[id][x]).length > 2) {
                    for (let y = 2, len = Object.keys(elementOptionsAJAX[id][x]).length; y < len; y++) {
                        additionalValue += ` data-value_${y}="${elementOptionsAJAX[id][x][order[y]]}"`;
                    }
                }

                tempType += `<option ${additionalValue} data-value="${elementOptionsAJAX[id][x][order[0]]}" value="${elementOptionsAJAX[id][x][order[1]]}">${elementOptionsAJAX[id][x][order[1]]}</option>`;
            }
            if (tempType.length !== 0) {
                datalistElement.innerHTML = tempType;
            }
            return;
        }

        // The element is not in the DOM, so we need to retry
        setTimeout(() => {
            buildDatalist(id, elementOptionsAJAX, url);
        }, 1000); // retry after 1 second
    }

    /**
     * Generates a new div with specified attributes and appends it to the parent container.
     * @param {string} id - The id of the parent container.
     */
    function generateDiv(id) {
        const parentContainer = document.getElementById('generated-divs-' + id);
        let count = parentContainer.querySelectorAll('.sfb-col-md-6').length || 0;
        parentContainer.innerHTML += `
    <div id="generated-divlet-${count}" class="sfb-col-md-6 sfb-col-lg-6 sfb-col-sm-6">
        <div class="sfb-btn-group" role="group" aria-label="...">
            <input class="sfb-btn-group sfb-form-control sfb-attribute-name-input" placeholder="Attribute Name" type="text">
            <div class="btn-group" role="group">
                <button type="button" class="sfb-btn sfb-btn-default sfb-dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="sfb-attribute-type">Attribute Type:</span>
                    <span class="caret"></span>
                </button>
                <ul class="sfb-dropdown-menu">
                    <li><a href="#" data-value="text">Text</a></li>
                    <li><a href="#" data-value="price">Price</a></li>
                    <li><a href="#" data-value="image">Image</a></li>
                </ul>
            </div>
            <button class="sfb-delete-input sfb-btn sfb-btn-danger sfb-btn-group">&times;</button>
        </div>
        <br><br>
        <div class="sfb-input-container"></div>
        <br>
        <div><button class="sfb-delete-input sfb-btn btn-success">+</button></div>
        <br><br>
    </div>`;

        const container = parentContainer.querySelector('#generated-divlet-' + count);

        parentContainer.addEventListener('click', function (event) {
            if (event.target.matches('.sfb-dropdown-menu a')) {
                const selected = event.target.getAttribute('data-value');
                container.querySelector('.sfb-attribute-type').innerHTML = selected;

                const inputContainer = container.querySelector('.sfb-input-container');
                let newInnerHtml;

                if (selected === 'text') {
                    newInnerHtml = '<input type="text" class="sfb-form-control sfb-btn-group sfb-attribute-input" />';
                } else if (selected === 'price') {
                    newInnerHtml = '<input type="number" class="sfb-form-control sfb-btn-group sfb-attribute-input" />';
                } else if (selected === 'image') {
                    newInnerHtml = `
                <input type="text" list="images-${id}" class="sfb-form-control sfb-btn-group sfb-attribute-input" />
                <datalist id="images-${id}">
                    <option value="image1.jpg">
                    <option value="image2.jpg">
                    <option value="image3.jpg">
                </datalist>`;
                }
                inputContainer.innerHTML = `<div class="sfb-btn-group" role="group">${newInnerHtml}<button class="sfb-delete-input sfb-btn sfb-btn-danger sfb-btn-group">&times;</button></div>`;
            } else if (event.target.matches('.delete-input')) {
                container.remove();
            }
        });
    }


    /**
     * Show the modal with the given ID.
     * @param {string} modalId - The ID of the modal to show.
     */
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "block";
    }

    /**
     * Hide the modal with the given ID.
     * @param {string} modalId - The ID of the modal to hide.
     */
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "none";
    }


})();
