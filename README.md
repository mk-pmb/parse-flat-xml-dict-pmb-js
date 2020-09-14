
<!--#echo json="package.json" key="name" underline="=" -->
parse-flat-xml-dict-pmb
=======================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Parse an XML fragment that contains only a very trivial key-value structure.
<!--/#echo -->



API
---

This module exports one function:

### readDict(xmlFrag[, opt])

Given an XML fragment `xmlFrag` of suitable structure, return a
dictionary object mapping elements' names to their text content.

A suitable fragment must consist of only whitespace and/or simple elements.
Simple elements have just a name and optional text content.
This means they can not have: a namespace, attributes, child elements.

`opts` is an optional options object that supports these keys:

* `combineTexts`: A function that merges non-first occurrences of an
  element name. It will be called with arguments
  `(oldValue, newText, key, dict)`
  and is expected to return the combined new value.
  If false-y (default), an error is thrown on encounter of a duplicate key.



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
