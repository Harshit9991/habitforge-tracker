/* Run with: node --test tests/billing.test.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/billing.js'),'utf8');
function load(email, {mobile=false, enforce=true, exp=Date.now()+60000, sub='test', raw, paid=false, page='plans'}={}) {
  const store=new Map();
  if (email !== null) store.set('habitforge:auth:v1',raw ?? JSON.stringify({email,exp,sub}));
  if (paid) store.set('habitforge:billing:v1',JSON.stringify({plan:'lifetime'}));
  const redirects=[];
  const ctx={Date, localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},
    window:{matchMedia:()=>({matches:mobile})}, document:{documentElement:{getAttribute:()=>page}},
    location:{replace:u=>redirects.push(u)}};
  vm.runInNewContext(enforce?source.replace('ENFORCE: false','ENFORCE: true'):source,ctx);
  return {b:ctx.window.HFBilling,store,redirects};
}
for (const mobile of [false,true]) {
  const dash=mobile?'/m/dashboard.html':'/dashboard.html';
  const plans=mobile?'/m/pricing.html':'/pricing.html';
  const tracker=mobile?'/m/tracker.html':'/tracker.html';
  test(`owner exemption and account switching (${mobile?'mobile':'desktop'})`,()=>{
    for(const email of ['harshit.chebolu99@gmail.com','HARSHIT.CHEBOLU99@GMAIL.COM']) {
      const {b,store,redirects}=load(email,{mobile,page:'dashboard'});
      assert.equal(b.entitled(),true); assert.equal(b.locked(),false);
      assert.equal(b.afterSigninUrl(dash),dash); b.requireAccess(); assert.deepEqual(redirects,[]);
      assert.equal(store.has('habitforge:billing:v1'),false);
      store.set('habitforge:auth:v1',JSON.stringify({email:'someone@example.com',sub:'other',exp:Date.now()+60000}));
      assert.equal(b.locked(),true); b.requireAccess(); assert.deepEqual(redirects,[plans]);
      store.delete('habitforge:auth:v1'); assert.equal(b.locked(),true);
    }
  });
  test(`other accounts stay off the dashboard, free users land on the tracker (${mobile?'mobile':'desktop'})`,()=>{
    for(const email of ['someone@example.com','harshit.chebolu2027@mastersunion.org','harshit.chebolu99+test@gmail.com','harshit.chebolu99@gmail.com.evil.invalid',null]){
      const {b}=load(email,{mobile}); assert.equal(b.locked(),true); assert.equal(b.afterSigninUrl(dash),tracker);
    }
    assert.equal(load('someone@example.com',{mobile,paid:true}).b.locked(),false);
    assert.equal(load('someone@example.com',{mobile,paid:true}).b.afterSigninUrl(dash),dash);
    assert.equal(load('someone@example.com',{mobile,enforce:false}).b.locked(),false);
  });
  test(`free tier: tracker and plans pages never redirect (${mobile?'mobile':'desktop'})`,()=>{
    for (const page of ['tracker','plans','signin',null]) {
      const {redirects}=load('someone@example.com',{mobile,page});
      assert.deepEqual(redirects,[]);
    }
  });
  test(`dashboard auto-gates only when enforcing (${mobile?'mobile':'desktop'})`,()=>{
    assert.deepEqual(load('someone@example.com',{mobile,page:'dashboard'}).redirects,[plans]);
    assert.deepEqual(load('someone@example.com',{mobile,page:'dashboard',enforce:false}).redirects,[]);
    assert.deepEqual(load('someone@example.com',{mobile,page:'dashboard',paid:true}).redirects,[]);
  });
}
test('invalid, expired, incomplete, or unavailable sessions do not get exemption',()=>{
  for(const options of [{exp:0},{sub:''},{raw:'broken'},{raw:'null'},{raw:'{}'},{raw:'{"email":55}' }]) assert.equal(load('harshit.chebolu99@gmail.com',options).b.locked(),true);
});
test('production switch remains off and checkout link empty until Dodo lands',()=>{
  const {b}=load(null); assert.match(source,/ENFORCE: false/);
  assert.equal(b.CONFIG.CHECKOUT_LIFETIME,'');
});
