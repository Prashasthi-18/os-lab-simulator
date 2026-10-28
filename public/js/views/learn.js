// Educational panel: overview, reference code, complexity, trade-offs, viva questions and formulas.
import { h, clear, put, button, toast, download } from '../ui.js';
import { CONTENT, FORMULAS } from '../content.js';

const LANGS = { c: { label: 'C', ext: 'c', run: (f) => `gcc ${f}.c -o ${f} && ./${f}` }, cpp: { label: 'C++', ext: 'cpp', run: (f) => `g++ ${f}.cpp -o ${f} && ./${f}` },
  java: { label: 'Java', ext: 'java', file: 'Main', run: () => 'javac Main.java && java Main' } };
let codeLang = 'c';   // remembered while the page is open, so switching weeks keeps the chosen language

const C_KW = 'auto break case char const continue default do double else enum extern float for if int long return short signed sizeof static struct switch typedef unsigned void while bool true false NULL';
const KEYWORDS = {
  c: new Set(C_KW.split(' ')),
  cpp: new Set(`${C_KW} class namespace using std public private new delete template auto nullptr vector string cout cin endl`.split(' ')),
  java: new Set('boolean break byte case char class continue default do double else final for if import int long new null private public return static String System void while true false this'.split(' ')),
};
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b/gm;

/** Light syntax colouring built from DOM nodes (no innerHTML): comments, strings, preprocessor, numbers, keywords. */
function highlight(src, lang) {
  const out = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const [text, com, str, pre, num, word] = m;
    const cls = com ? 'tk-com' : str ? 'tk-str' : pre ? 'tk-pre' : num ? 'tk-num' : KEYWORDS[lang].has(word) ? 'tk-kw' : null;
    if (!cls) continue;
    if (m.index > last) out.push(src.slice(last, m.index));
    out.push(h('span', { class: cls, text }));
    last = m.index + text.length;
  }
  out.push(src.slice(last));
  return out;
}

function codeView(algId, moduleId, name) {
  const box = h('div', { class: 'code-view' }, h('p', { class: 'muted', text: 'Loading code…' }));
  import(`../code/${moduleId}.js`).then(({ CODE }) => {
    const progs = CODE[algId];
    if (!progs) throw new Error('missing');
    const draw = () => {
      const L = LANGS[codeLang], src = progs[codeLang], file = L.file || algId;
      const langTabs = h('div', { class: 'tabs algo-tabs', role: 'tablist', 'aria-label': 'Programming language' }, Object.entries(LANGS).map(([k, v]) => h('button', {
        type: 'button', role: 'tab', class: `tab${k === codeLang ? ' active' : ''}`, 'aria-selected': String(k === codeLang), onClick: () => { codeLang = k; draw(); } }, v.label)));
      put(clear(box),
        h('p', { text: `A complete ${name} program you can compile and run. It uses the same example input as the simulator's default sample, so its output matches what you see above. Change the values at the top of main() to try your own.` }),
        h('div', { class: 'code-bar' }, langTabs, h('div', { class: 'toolbar' },
          button('Copy', { icon: 'copy', small: true, onClick: () => navigator.clipboard.writeText(src).then(() => toast(`${L.label} code copied.`), () => toast('Could not copy: select the code and copy it by hand.', 'error')) }),
          button('Download', { icon: 'download', small: true, onClick: () => download(`${file}.${L.ext}`, src, 'text/plain;charset=utf-8') }))),
        h('p', { class: 'hint' }, `Save as ${file}.${L.ext}, then run: `, h('code', { text: L.run(file) })),
        h('pre', { class: 'code-block', tabindex: 0, 'aria-label': `${name} in ${L.label}` }, h('code', {}, highlight(src, codeLang))));
    };
    draw();
  }).catch(() => put(clear(box), h('p', { class: 'muted', text: 'Code for this algorithm is not available yet.' })));
  return box;
}

export function learnPanel(algId, moduleId, extra) {
  const c = CONTENT[algId];
  const root = h('div', { class: 'learn' });
  root.openTab = () => {};
  if (!c) return root;
  const body = h('div', { class: 'tabpanel', role: 'tabpanel' });
  const dl = (pairs) => h('dl', { class: 'terms' }, pairs.map(([t, d]) => [h('dt', { text: t }), h('dd', { text: d })]));
  const tabs = {
    Overview: () => [h('p', {}, h('strong', { text: `${c.full}. ` }), c.purpose), h('p', {}, h('strong', { text: 'Core idea. ' }), c.idea),
      h('h4', { text: 'Working steps' }), h('ol', {}, c.steps.map((s) => h('li', { text: s }))), h('h4', { text: 'Important terminology' }), dl(c.terms),
      h('p', { class: 'muted', text: 'Manual walkthrough: pause the simulation and press Next step to read the reasoning behind every decision.' })],
    'Code (C, C++, Java)': () => codeView(algId, moduleId, c.full),
    Complexity: () => [dl([['Time', c.time], ['Space', c.space]]), h('p', { class: 'muted', text: `Assumptions and limits: ${c.note}` })],
    'Pros and cons': () => [h('div', { class: 'two-col' }, h('div', {}, h('h4', { text: 'Advantages' }), h('ul', {}, c.pros.map((p) => h('li', { text: p })))), h('div', {}, h('h4', { text: 'Disadvantages' }), h('ul', {}, c.cons.map((p) => h('li', { text: p })))))],
    'Viva questions': () => c.viva.map(([q, a]) => h('details', { class: 'viva' }, h('summary', { text: q }), h('p', { text: a }))),
    Formulas: () => [h('ul', {}, (FORMULAS[moduleId] || []).map((f) => h('li', {}, h('code', { text: f }))))],
  };
  const names = Object.keys(tabs);
  const tablist = h('div', { class: 'tabs', role: 'tablist', 'aria-label': `About ${c.name}` });
  let active = names[0];
  const draw = () => {
    clear(tablist).append(...names.map((n) => h('button', { type: 'button', role: 'tab', class: `tab${n === active ? ' active' : ''}`, 'aria-selected': String(n === active), tabindex: n === active ? 0 : -1,
      onClick: () => { active = n; draw(); },
      onKeydown: (e) => { const k = names.indexOf(active); if (e.key === 'ArrowRight') { active = names[(k + 1) % names.length]; draw(); tablist.querySelector('.active').focus(); } else if (e.key === 'ArrowLeft') { active = names[(k + names.length - 1) % names.length]; draw(); tablist.querySelector('.active').focus(); } } }, n)));
    clear(body).append(...[].concat(tabs[active]()));
  };
  draw();
  root.openTab = (prefix) => { active = names.find((n) => n.startsWith(prefix)) || active; draw(); };
  put(root, h('h3', { text: c.name }), tablist, body, extra);
  return root;
}
