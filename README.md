# How to generate technical document

## JSDoc Documentation

This is some example code to show you how to use JSDoc for documenting your JavaScript.

Please following the below steps.

**Step 1** 

#JSDoc supports stable versions of Node.js 8.15.0 and later.
https://nodejs.org/en/download/

**Step 2**

#To initiate package json visual studio code terminal  
npm init -y

**Step 3** 

#update the code script section in package.json

  "scripts": {
    "doc": "jsdoc -c jsdoc.json"
  },

**Step 3**

#To install the latest version on npm  
npm i -D jsdoc

**Step 4**

#To Create jsdoc.json file in root and update the code

    {
    "source": {
      "include": ["js"],
      "includePattern": ".js$",
      "excludePattern": "(node_modules|docs|thirdparty|helper)"
    },
    "plugins": ["plugins/markdown"],
    "templates": {
      "cleverLinks": true,
      "monospaceLinks": true
    },
    "opts": {
      "recurse": true,
      "destination": "./docs/",
      "tutorials": "./readme"
    }
    }
  

**Step 5**

#Run the jsdoc command in visual studio code terminal  
npm run doc

*The JSDoc has created docs and other dependency file generated and customize your documentation.

