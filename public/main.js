// Make the visitor's own platform the primary download button.
const ua = navigator.userAgent;
const os = /android/i.test(ua) ? 'android' : /iphone|ipod/i.test(ua) ? 'ios' : null;
if (os) {
  const get = document.querySelector('.get'), mine = get.querySelector(`[data-os="${os}"]`), mac = get.querySelector('[data-os="mac"]');
  mac.classList.add('ghost'); mine.classList.remove('ghost'); get.prepend(mine);
}

const orb=document.getElementById('orb'),lab=document.getElementById('orbLabel'),st=document.getElementById('st'),st2=document.getElementById('st2');
let t;
const set=(s,l,a,b)=>{orb.dataset.state=s;lab.textContent=l;st.textContent=a;st2.textContent=b};
orb.addEventListener('click',()=>{
  clearTimeout(t);
  if(orb.dataset.state==='idle'){
    set('connecting','Connecting…','Connecting…','Approve the Duo push on your phone');
    t=setTimeout(()=>set('connected','Disconnect','Connected','vpn.shanghai.nyu.edu'),2200);
  } else set('idle','Connect','Not connected','Try it. This one’s a demo.');
});
