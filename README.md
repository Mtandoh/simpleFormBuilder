# Drag & Drop Form Builder Library

A simple, extensible JavaScript library for building HTML forms using drag and drop functionality. This library allows you to easily create customizable forms, and even supports adding your own buttons and functionality.

## Features

- Drag and drop form elements
- Customizable buttons and event handlers
- Easy integration with your existing project
- Supports rendering initial form data

## Usage

To use the Drag & Drop Form Builder Library, follow these steps:

1. Include the library in your project.

2. Create an options object with the desired configuration for your form builder. This can include custom buttons, event handlers, initial form data, and more.

3. Call the `attachToElement` function with your options object.

Here's an example:

```javascript
const myOptions = {
    initialFormData: [], // Your initial form data (optional)
    mode: 1, // 1 for formBuilder, else defaults to renderForm (optional)
    buttons: [
        // Your custom buttons (optional)
        {
            id: 'myCustomButton',
            className: 'btn-default',
            text: 'My Custom Button',
        },
    ],
    eventHandlers: {
        // Your custom event handlers (optional)
        myCustomButton: function () {
            console.log('My Custom Button clicked');
        },
    },
    formElement: '#form-container', // The DOM element to attach the form builder to
    saveFormAction: 'callback', // The callback to send the form data to (optional)
};

// Attach the form builder to the specified element with your options
formBuilderLibrary.attachToElement(myOptions);
```

## API

### `attachToElement(options)`

Attaches the form builder or render form function to the given element.

**Parameters:**

- `options` - An object containing the following properties:
  - `initialFormData` - An array with the initial form data (optional)
  - `mode` - A number representing the mode, 1 for formBuilder and 0 for renderForm (optional)
  - `buttons` - An array of custom button objects (optional)
  - `eventHandlers` - An object with custom event handlers (optional)
  - `formElement` - A string with the selector for the DOM element to attach the form builder to
  - `saveFormAction` - A string with the callback to send the form data to (optional)

## Customization

The Drag & Drop Form Builder Library offers extensive customization options, including custom buttons and event handlers. To add your own buttons and functionality, simply include them in the `buttons` and `eventHandlers` properties of the options object when calling `attachToElement`.

**Demo**

[https://mtandoh.github.io/simpleFormBuilder/](https://mtandoh.github.io/simpleFormBuilder/)

[![Image description](https://github.com/Mtandoh/simpleFormBuilder/blob/master/screenshot.JPG)](https://mtandoh.github.io/simpleFormBuilder/)

