// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import xmldecode from 'xmldecode';

const elemTagRx = /\s*<(\/?)([A-Za-z0-9_\-]+)>\s*/;
const quot = JSON.stringify;

const dbg = Boolean;
// const dbg = console.debug;

const EX = function parseFlatXmlDict(xml, opt) {
  if (!opt) { return EX(xml, true); }
  const dict = {};
  let charsParsed = 0;
  let remain = xml;
  let found = false;
  let key = null;

  function eat(rx) {
    const m = (rx.exec(remain) || false);
    found = m;
    if (!m) { return dbg({ noMatch: remain }) && m; }
    delete m.input;
    m.at = charsParsed;
    m.pre = remain.slice(0, m.index);
    const n = m.index + m[0].length;
    charsParsed += n;
    remain = remain.slice(n);
    m.slash = m[1];
    m.tagName = m[2];
    dbg(m);
    return m;
  }

  function unexp(what) {
    const em = `Unexpected ${what} ${quot(found.tagName)} at position ${
      found.at || charsParsed} while reading key ${quot(key)}`;
    throw new Error(em);
  }

  function learn() {
    let text = xmldecode(found.pre);
    const had = getOwn(dict, key);
    if (had !== undefined) {
      text = (opt.combineTexts || unexp('duplicate key name'))(had, text);
    }
    dbg({ learn: key, text });
    dict[key] = text;
  }

  while (eat(elemTagRx)) {
    if (found.slash) {
      if (!key) { unexp('closing tag'); }
      learn();
      key = null;
    } else {
      if (found.pre.trim()) { unexp('printable character'); }
      if (key) { unexp('opening tag'); }
      key = found.tagName;
      dbg({ key });
    }
  }
  if (remain.trim()) { unexp('trailing printable character in front of tag'); }
  return dict;
};




export default EX;
