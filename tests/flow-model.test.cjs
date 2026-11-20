const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const M=require('../flow-model.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../flow-history.js'),'utf8'),ctx);
const history=ctx.window.PINOT_HISTORY;

test('Reference snapshot separates form leads from conversations and Google events',()=>{
  assert.equal(history.recent[1].meta.forms,45);
  assert.equal(history.recent[1].meta.chats,271);
  assert.equal(history.recent[1].meta.results,316);
  const chat=history.campaigns.find(x=>x.id==='BBD');
  assert.equal(chat.results,485);
  assert.equal(chat.months.reduce((s,x)=>s+x.forms,0),35);
  assert.equal(history.campaigns.find(x=>x.id==='SEARCH').results,20);
});

test('December protects the higher November costs instead of extrapolating mixed leads',()=>{
  const m=M.calculate('2026-12',M.defaults('2026-12'),history);
  assert.equal(m.meta,6375000);assert.equal(m.google,2125000);
  assert.deepEqual(m.totals,{forms:136,chats:255,conversions:12});
  assert.equal(m.entries.find(x=>x.id==='CARGOS').goal,102000);
  assert.equal(m.entries.find(x=>x.id==='MARCAS').goal,43000);
  assert.equal(m.entries.find(x=>x.id==='BBD').goal,5000);
  assert.equal(m.entries.find(x=>x.id==='PMAX').spend,0);
});

test('January uses its own allocation, cost assumptions and 31-day schedule',()=>{
  const m=M.calculate('2027-01',M.defaults('2027-01'),history);
  assert.equal(m.meta,5950000);assert.equal(m.google,2550000);
  assert.deepEqual(m.totals,{forms:150,chats:185,conversions:16});
  assert.equal(m.phases.reduce((a,x)=>a+x.days,0),31);
  assert.equal(m.phases[0].spend,850000);
  assert.equal(m.phases[3].spend,2550000);
});

test('Editable budgets and extreme media mixes preserve every peso and metric subtotal',()=>{
  for(const period of Object.keys(M.periods))for(const budget of [0,1,101,3000000,8500000,9999999,25000000,1000000000000])for(const google of [0,25,30,63,100])for(const scenario of Object.keys(M.scenarios)){
    const m=M.calculate(period,{budget,google,scenario},history);
    assert.equal(m.entries.reduce((s,e)=>s+e.spend,0),budget);
    assert.equal(m.phases.reduce((s,e)=>s+e.spend,0),budget);
    assert.equal(m.meta+m.google,budget);
    assert.ok(Math.abs(m.entries.reduce((s,e)=>s+e.share,0)-100)<1e-8);
    for(const metric of ['forms','chats','conversions'])assert.equal(m.entries.filter(e=>e.metric===metric).reduce((s,e)=>s+e.results,0),m.totals[metric]);
    for(const e of m.entries)assert.ok(Number.isInteger(e.results)&&e.results>=0&&Number.isFinite(e.daily));
  }
});

test('Increasing cost reduces projected results and zero budget has no synthetic leads',()=>{
  for(const period of Object.keys(M.periods)){
    const states=['efficient','base','conservative'].map(scenario=>M.calculate(period,{...M.defaults(period),scenario},history));
    for(const metric of ['forms','chats','conversions'])assert.ok(states[0].totals[metric]>=states[1].totals[metric]&&states[1].totals[metric]>=states[2].totals[metric]);
    assert.deepEqual(M.calculate(period,{budget:0,google:30,scenario:'base'},history).totals,{forms:0,chats:0,conversions:0});
  }
});

test('Invalid restored inputs fall back safely and month defaults remain independent',()=>{
  assert.deepEqual(M.normalize('2026-12',{budget:NaN,google:-20,scenario:'unknown'}),M.defaults('2026-12'));
  assert.equal(M.defaults('2026-12').google,25);assert.equal(M.defaults('2027-01').google,30);
  assert.throws(()=>M.calculate('2027-12',{},history));
});
