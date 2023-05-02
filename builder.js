
// Custom JavaScript Library for Drag & Drop Form Builder
const formBuilderLibrary = (function (options) {

    //to prevent multiple ajax calls
    var elementOptionsAjax = {};
    var mathRe = /\s*{.*?}\s*/g;

    // Public API functions
    return {
        // Export the formBuilder function to the library's public API
        attachToElement: function (element,displayType) {
            const $elem = $(element);
            $mainDiv = $elem;
            if ($elem.length) {
                if(displayType ==='formBuilder') {
                    formBuilder($elem);
                }else{
                    renderForm($elem)
                }
            }
        }

    }
    // Private utility functions

    /**
     * Initialize the drag and drop plugin.
     */
     function formBuilder ($elem) {
        $elem.empty();

        const formica = getFormicaHTML();
        const menu = getMenuHTML();

        $elem.addClass("row formized");
        $elem.append(formica + menu);

        attachEventListeners($elem);
    }



    /**
     * Renders elements from a JSON array.
     * @param {Array} json - The JSON array to render elements from.
     * @param {number} mode - The rendering mode (2 or 3).
     * @returns {string | undefined} The rendered elements, or undefined if mode is not 2.
     */
    function renderForm(json, mode) {
        if (!Array.isArray(json) || typeof mode !== "number") {
            return;
        }

        $(this).empty();
        let outDiv = "";

        json.forEach((element) => {
            let outType;
            if (mode === 3) {
                outType = checkType(element, mode);
            } else {
                outType = checkType(element, 2);
            }
            outDiv += outType;
        });

        if (mode === 2) {
            return outDiv;
        } else {
            $(this).append(outDiv);
        }
    }

    /**
     * Get the Formica HTML string.
     * @returns {string} Formica HTML string.
     */
    function getFormicaHTML() {
        return `<div id="mainFormEdit" class="col-md-9 formica">
      <ul class="connected"></ul>
    </div>
  `;
    }

    /**
     * Get the Menu HTML string.
     * @returns {string} Menu HTML string.
     */
    function getMenuHTML() {
        return `
        <div class="col-md-3">
            <div id="FormEditItems">
                <ul id="sortable1" class="connectedSortable">
         <li class="btn btn-default btn-block" data-type="checkbox" data-class="main-form " data-index="15">Checkbox Group</li>
        <li class="btn btn-default btn-block" data-type="radio" data-class="main-form " data-index="14">Radio Group</li>
        <li class="btn btn-default btn-block" data-type="select" data-class="main-form " data-index="17">Select</li>
        <li class="btn btn-default btn-block" data-type="datalist" data-class="main-form " data-index="27">Data List</li>
        <li class="btn btn-default btn-block" data-type="text" data-class="main-form " data-index="1">Text Field</li>
        <li class="btn btn-default btn-block" data-type="textarea" data-class="main-form " data-index="16">Text Area</li>
        <li class="btn btn-default btn-block" data-type="date" data-class="main-form " data-index="9">Date Field</li>
        <li class="btn btn-default btn-block" data-type="number" data-class="main-form " data-index="2">Number</li>
        <li class="btn btn-default btn-block" data-type="range" data-class="main-form " data-index="23">Range</li>
        <li class="btn btn-default btn-block" data-type="hidden" data-class="main-form " data-index="28">Hidden</li>
        <li class="btn btn-default btn-block" data-type="paragraph" data-class="main-form " data-index="18">Paragraph</li>
        <li class="btn btn-default btn-block" data-type="header" data-class="main-form " data-index="21">Header</li>
        <li class="btn btn-default btn-block" data-type="picture" data-class="main-form " data-index="24">Picture</li>
        <li class="btn btn-default btn-block" data-type="payment" data-class="main-form " data-index="25">Payment</li>
        <li class="btn btn-default btn-block" data-type="conjoint" data-class="main-form" data-index="30">Conjoint</li>
        <li class="btn btn-default btn-block" data-type="table" data-class="panel panel-default main-form " data-index="22">Table</li>
        <li class="btn btn-default btn-block" data-type="button" data-class="main-form " data-index="29">Button</li>
                </ul>
                <div class="pull-right">
                    <button class="btn btn-default" id="promptBtn">Prompt</button>
                    <button class="btn btn-default" id="templatesBtn">Templates</button>
                    <button class="btn btn-default" id="imageAssetBtn">Image Assets</button>
                    <button class="btn btn-danger" id="resetBtn">Reset</button>
                    <button class="btn btn-primary" id="newFormBtn">New Form</button>
                    <button class="btn btn-success" id="saveBtn">Save</button>
                </div>
            </div>
        </div>
    `;
    }

    /**
     * Attach event listeners to the elements.
     * @param {jQuery} $container The container element.
     */
    function attachEventListeners($container) {

        $container.on("hover", ".del-button", handleDelButtonHover);
        $container.on("click", "#promptBtn", showQuestionnairePrompt);
       // $container.on("click", "#templatesBtn", templates);
        $container.on("click", "#imageAssetBtn", imageAsset);
        $container.on("click", "#resetBtn", resetForm);
        $container.on("click", "#newFormBtn", clearNamePageUpload);
        $container.on("click", "#saveBtn", saveFormData);
        $(".btn").draggable({
            cursor: "move",
            revert: "invalid",
            helper: "clone",
            connectToSortable: ".connected"
        });

        $(".connected").sortable({
            cursor: "move",
            beforeStop: function (event, ui) {
                draggedItem = ui.item;
            },
            receive: function (event, ui) {
                outType = checkType(draggedItem, 1);
                $(draggedItem).replaceWith(outType);
            }
        });

        // Add event delegation for action elements here
        $container.on("click", ".toggle-form", function(event) {
            const target = $(this);
            editElement(target.data("id"), target.data("elementtype"));
        });

        $container.on("click", ".copy-button", function(event) {
            const target = $(this);
            copyElement(target.data("id"));
        });

        $container.on("click", ".del-button", function(event) {
            const target = $(this);
            deleteFormElement(target.data("id"));
        });
    }

    /**
     * Handle the hover event for the delete button.
     * @param {Event} ev The event object.
     */
    function handleDelButtonHover(ev) {
        const container = $(this).parent().parent();
        container.toggleClass("del-button_main-form_hover", ev.type === "mouseenter");
    }

    /**
     * Generates field label and actions elements.
     * @param {string} id - The field id.
     * @param {string} dataType - The data type of the field.
     * @returns {object} - An object containing the field label and actions elements.
     */
    function generateFieldLabelAndActions(id, dataType) {
        const fieldLabel = `
    <label id="field_${id}" for="${id}" class="fb-repType-Label formzone pull-left">
      <span id="label_span_${id}">Text Field</span>
      <span id="history_span_${id}"></span>
    </label>
  `;
        const fieldActions = `
    <div class="pull-right">
      <a class="toggle-form btn glyphicon glyphicon-pencil" data-id="${id}" data-elementType="${dataType}" title="Edit"></a>
      <a class="copy-button btn glyphicon glyphicon-duplicate" data-id="${id}" data-elementType="${dataType}" title="Copy"></a>
      <a class="del-button btn delete-confirm" data-id="${id}" data-elementType="${dataType}" title="Remove Element">×</a>
    </div>
  `;

        const actionsElement = document.createElement('div');
        actionsElement.innerHTML = fieldActions;

        return {
            fieldLabelElement: fieldLabel,
            fieldActionsElement: actionsElement.outerHTML
        };
    }
function getAttrs(DOMelement) {
    var obj = {};
    $.each(DOMelement.attributes, function () {
        if (this.specified) {
            obj[this.name] = this.value;
        }
    });
    return obj;
}



//gpt 4 start
function checkType(elementType, mode) {
    let outType;
    let elementId = elementType.name || '';
    let dataType = elementType.type || '';
    let label = elementType.label || '';
    let required = elementType.required || '';
    let demographic = elementType.required || '';
    let className = elementType.class || '';
    let inline = className.includes('inline') ? 'inline' : '';
    let placeholder = elementType.placeholder || '';
    let readonly = elementType.readonly || '';
    let min = elementType.min || '';
    let max = elementType.max || '';
    let value = elementType.value || '';
    let defaultValue = elementType.defaultValue || '';
    let condValue = elementType.condValue || '';
    let condOption = elementType.condOption || '';
    let price = elementType.price || '';
    let product = elementType.product || '';
    let condChildOption = elementType.condChildOption || '';
    let tableType = elementType.tableType || '';

    if (mode === 1) {
        counter = Math.floor(Math.random() * (1e13 - 1e12) + 1e12);
        dataType = elementType.attr('data-type');
        elementId = 'v' + counter;
        className = elementType.attr('data-class');
    }
    const {fieldLabelElement , fieldActionsElement} = generateFieldLabelAndActions(elementId, dataType);

    const fieldBuilder = createFieldBuilder(dataType, elementId, label,fieldLabelElement);
    const actions = (mode === 1 || mode === 3) ? createAction(elementId, dataType,fieldActionsElement) : '';

    outType = generateOutput({
        dataType: dataType,
        elementId: elementId,
        elementType: elementType,
        mode: mode,
        label: label,
        fieldBuilder: fieldBuilder,
        actions: actions,
        defaultValue: defaultValue,
        placeholder: placeholder,
        condOption: condOption,
        condValue: condValue,
        demographic: demographic,
        className: className,
        required: required,
        readonly: readonly,
        min: min,
        max: max,
        value: value,
        product: product
    });
    return outType;

    function createFieldBuilder(elementType, elementId, label,fieldLabel) {
        if (elementType === 'paragraph' || elementType === 'header') {
            return fieldLabel.replace(/field_repIIDD/g, elementId)
                .replace(/Text Field/g, elementType)
                .replace(/repIIDD/g, elementId);
        } else if (elementType === 'hidden') {
            return `<label id="field_${elementId}" for="${elementId}" class="fb-repType-Label formzone pull-left ${required} form-hidden"><span id="label_span_${elementId}">${label !== '' ? label : elementType}</span><span id="history_span_${elementId}"></span></label>`;
        } else {
            return fieldLabel.replace(/repIIDD/g, elementId)
                .replace(/Text Field/g, label !== '' ? label : elementType);
        }
    }

    function createAction(elementId, dataType,fieldActionsElement) {
        return fieldActionsElement.replace(/counter/g, elementId)
            .replace(/data_type/g, `'${dataType}'`);
    }
}


// Function to generate the output based on dataType
function generateOutput(options) {
    const {
        dataType,
        elementId,
        elementType,
        mode,
        label,
        fieldBuilder,
        actions,
        defaultValue,
        placeholder,
        condOption,
        condValue,
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

// Functions to generate specific output types will be implemented here

/**
 * Generates the HTML for an input field based on the given options.
 * @param {Object} options - The options for the input field.
 */
function generateInputType(options) {
    let {dataType, elementId, label, fieldBuilder,
        actions,defaultValue, placeholder, demographic, condOption, condValue, autoFill, className, required, readonly, min, max, value, product} = options;

    let currency = '';
    let money = '';

    switch(dataType) {
        case 'currency':
            currency = '<span class="input-group-addon">&#8373;</span>';
            money = 'class="input-group"';
            break;
        case 'percentage':
            currency = '<span class="input-group-addon">%</span>';
            money = 'class="input-group"';
            break;
    }

    let outputValue = '';
    let rangeJs = '';

    if (dataType === 'range') {
        outputValue = '<output></output>';
        rangeJs = 'oninput="this.nextElementSibling.value = this.value"';
    }

    let inputType = dataType;
    if (getLogTypeFromJwt() === '3' && dataType === 'hidden' && elementId !== 'hidden_fallback') {
        inputType = 'text';
    }

    function getLogTypeFromJwt() {
        //todo find away of bringing jwt. You can just copy the cookie
      //  return JSON.parse(atob(jwt.split('.')[1]))['logType'];
    }

    function replaceSpecialChars(str) {
        return str.replace(/~~/g, '\n').replace(mathRe, ' ');
    }

    placeholder = replaceSpecialChars(placeholder);
    value = replaceSpecialChars(value);

    return `
        <div ${money} class="${className}" data-label="${label}" data-demographic="${demographic}" data-value="${defaultValue}" data-placeholder="${placeholder}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-auto_fill="${autoFill}" data-type="${dataType}" id="main${elementId}">
            ${fieldBuilder}${actions}<br>
            ${currency}
            <input ${rangeJs} step="${product}" ${required} min="${min}" max="${max}" type="${inputType}" ${readonly} class="form-control formzone pipe" placeholder="${placeholder}" name="${elementId}" id="${elementId}" value="${value}">${outputValue}
        </div>`;
}

function generateTextareaType(options) {
    const {
        elementId,
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

    const formattedPlaceholder = placeholder.replace(/~~/g, '\n').replace(mathRe, ' ');
    const formattedValue = value.replace(/~~/g, '\n');

    return `
    <div class="${className}" data-label="${label}" data-demographic="${demographic}" data-value="${defaultValue}" data-placeholder="${formattedPlaceholder}" data-cond-option="${conditionalOption}" data-cond-value="${conditionalValue}" data-type="textarea" id="main${elementId}">
      ${fieldBuilder}${actions}<br>
      <textarea ${required} ${readonly} data-max="${max}" class="form-control formzone pipe" name="${elementId}" placeholder="${formattedPlaceholder}" id="${elementId}">${formattedValue}</textarea>
    </div>`;
}

function generateButtonType(options) {
    const {
        elementId,
        label,
        defaultValue,
        placeholder,
        condOption,
        condValue,
        className,
        actions,
        fieldBuilder,
    } = options;

    return `
        <div class="${className}" data-label="${label}" data-value="${defaultValue}" data-placeholder="${placeholder}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-type="button" id="main${elementId}">
            ${actions}<br>
            <button type="button" class="form-control formzone btn-primary btn btn-sm" name="${elementId}" id="${elementId}">
                ${fieldBuilder}
            </button>
        </div>`;
}
function generatePictureType(options) {
    const {
        elementId,
        label = '',
        condOption = '',
        condValue = '',
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

    const output = `
        <div class="${className}" data-label="${label}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-type="picture" id="main${elementId}">
            ${fieldBuilder}
            ${actions}
            <input type="hidden" class="form-control formzone" name="${elementId}" id="${elementId}" value="${value}">
            <input ${requiredAttribute} type="file" ${readonlyAttribute} data-max="${max}" class="form-control formzone js-image-upload" accept="image/*" name="u___${elementId}" id="u___${elementId}" value="${value}" capture="environment">
            <div class="js-image-container" id="img${elementId}"></div>
        </div>
    `;

    return output;
}

function generateDatalistType(options) {
    const { elementId, label, demographic, condOption,mode, condValue, className, required, elementType,
        fieldBuilder,
        actions,} = options;

    let output = `<div class='${className}' data-label='${label}' data-demographic='${demographic}' data-cond-option='${condOption}' data-cond-value='${condValue}' data-type='datalist' id='main${elementId}'>${fieldBuilder}${actions}<br>`;

    if (mode === 1) {
        elementType.value = [
            { value: "option-1", label: "Option 1" },
            { value: "option-2", label: "Option 2" },
            { value: "option-3", label: "Option 3" }
        ];
    }

    if (validURL(elementType.url)) {
        fetchElementOptions(elementId, elementType.url)
            .then((options) => {
                elementOptionsAjax[elementId] = options;
                buildDatalist(elementId, elementOptionsAjax, elementType.url);
            });
    } else {
        elementOptionsAjax[elementId] = elementType.value;
    }

    let dataList = '';
    if (typeof elementType.value !== 'object') {
        dataList = elementType.value;
    }
    output += `<input autocomplete='off' ${required} list='${elementId}_list' class='form-control pipe formzone' name='${elementId}' id='${elementId}' value='${dataList}'>`;
    output += `<datalist id='${elementId}_list'></datalist></div>`;

    return output;
}


function fetchElementOptions(elementId, url) {
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
        elementId, label, demographic, condChildOption, condOption, condValue, className, required, readonly, mode, elementType, fieldBuilder,
        actions,
    } = options;

    const mainDiv = document.createElement('div');
    mainDiv.className = className;
    mainDiv.dataset.label = label;
    mainDiv.dataset.demographic = demographic;
    mainDiv.dataset.condChildOption = condChildOption;
    mainDiv.dataset.condOption = condOption;
    mainDiv.dataset.condValue = condValue;
    mainDiv.dataset.type = "select";
    mainDiv.id = "main" + elementId;

    const fieldBuilderDiv = document.createElement("div");
    fieldBuilderDiv.innerHTML = fieldBuilder;
    mainDiv.appendChild(fieldBuilderDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.innerHTML = actions;
    mainDiv.appendChild(actionsDiv);

    const selectElement = document.createElement('select');
    selectElement.className = "form-control pipe";
    selectElement.name = elementId;
    selectElement.id = elementId;
    if (required) selectElement.setAttribute('required', '');
    if (readonly) selectElement.setAttribute('readonly', '');

    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = '';
    defaultOption.textContent = '-- select an option --';
    selectElement.appendChild(defaultOption);

    if (elementId === '2029') {
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
        optionElement.dataset.condShowOn = option.show_on;
        if (option.selected) optionElement.setAttribute('selected', '');
        selectElement.appendChild(optionElement);
    }

    mainDiv.appendChild(selectElement);

    return (document.createElement('div').appendChild(mainDiv)).outerHTML;
}
function generateCheckboxType(options) {
    const { elementId, label, demographic, condChildOption, condOption, condValue, className, readonly, mode, elementType, fieldBuilder,
        actions, } = options;
    let output = '';
    let disabled = readonly ? 'disabled' : '';

    output = `<div class="${className}" data-label="${label}" data-demographic="${demographic}" data-cond-child-option="${condChildOption}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-type="checkbox" id="main${elementId}">${fieldBuilder}${actions}<br>`;
    output += `<div id="${elementId}">`;

    if (mode === 1) {
        output += generateDefaultCheckboxes(elementId);
    } else {
        for (const option of elementType.value) {
            const selected = option.selected ? 'checked' : '';

            output += `<div class="checkbox"><label><input type="checkbox" ${selected} ${readonly ? 'readonly' : ''} ${disabled} data-cond-show_on="${option.show_on}" value="${option.value}" id="${elementId}" name="${elementId}">${option.label}</label></div>`;
        }
    }

    output += '</div></div>';

    return output;
}

function generateDefaultCheckboxes(elementId, options = ['Option 1', 'Option 2', 'Option 3']) {
    let defaultCheckboxes = '';

    for (const option of options) {
        defaultCheckboxes += `<div class="checkbox"><label><input type="checkbox" value="${option}" id="check-1528713131180-preview-0" name="${elementId}">${option}</label></div>`;
    }

    return defaultCheckboxes;
}

function generateRadioType(options) {
    const {
        elementId,
        label,
        demographic,
        condChildOption,
        condOption,
        condValue,
        className,
        required,
        readonly,
        mode,
        elementType,
        fieldBuilder,
        actions,
    } = options;

    let output = '';

    output = `<div class="${className}" data-label="${label}" data-demographic="${demographic}" data-cond-child-option="${condChildOption}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-type="radio" id="main${elementId}">
            ${fieldBuilder}
            ${actions}
            <br>
                <div id="${elementId}">`;

    if (mode === 1) {
        elementType.value = [
            { value: 'Option 1', label: 'Option 1' },
            { value: 'Option 2', label: 'Option 2' },
            { value: 'Option 3', label: 'Option 3' },
        ];

    }
        for (let option of elementType.value) {
            let selected = option.selected ? 'checked' : '';
            output += `<div class="radio"><label><input ${required ? 'required' : ''} type="radio" ${selected} ${readonly ? 'readonly disabled' : ''} data-cond-show_on="${option.show_on}" value="${option.value}" name="${elementId}">${option.label}</label></div>`;
        }


    output += '</div></div>';

    return output;
}


function generateParagraphType(options) {
    const {
        elementId,
        label,
        condOption,
        condValue,
        className,
        fieldBuilder,
        actions,
    } = options;


    return `<div class="${className}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-label="${label}" data-type="paragraph" id="main${elementId}">${fieldBuilder}${actions}<br><br><br></div>`;
}
//.replace(/<(\/)?label/g, '<$1p>')
//.replace(/<(\/)?label/g, '<$1h3>')

function generateHeaderType(options) {
    const {
        elementId,
        label,
        condOption,
        condValue,
        className,
        fieldBuilder,
        actions,
    } = options;


    return `<div class="${className}" data-cond-option="${condOption}" data-cond-value="${condValue}" data-label="${label}" id="main${elementId}">${fieldBuilder}${actions}<br><br><br></div>`;
}
/**
 * Generate the HTML for a table element.
 * @param {Object} options - The options for the table element.
 * @param {string} options.elementId - The id of the table element.
 * @param {string} options.label - The label for the table element.
 * @param {string} options.condOption - The conditional option for the table element.
 * @param {string} options.condValue - The conditional value for the table element.
 * @param {boolean} options.autoFill - Whether the table should be auto-filled.
 * @param {string} options.className - The class name for the table element.
 * @param {Object} options.elementType - The type of the table element.
 * @param {string} fieldBuilder - The field label template.
 * @param {string} actions - The value to replace in the field label template.
 * @param {number} mode - The mode for creating the table.
 * @returns {string} The generated HTML for the table element.
 */
function generateTableType(options) {
        let {
            elementId,
            label,
            demographic,
            condChildOption,
            condOption,
            condValue,
            className,
            required,
            readonly,
            mode,
            elementType,
            fieldBuilder,
            actions,
        } = options;
    let output = `<div data-type="table" data-label="${label}" class="${className}" data-cond-option="${condOption}" data-cond-value="${condValue}" id="main${elementId}">`;
    output += fieldBuilder.replace(/repIIDD/g, elementId).replace(/fb-repType-Label/g, 'panel-body') + actions+'<br>';

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
    output += createTable({rows:elementType.rows.length, cols:elementType.columns.length, id:elementId, rowsData:elementType.rows, colsData:elementType.columns, values:elementType.values, tableType:elementType.tableType, elementType});

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
    table.className = 'table table-hover table-striped';
    table.id = options.id;
    table.dataset.tabletype = options.tableType;

    table.appendChild(createTableHead(options));
    for (let i = 1; i < options.rows; i++) {
        table.appendChild(createTableRow(options, i));
    }

    return (document.createElement('div').appendChild(table)).outerHTML;
   // return ;
}

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

function createTableRow(options, i) {
    const tr = document.createElement('tr');

    for (let j = 0; j < options.cols; j++) {
        tr.appendChild(createTableCell(options, i, j));
    }

    return tr;
}

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
 * Edits a specified HTML element based on the elementId and dataType provided, applying changes
 * to related elements and configurations if necessary.
 *
 * @function
 * @param {string} elementId - The ID of the target HTML element to edit.
 * @param {string} dataType - The type of the target HTML element (e.g., 'select', 'checkbox', 'radio', or 'table').
 */
function editElement(elementId, dataType) {
    let element = document.getElementById(elementId);
    let formattedElement = '';
    let mainElement = document.getElementById('main' + elementId);

    if (element) {
        formattedElement = mainElement.getAttribute("data-label");
        generateFieldEdit(elementId, dataType, formattedElement);
        element.remove();
        let conditionalOption = mainElement.getAttribute("data-cond-option");

        if (conditionalOption) {
            updateOption(elementId, conditionalOption);
        }

        // Replace with vanilla JavaScript implementation if sortable library is used
        // document.querySelector(".sortable-options").sortable();
        $( ".sortable-options" ).sortable();
        //todo create_tribute_values
        //createTributeValues();
    } else {
        var labelSpan = document.getElementById('label_span_' + elementId);
        if (labelSpan) {
            labelSpan.remove();
        }
        if (mainElement) {
            mainElement.insertAdjacentHTML('afterend', checkType(convertInputToJson(elementId)[0], 3));
            mainElement.remove();

        }
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

    const ele = $(fieldId);
    let output = '<li class="ui-sortable-handle">';

    if (fieldId.includes('#rl_')) {
        output += `<input type="text" class="option-label" value="${label}" name="select-optionRowName" placeholder="Label">
            <input type="text" class="option-label" value="${value}" name="select-optionRowValue" placeholder="Value/placeholder">
            <input type="text" class="option-label" value="" name="select-optionR_filter" placeholder="show On Filter">`;
    } else if (fieldId.includes('#cl_')) {
        output += `<input type="radio" class="option-selected" value="false" name="selected-option" placeholder="">
                    <input type="text" style="display:table-cell; width:60%"  class="option-label" value="${label}" name="select-optionC" placeholder="Label">`;
    } else {
        output += `<input type="radio" class="option-selected" value="false" name="selected-option" placeholder="">
            <input type="text" class="option-label" value="${label}" name="select-option" placeholder="Label">
            <input type="text" class="option-value" value="${value}" name="select-value" placeholder="value">
            <input type="text" class="option-filter" value="" name="select-filter" placeholder="show On Filter">`;
    }

    const listItem = $(output);
    const removeButton = $('<a class="remove btn" title="Remove Element">×</a>');
    removeButton.on('click', function() {
        listItem.remove();
    });

    listItem.append(removeButton);
    ele.append(listItem);
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
        const parentElement = $(`#div_${fieldId}`);
        const TrowDiv = parentElement.find(".Trow");
        const optionValueInputs = TrowDiv.find("input.option-value");
        const tableDropdownValuesDiv = parentElement.find(".table-dropdown-values");

        // Function to enable or disable elements based on the condition
        function toggleElements(elements, condition) {
            elements.prop("disabled", !condition);
            condition ? elements.show() : elements.hide();
        }

        // Function to create and add a new dropdown option
        function createDropdownOption() {
            const newFieldId = `dropdown-value-${fieldId}-${tableDropdownValuesDiv.children().length}`;
            const newOption = addOption(`Option ${tableDropdownValuesDiv.children().length + 1}`, `Option ${tableDropdownValuesDiv.children().length + 1}`, newFieldId);
            tableDropdownValuesDiv.append(newOption);
        }

        if (tableType === "Text" || tableType === "Text Area" || tableType === "Number") {
            toggleElements(optionValueInputs, false);
            toggleElements(tableDropdownValuesDiv, false);
        } else if (tableType === "Radio" || tableType === "Checkbox") {
            toggleElements(optionValueInputs, true);
            toggleElements(tableDropdownValuesDiv, false);
        } else if (tableType === "Dropdown") {
            toggleElements(optionValueInputs, false);
            tableDropdownValuesDiv.empty();
            const dropdownLabel = $("<label>").text("Dropdown Values:");
            tableDropdownValuesDiv.append(dropdownLabel);

            // Create and add initial 3 dropdown options
            for (let i = 0; i < 3; i++) {
                createDropdownOption();
            }

            // Add the "add-opt" button for adding more dropdown options
            const addButton = $('<a class="add add-opt btn btn-default pull-right" id="add-dropdown-value">Add Dropdown Value +</a>');
            addButton.on('click', createDropdownOption);
            tableDropdownValuesDiv.append(addButton);

            toggleElements(tableDropdownValuesDiv, true);
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
    const mainElement = $(`#main${fieldId}`);
    const fieldClass = mainElement.attr('class').trim();
    const labelText = mainElement.attr("data-label");
    const hide = mainElement.attr("data-hide");
    const demographic = mainElement.attr("data-demographic");

    let fieldEdit = `<div id="div_${fieldId}" class="edit_template"></div>`;

    // Append the fieldEdit to the mainElement
    mainElement.append(fieldEdit);



    // Generate additional field edit HTML based on the field type
    let fieldContent = `
        <br><label class="pull-left">Label</label>
        <textarea name="label" data-elementType="${fieldType}" data-id="${fieldId}" placeholder="Label" class="fld-label form-control tribute">${labelText}</textarea><br>
        <br><label class="pull-left">Class (Separate multiple classes by space)</label>
        <input name="class" type="text" data-elementType="${fieldType}" data-id="${fieldId}" value="${fieldClass}" placeholder="class" class="fld-label form-control"><br>
        <label class="pull-left">Hide from Client Chart: </label>
        <input name="hide" type="checkbox" data-elementType="${fieldType}" data-id="${fieldId}" ${hide} class="checkbox"><br>
        <label class="pull-left">Demograhpic Variable: </label>
        <input name="demographic" value="Checked" type="checkbox" data-elementType="${fieldType}" data-id="${fieldId}" ${demographic} class="checkbox"><br>
        <div id="logic_${fieldId}" class="edit_template">
            <br><label class="pull-left">Display Logic</label>
            <select name="form_logic" class="fld-label form-control">
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
    const divFieldId = $(`#div_${fieldId}`);
    divFieldId.html(fieldContent);

    // Attach event listeners using event delegation
    divFieldId.on('keyup', 'textarea[name="label"]', function() {
        updateLabelSpan(fieldId, $(this).val());
    });

    divFieldId.on('change', 'select[name="form_logic"]', function() {
        updateOption(fieldId, $(this).val());
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
 * @param {jQuery} mainElement - The main element for the field.
 * @returns {string} The HTML string for text input fields.
 */
function generateTextInput(fieldId, fieldType, mainElement) {
    const placeholder = mainElement.attr("data-placeholder");
    const required = mainElement.children('input').attr('required');
    const defaultValue = mainElement.attr("data-value");
    const checked = required ? 'Checked' : '';

    let textInputHtml = `
    <label>Required</label> &nbsp; &nbsp;
    <input type="checkbox" class="fld-required" name="required" value="required" ${checked}><br>
    <label>Placeholder</label>
    <textarea name="placeholder" class="form-control tribute">${placeholder}</textarea><br>
    <label>Default Value</label>
    <textarea name="default_value" class="form-control tribute">${defaultValue}</textarea><br>
  `;

    if (fieldType === 'number' || fieldType === 'range') {
        const max = mainElement.children('input').attr('max');
        const min = mainElement.children('input').attr('min');
        const step = mainElement.children('input').attr('step');

        textInputHtml += `
      <div class="form-group min-wrap">
        <label for="min-frmb-1610598484374-fld-4">Min</label>
        <div class="input-wrap">
          <input type="number" value="${min}" name="fld_min" class="fld-min form-control form-control" id="min-frmb-1610598484374-fld-4">
        </div>
      </div>
      <div class="form-group max-wrap">
        <label for="max-frmb-1610598484374-fld-4">Max</label>
        <div class="input-wrap">
          <input type="number" value="${max}" name="fld_max" class="fld-max form-control form-control" id="max-frmb-1610598484374-fld-4">
        </div>
      </div>
      <div class="form-group step-wrap">
        <label for="step-frmb-1610598484374-fld-4">Step</label>
        <div class="input-wrap">
          <input type="number" value="${step}" name="fld_step" class="fld-step form-control form-control" id="step-frmb-1610598484374-fld-4">
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
 * @param {object} mainElement - The main jQuery element for the field.
 * @returns {string} The HTML string for the select input field.
 */
function generateSelectInput(fieldId, fieldType, mainElement) {
    // Declare and initialize variables
    const fieldClass = mainElement.attr('class');
    const isChecked = fieldClass.includes('inline') ? 'checked' : '';

    // Replace this with the actual options HTML string
    const {
        optionValues,
        outOptionsRows,
        outOptionsColumns
    } = editForOptions(fieldId, fieldType);



    return `
    ${fieldType === 'checkbox' || fieldType === 'radio' ? `
      <label class="">Inline</label>  &nbsp; &nbsp;
      <input ${isChecked} type="checkbox" class="fld-required" name="fld_inline" value="inline"  onclick="inliner(this,'${fieldId}');">
      <br>` : ''}
    <label class="">Scorable</label>  &nbsp; &nbsp;
    <input type="checkbox" class="fld-required" min="1" name="fld_score" value="1">
    <br>
    <div class="form-group field-options">
      <label class="false-label">Options <button  id="optionsCSV-${fieldId}" class="btn btn-default"> Upload through CSV</button></label>
      <div class="sortable-options-wrap">
        <ol class="sortable-options ui-sortable" id="ol_${fieldId}">
          ${outOptionsRows}
        </ol>
        <div class="option-actions">
          <a class="add add-opt btn btn-default pull-right" id="add-opt-${fieldId}">Add Option +</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates an HTML string for table input fields.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit.
 * @param {jQuery} mainElement - The jQuery object for the main element.
 * @returns {string} The HTML string for the table input fields.
 */
function generateTableInput(fieldId, fieldType, mainElement) {
    const tableTypeLabel = mainElement.children('table').attr("data-tabletype");
    const tableRow = ""; // Replace with the code to generate table rows
    const tableCol = ""; // Replace with the code to generate table columns

    // Replace this with the actual options HTML string
    const {
        optionValues,
        outOptionsRows,
        outOptionsColumns
    } = editForOptions(fieldId, fieldType);

    return `
    <div class="row">
      <div class="col-sm-4"><label>Type of Table:</label></div>
      <div class="col-sm-8">
        <select name="table_type" id="tableType_${fieldId}" class="form-control">
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
    <label class="pull-left">Scorable</label>  &nbsp; &nbsp;
    <input type="checkbox" class="fld-required" min="1" name="fld_score" value="1"><br>
    <br>
    <div class="form-group field-options">
      <label class="false-label">Options:</label>
      <div class="sortable-options-wrap">
        <label class="false-label">Rows &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</label>
        <div class="Trow">
          <ol class="sortable-options ui-sortable" id="rl_${fieldId}">
            ${outOptionsRows}
          </ol>
        </div>
        <div class="option-actions">
          <a class="add add-opt btn btn-default pull-right" id="add-row-${fieldId}">Add Row Option +</a>
        </div>
        <br>
        <div class="table-dropdown-values">
        
        </div>
        <label class="false-label">Columns &nbsp; &nbsp;</label>
        <div class="Tcol">
          <ol class="sortable-options ui-sortable" id="cl_${fieldId}">
            ${outOptionsColumns}
          </ol>
        </div>
        <div class="option-actions">
          <a class="add add-opt btn btn-default pull-right" id="add-col-${fieldId}">Add Column Option +</a>
        </div>
      </div>
    </div>
  `;

}

/**
 * Generates an HTML string for editing a payment form field.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit (should be 'payment').
 * @param {jQuery} mainElement - The main element of the field in the form.
 * @returns {string} The HTML string for the payment field edit form.
 */
function generatePaymentInput(fieldId, fieldType, mainElement) {
    // Generate the HTML string for payment input fields
    return `
    <label>Product</label>
    <select name="product_logic" class="fld-label form-control">
      ${productOptions()}
    </select>
  `;
}


/**
 * Generates an HTML string for editing data list input fields.
 * @param {string} fieldId - The ID of the field to edit.
 * @param {string} fieldType - The type of the field to edit.
 * @param {jQuery} mainElement - The main element of the field to edit.
 * @returns {string} The HTML string for the data list edit form.
 */
function generateDataListInput(fieldId, fieldType, mainElement) {
    const dataListUrl = mainElement.attr('data-url') || '';

    return `
    <div id="data_list_${fieldId}" class="edit_template">
      <label>URL</label>
      <input type="url" name="data_list_url" class="form-control" value="${dataListUrl}" placeholder="https://example.com" pattern="https://.*" required>
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
    <button onclick="generate_div('${fieldId}')" id="generate-divs-${fieldId}" class="btn btn-primary generate_div">Generate Divs</button>
    <br><br>
    <div class="someclass">
        <div class="row" id="generated-divs-${fieldId}"></div>
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
    let columns = [{name: 'option 1'}];
    let label, fieldType, fieldName, tableType, className, defaultValue;
    let placeholder, required , demographic;
    let scorable, max, min, condOption, condValue, product, price,selectedOption;

    $(`#div_${jsonDivId} :input`).each(function () {
        const input = $(this);
        const inputName = input.attr('name');
        const inputValue = input.val();

        switch (inputName) {
            case "label":
                label = inputValue;
                fieldType = input.attr("data-elementType");
                fieldName = input.attr("data-id");
                break;
            case "placeholder":
                placeholder = inputValue;
                break;
            case "select-option":
                const isSelected = input.prev().is(':checked');
                const optionValue = input.next().val();
                const show_on = input.next().next().val();
                var parentTrow = input.closest('.Trow');
                var parentTcol = input.closest('.Tcol');

                if (parentTrow.length > 0) {
                    rows.push({ "name": inputValue, "selected": isSelected, "value": optionValue,"show_on":show_on});
                } else if (parentTcol.length > 0) {
                    columns.push({ "name": inputValue});
                }else{
                    values.push({ "label": inputValue, "selected": isSelected, "value": optionValue,"show_on":show_on});
                }

                selectedOption = 1;
                break;
            case "select-optionR":
                const optionValueR = input.next().val();
                const show_onR = input.next().next().val();
                rows.push({ "name": inputValue , "value": optionValueR ,"show_on":show_onR});
                break;
            case "select-optionC":
                columns.push({ "name": inputValue});
                break;
            case "fld_score":
                scorable = inputValue;
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
                if (input.is(':checked')) {
                    required = inputValue;
                }
                break;
            case "demographic":
                if (input.is(':checked')) {
                    demographic = inputValue;
                }
                break;
            case "form_logic":
                condOption = inputValue;
                break;
            case "logic_option":
                condValue = inputValue;
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
        "cond_option": condOption,
        "cond_value": condValue,
        "scorable": scorable,
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
    var message = "Do you really want to clear fields? \n" +
        "You would lose unsaved changes.";

    if (confirm(message)) {
        $("#" + formId).formilize();
    }
}

/**
 * Save form data to a cookie and send it to the server.
 * @param {function} generateFormJson - Function that generates a JSON object from form data.
 * @param {function} saveToCookie - Function that saves form data to a cookie.
 * @param {function} sendToServer - Function that sends form data to the server.
 */
function saveFormData(generateFormJson, saveToCookie, sendToServer) {
    try {
        const formData = generateFormJson();
        saveToCookie(formData, () => {
            sendToServer(formData)
                .then(() => {
                    console.log('Form data saved to cookie and sent to the server successfully.');
                })
                .catch((error) => {
                    console.error('Error sending form data to the server:', error);
                });
        });
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

/**
 * Deletes a form element with the given ID suffix.
 * @param {string} idSuffix - The suffix of the element's ID.
 */
function deleteFormElement(idSuffix) {
    if (confirm('Do you really want to delete this element')) {
        $('#main' + idSuffix).remove();
    }
}
/**
 * Copies an element and generates a new one with a unique ID.
 *
 * @param {string} elementId - The ID of the element to be copied.
 * @return {void}
 */
function copyElement(elementId) {
    const element = document.getElementById(elementId);
    let formData;

    if (element) {
        formData = generateFormJson(`#main${elementId}`).formElements[0];
    } else {
        formData = convertInputToJson(elementId)[0];
    }

    const uniqueCounter =  Math.floor(Math.random() * (1e13 - 1e12) + 1e12);
    formData.name = `v${uniqueCounter}`;

    const newElement = checkType(formData, 3);
    element.parentElement.insertAdjacentHTML('afterend', newElement);
}

/**
 * Generates a JSON object containing form data and settings.
 * @param {string} formId - The ID of the form to generate the JSON for.
 * @returns {Object} - The generated JSON object containing form data and settings.
 */
function generateFormJson(formId = '') {
    const json = [];
    document.querySelectorAll('.main-form' + formId).forEach((element) => {
        let optionValues = [];
        let label = '';
        let className = '';
        let defaultValue = '';
        let condValue = element.dataset.condValue;
        let condOption = element.dataset.condOption;
        let autoFill = element.dataset.autoFill;
        let placeholder = '';
        let required = '';
        let demographic = '';
        let values = '';
        let rows = [];
        let columns = [];
        let tableType = '';
        let price = '';
        let product = '';
        let min = '';
        let max = '';

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
                placeholder = element.attr("data-placeholder");
                required = element.children('input').attr('required');
                demographic = element.children('input').attr('demographic');
                if ((tag === 'number')) {
                    min = element.children('input').attr('min');
                    max = element.children('input').attr('max');
                    table_type = element.children('input').attr('step');
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
            condOption: condOption,
            condValue: condValue,
            autoFill: autoFill,
            scorable: '',
            product: product,
            price: price,
        });
    });

    const forms = {};
    const settings = [];

    try{
        settings.push(
            {
                formNames: document.getElementById('form_names').value,
            },
            {
                formUpload: document.getElementById('form_upload').checked
                    ? document.getElementById('form_upload').value
                    : '0',
            },
            {
                formQc: document.getElementById('page_number').value,
            },
        );
    }catch (e) {
        
    }
    

    forms.formSettings = settings;
    forms.formElements = json;

    return forms;
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
 * Pushes form data to the server.
 * @param {Object} forms - The form data to be pushed to the server.
 */
function pushToServer(forms) {
    // Assuming 'r' is a defined variable or should be replaced with the correct variable.
    var pageCookie = getCookie(r + "_page");
    var sel_question = 0;

    if (pageCookie) {
        sel_question = pageCookie;
    }

    // Use template literals for better readability
    ajaxCall(`/admin/formsCon.php?new_form&question=${sel_question}&group=0&nom=0`, JSON.stringify(forms));

    // Remove the space after 'Success!'
    showAlert('Success!', 'Form has been saved');
}

/**
 * Stores the serialized form data in a cookie and triggers a callback function.
 *
 * @param {Object[]} formElements - The array of form elements to be stored in the cookie.
 * @param {Function} callback - The callback function to be executed after storing the data in the cookie.
 * @returns {void}
 */
function pushToCookie(formElements, callback) {
    try {
        // Change this line if you want to use another method for setting cookies
        // For example, you can use the 'js-cookie' library
        document.cookie = `form=${btoa(JSON.stringify(formElements))}`;

        callback(formElements);
    } catch (error) {
        console.error("Error storing form data in the cookie: ", error);
    }
}
    function editForOptions(id, tag) {
        const optionValues = {
            rows: [],
            columns: []
        };
        const element = $(`#${id}`);
        let tableType = '';

        if (tag === 'select') {
            element.children('option').each(function() {
                if (!$(this).prop('disabled')) {
                    const selected = $(this).is(':selected');
                    optionValues.rows.push({
                        label: $(this).text(),
                        selected: selected,
                        show_on: $(this).attr('data-cond-show_on'),
                        value: $(this).val()
                    });
                }
            });
        } else if (tag === 'checkbox' || tag === 'radio') {
            element.find('input').each(function() {
                const selected = $(this).is(':checked');
                optionValues.rows.push({
                    label: $(this).parent().text(),
                    selected: selected,
                    show_on: $(this).attr('data-cond-show_on'),
                    value: $(this).val()
                });
            });
        } else if (tag === 'table') {
            tableType = element.attr("data-tabletype");
            element.find('tr').each(function(rowIndex) {
                $(this).find('td, th').each(function(colIndex) {
                    const cell = $(this);
                    if (rowIndex === 0 && colIndex !== 0) {
                        optionValues.columns.push({
                            label: cell.text()
                        });
                    } else if (colIndex === 0 && rowIndex !== 0) {
                        optionValues.rows.push({
                            label: cell.text(),
                            value: cell.attr( 'data-value' )
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
                  <li class="ui-sortable-handle">
                    <input type="radio" class="selected-option" value="false" name="selected-option" ${checked}>
                  
                    <input type="text" class="option-label" value="${option.label}" name="select-option" placeholder="Label">
                    ${!isColumn ? `
                    <input type="text" class="option-value" value="${option.value}" name="select-value" placeholder="Value" ${disableOptionValue} ${hideOptionValue}>
                    <input class="option-filter" list="filter-list-${id}" value="${showOn}" name="select-filter" id="filter-${id}" placeholder="show On Filter">
                        <datalist id="filter-list-${id}">
                        ${filterDatalist}
                        </datalist>` : ''}
                    <!-- Additional HTML elements can be added here -->
                    <a onclick="$(this).parent().remove();" class="remove btn" title="Remove Element">×</a>
                  </li>`;
            }).join('');
        };

        const outOptionsRows = generateOptions(optionValues.rows, false);
        const outOptionsColumns = generateOptions(optionValues.columns,true);

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
    const mainElement = $('#main' + fieldId);
    const condOption = mainElement.attr("data-cond-option");
    let isSelected = 'selected';
    if (condOption) {
        isSelected = '';
    }
    let optionsHtml = '<option value="" ' + isSelected + '>No Logic</option>';
    $('.main-form').each(function () {
        const dataType = $(this).attr('data-type');
        if (dataType === 'select' || dataType === 'radio' || dataType === 'checkbox') {
            const id = $(this).children('label').attr('for');
            isSelected = '';
            if (id === condOption) {
                isSelected = 'selected';
            }
            if (id !== fieldId) {
                optionsHtml += '<option ' + isSelected + ' value="' + id + '">' + $('#field_' + id).text() + '</option>';
            }
        }
    });
    return optionsHtml;
}

    /**
     * Update the option based on the element ID and conditional option.
     * @param {string} elementId - The element ID to update the option for.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     */
    function updateFilterOption(elementId) {
        let optionValues = [];

        $('.main-form').each(function () {
            const currentElement = $(this);
            const tag = currentElement.attr('data-type');
            const currentElementID = currentElement.attr('id').replace('main','');
            if(currentElementID === elementId){
                return;
            }
            const labelText = $('#label_span_'+currentElementID).html()

            if (tag === 'select') {
                currentElement.find('option').each(function() {
                    if ($(this).prop('disabled') !== true) {
                        optionValues.push({"label": `${labelText} - ${$(this).text()}`, "value":`${currentElementID} - ${$(this).val()}`});
                    }

                });
            } else if (tag === 'checkbox' || tag === 'radio') {
                currentElement.find('input').each(function() {
                    optionValues.push({"label":`${labelText} - ${$(this).parent().text()}`,"value":`${currentElementID} - ${$(this).val()}`});
                });
            }
        });
        return optionValues.map(option => {
            return `
            <option value="${option.value}">${option.label}</option>`;
        }).join('');

    }

    /**
     * Update the option based on the element ID and conditional option.
     * @param {string} elementId - The element ID to update the option for.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     */
    function updateOption(elementId, conditionalOption) {
        let optionsCond = '';
        const mainElement = $('#main' + elementId);
        const condValue = mainElement.attr("data-cond-value");
        const logicOption = $('#logic_option');

        $('.main-form').each(function () {
            const currentElement = $(this);
            const tag = currentElement.attr('data-type');

            if (tag === 'select') {
                optionsCond = handleSelect(optionsCond, currentElement, conditionalOption, condValue);
            } else if (tag === 'checkbox' || tag === 'radio') {
                optionsCond = handleCheckboxRadio(optionsCond, currentElement, conditionalOption, condValue);
            }
        });

        const myClassInput = $(`[data-id="${elementId}"][name="class"]`);
        let myClassInputValue = myClassInput.val();
        const hasConditionalClass = myClassInput.hasClass('conditional');
        const hasInverseConditionalClass = myClassInput.hasClass('con_inverse_ditional');
        let checkInverse = '';

        if (conditionalOption === '') {
            if (hasConditionalClass) {
                myClassInput.removeClass('conditional');
            }
            if (hasInverseConditionalClass) {
                myClassInput.removeClass('con_inverse_ditional');
            }
        } else {
            if (!hasConditionalClass && !hasInverseConditionalClass) {
                myClassInput.addClass('conditional');
            }
            if (hasInverseConditionalClass) {
                checkInverse = 'checked';
            }
        }

        logicOption.html(`
        <select class="form-control" name="logic_option">${optionsCond}</select>
        <br>
        <input type="checkbox" ${checkInverse} id="sss"> Inverse
        <br>
    `);
    }

    /**
     * Handle select elements.
     * @param {string} optionsCond - The current options string.
     * @param {object} currentElement - The current jQuery element.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     * @param {string} condValue - The conditional value from the main element.
     * @returns {string} - The updated options string.
     */
    function handleSelect(optionsCond, currentElement, conditionalOption, condValue) {
        const id = currentElement.children('select').attr('id');

        if (id === conditionalOption) {
            currentElement.children('option').each(function () {
                const optionElement = $(this);
                const selected = condValue === optionElement.val() ? 'selected' : '';
                optionsCond += `<option ${selected} value="${optionElement.val()}">${optionElement.text()}</option>`;
            });
        }

        return optionsCond;
    }

    /**
     * Handle checkbox and radio elements.
     * @param {string} optionsCond - The current options string.
     * @param {object} currentElement - The current jQuery element.
     * @param {string} conditionalOption - The conditional option to use for updating the option.
     * @param {string} condValue - The conditional value from the main element.
     * @returns {string} - The updated options string.
     */
    function handleCheckboxRadio(optionsCond, currentElement, conditionalOption, condValue) {
        const id = currentElement.children('label').attr('for');

        if (id === conditionalOption) {
            currentElement.find('input').each(function () {
                const inputElement = $(this);
                const selected = condValue === inputElement.val() ? 'selected' : '';
                optionsCond += `<option ${selected} value="${inputElement.val()}">${inputElement.parent().text()}</option>`;
            });
        }

        return optionsCond;
    }
/**
 * Generates an HTML string for the product options in a payment field.
 * @returns {string} The HTML string for the product options.
 */
function productOptions(){
    s='';
    for(var val in products) {
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
    const myClassInput = $('[data-id="' + fieldId + '"][name="class"]');
    const myClassInputValue = myClassInput.val();
    const flag = myClassInputValue.includes('inline');

    if (!inlineCheckbox.checked) {
        if (flag) {
            myClassInput.val(myClassInputValue.replace('inline', '').trim());
        }
    } else {
        if (!flag) {
            myClassInput.val(myClassInputValue.trim() + ' inline');
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
 * Clears the name, page number, and upload fields in the form.
 */
function clearNamePageUpload() {
    // Assuming the trans() function is defined somewhere else in your code.
    // If it is not, remove the line below.
    trans(0, 0, 0);

    // Replacing jQuery with vanilla JavaScript
    document.getElementById('form_names').value = '';
    document.getElementById('page_number').value = '';
    document.getElementById('form_upload').checked = false;
}

/**
 * Checks if the given URL string is valid.
 * @param {string} url - The URL string to be checked.
 * @return {boolean} - Returns true if the URL is valid, false otherwise.
 */
function validURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.,~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);
}

    /**
     * Fetches image assets and displays them in a modal.
     */
    function imageAsset() {
        const headers = {};
        if (jwt) {
            headers.Authorization = 'Basic ' + jwt;
        }

        $.ajax({
            url: 'https://api.datumforms.com/assets/pull?images=true',
            async: true,
            type: 'GET',
            cache: true,
            headers: headers,
            crossDomain: true,
            success: imageAssetonSuccess,
        });

        $('#enlargeProfile').modal('show');
    }

    /**
     * Success callback for the imageAsset function.
     * @param {Object} data - The data returned from the API.
     */
    function imageAssetonSuccess(data) {
        let assetGallery = `
    <div class="form-group">
      <label for="name" class="col-sm-2">Logo (64x64)</label>
      <div class="col-sm-10">
        <link href="/assets/css/uploadfile.css" rel="stylesheet">
        <div id="fileuploader">Upload</div>
      </div>
    </div>
  `;

        if (data.files.length > 0) {
            assetGallery += '<div class="row">';

            for (const file of data.files) {
                assetGallery += `
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
          <div class="fix">
            <img src="${file.path}">
            <button id="close_image">
              X
            </button>
            <div class="desc">
              <p class="desc_content">${file.name}</p>
            </div>
          </div>
        </div>
      `;
            }

            assetGallery += '</div>';
        }

        $('#enlargeProfilecontent').empty().append(assetGallery);
    }

    /**
     * Builds a datalist element and sets its inner HTML based on the provided data.
     *
     * @param {string} id - The ID of the datalist element.
     * @param {Object} elementOptionsAjax - The data used to populate the datalist.
     * @param {string} url - The URL containing the order of the properties.
     */
    function buildDatalist(id, elementOptionsAjax, url) {
        let tempType = '';

        const datalistElement = document.getElementById(`${id}_list`);
        if (datalistElement) {
            // Get the order of the properties from the URL
            const order = url.match(/column=([^&]+)/)[1].split(",");
            for (const x in elementOptionsAjax[id]) {
                let additionalValue = '';
                if (Object.keys(elementOptionsAjax[id][x]).length > 2) {
                    for (let y = 2, len = Object.keys(elementOptionsAjax[id][x]).length; y < len; y++) {
                        additionalValue += ` data-value_${y}="${elementOptionsAjax[id][x][order[y]]}"`;
                    }
                }

                tempType += `<option ${additionalValue} data-value="${elementOptionsAjax[id][x][order[0]]}" value="${elementOptionsAjax[id][x][order[1]]}">${elementOptionsAjax[id][x][order[1]]}</option>`;
            }
            if (tempType.length !== 0) {
                datalistElement.innerHTML = tempType;
            }
            return;
        }

        // The element is not in the DOM, so we need to retry
        setTimeout(() => {
            buildDatalist(id, elementOptionsAjax, url);
        }, 1000); // retry after 1 second
    }

    /**
     * Generates a new div with specified attributes and appends it to the parent container.
     * @param {string} id - The id of the parent container.
     */
    function generateDiv(id) {
        const parentContainer = document.getElementById('generated-divs-' + id);
        let count = parentContainer.querySelectorAll('.col-md-6').length || 0;
        parentContainer.innerHTML += `
        <div id="generated-divlet-${count}" class="col-md-6 col-lg-6 col-sm-6">
            <div class="btn-group" role="group" aria-label="...">
                <input class="btn-group form-control attribute-name-input" placeholder="Attribute Name" type="text">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="attribute-type">Attribute Type:</span>
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="#" data-value="text">Text</a></li>
                        <li><a href="#" data-value="price">Price</a></li>
                        <li><a href="#" data-value="image">Image</a></li>
                    </ul>
                </div>
                <button class="delete-input btn btn-danger btn-group">&times;</button>
            </div>
            <br><br>
            <div class="input-container"></div>
            <br>
            <div><button class="delete-input btn btn-success">+</button></div>
            <br><br>
        </div>`;

        const container = parentContainer.querySelector('#generated-divlet-' + count);

        $(parentContainer).on('click', '.dropdown-menu a', function () {
            const selected = $(this).data('value');
            container.querySelector('.attribute-type').innerHTML = selected;

            const inputContainer = container.querySelector('.input-container');
            let newInnerHtml;

            if (selected === 'text') {
                newInnerHtml = '<input type="text" class="form-control btn-group attribute-input" />';
            } else if (selected === 'price') {
                newInnerHtml = '<input type="number" class="form-control btn-group attribute-input" />';
            } else if (selected === 'image') {
                newInnerHtml = `
                <input type="text" list="images-${id}" class="form-control btn-group attribute-input" />
                <datalist id="images-${id}">
                    <option value="image1.jpg">
                    <option value="image2.jpg">
                    <option value="image3.jpg">
                </datalist>`;
            }
            inputContainer.innerHTML = `<div class="btn-group" role="group">${newInnerHtml}<button class="delete-input btn btn-danger btn-group">&times;</button></div>`;
        });

        $(parentContainer).on('click', '.delete-input', function () {
            container.remove();
        });
    }
    /**
     * Show a modal with a form to input questionnaire ideas.
     */
    function showQuestionnairePrompt() {
        const content = `
    <label>Input your questionnaire ideas below:</label>
    <textarea required class="form-control" id="prompt_textarea" placeholder="Input your prompt here">Generate a simple questionnaire to evaluate a presenter after a presentation</textarea>
    <br>
    <button id="prompt_button" class="form-control btn-success btn bottom">Generate Questionnaire</button>
  `;

        $('#enlargeProfilecontent').empty().append(content);
        $('#prompt_button').on('click', sendPrompt);
        $('#enlargeProfile').modal('show');
    }

    /**
     * Function to be called when the Generate Questionnaire button is clicked.
     */
    function sendPrompt() {
        $("#prompt_button").button('loading');
        var prompt = $('#prompt_textarea').val()
        var headers = {};
        if (jwt) {
            headers.Authorization = 'Basic '+jwt;
        }
        var myObj = {};
        myObj.prompt = prompt;
        $.ajax({
            url: '/admin/formsCon.php?ai_prompt=true',
            type: "POST",
            headers: headers,
            crossDomain: true,
            data: myObj,
            dataType: 'json',
            success: function (result, textStatus, request) {
                $(".connected").rendelize(JSON.parse(result.main_form),3);
                $('#enlargeProfile').modal('hide');
            }
        })
    }


})();
