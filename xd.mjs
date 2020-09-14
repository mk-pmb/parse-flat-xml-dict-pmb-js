// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import xmldecode from 'xmldecode';

const elemTagRx = /\s*<(\/?)([A-Za-z0-9_\-]+)\s*(\/?)>\s*/;
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
    m.closingSlash = m[1];
    m.tagName = m[2];
    m.selfClose = m[3];
    dbg(m);
    return m;
  }

  function unexp(what) {
    const em = `Unexpected ${what} ${quot(found.tagName)} at position ${
      found.at || charsParsed} while reading key ${quot(key)}`;
    throw new Error(em);
  }

  function learn(xmlText) {
    let newText = xmldecode(xmlText);
    const oldValue = getOwn(dict, key);
    if (oldValue !== undefined) {
      newText = (opt.combineTexts || unexp('duplicate key name')
      )(oldValue, newText, key, dict);
    }
    dbg({ learn: key, newText });
    dict[key] = newText;
    key = null;
  }

  while (eat(elemTagRx)) {
    if (found.closingSlash) {
      if (!key) { unexp('closing tag'); }
      learn(found.pre);
    } else {
      if (found.pre.trim()) { unexp('printable character'); }
      if (key) { unexp('opening tag'); }
      key = found.tagName;
      const { selfClose } = found;
      dbg({ key, selfClose });
      if (selfClose) { learn(''); }
    }
  }
  if (remain.trim()) { unexp('trailing printable character in front of tag'); }
  return dict;
};




export default EX;
