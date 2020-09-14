// -*- coding: utf-8, tab-width: 2 -*-

import eq from 'equal-pmb';

import xd from '..';

const msg = `How are you?
    Did you have a nice day?
    I guess you might be hungry.`;

const xmlFrag = `
  <pizza>Tonno</pizza>
  <salad>Cesar</salad>
  <note>${msg}</note>
  <self-close />
  <foo>&quot;&amp;&#39;&lt;&gt;</foo>
  `;
eq(xd(xmlFrag), {
  pizza: 'Tonno',
  salad: 'Cesar',
  note: msg,
  'self-close': '',
  foo: `"&'<>`,
});














console.info('+OK basics test passed.');
