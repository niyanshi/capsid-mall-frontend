import{_ as W}from"./icon-add.d86e97f0.js";import{d as z,u as L,y as N,r as c,f as R,o as r,c as d,b as s,n as f,t as a,e as t,F as T,h as V,j as C,C as k,g as P,q as $,s as F,_ as M}from"./index.21f0358c.js";import{e as U}from"./campaign.e0699e2c.js";import{B as j}from"./index.2f5b3fba.js";import{P as q}from"./index.4ff6959e.js";import"./nft.2142c28f.js";import"./profile.e2067de0.js";const v=u=>($("data-v-c6c9e076"),u=u(),F(),u),E={class:"wear-wrap"},G={class:"tab"},A={class:"content"},H={class:"icon"},J=v(()=>s("img",{src:W,alt:"",srcset:""},null,-1)),K={class:"text"},O=["src"],Q={class:"status text"},X={key:0,class:"tip-content"},Y=v(()=>s("i",{class:"icon-success icon-size"},null,-1)),Z={class:"info-text"},ss={class:"info-title"},es={class:"message"},ts={key:1,class:"tip-content"},as=v(()=>s("i",{class:"icon-error icon"},null,-1)),os={class:"info-text"},is={class:"info-title"},ns={class:"message"},ls=v(()=>s("i",{class:"icon-ok"},null,-1)),cs=z({__name:"index",setup(u){const{t:e}=L(),x=N(),i=c(0),m=c([]),g=async()=>{const o=await U({accountId:x.currentUser.userId,type:i.value===0?"":i.value});o.code===0&&(m.value=o.data.records)},p=o=>{i.value=o,g()},h=c(!1),_=c(!1),w=c(!1),I=()=>{h.value=!0},b=()=>{h.value=!1},y=o=>{w.value=o,_.value=!0},S=()=>{_.value=!1},D=()=>{_.value=!1,b()};return R(()=>{g()}),(o,n)=>(r(),d("div",E,[s("div",G,[s("span",{class:f([i.value===0?"active":""]),onClick:n[0]||(n[0]=l=>p(0))},a(t(e)("wear-page.tab[0]")),3),s("span",{class:f([i.value===1?"active":""]),onClick:n[1]||(n[1]=l=>p(1))},a(t(e)("wear-page.tab[1]")),3),s("span",{class:f([i.value===2?"active":""]),onClick:n[2]||(n[2]=l=>p(2))},a(t(e)("wear-page.tab[2]")),3)]),s("div",A,[s("div",{class:"add item-size",onClick:I},[s("div",H,[J,s("div",K,a(t(e)("wear-page.createNew")),1)])]),(r(!0),d(T,null,V(m.value,(l,B)=>(r(),d("div",{key:B,class:"wear-item item-size"},[s("img",{src:l.parentPic1,alt:"",srcset:""},null,8,O),s("div",Q,a(l.status===3?t(e)("wear-page.tab[1]"):t(e)("wear-page.tab[2]")),1)]))),128))]),C(q,{visible:h.value,onClose:b,onResult:y},null,8,["visible"]),C(j,{visible:_.value,width:"640",height:"240",onClose:S},{button:k(()=>[s("div",{class:"dialog-button",onClick:D},[s("span",null,a(t(e)("ok")),1),ls])]),default:k(()=>[w.value?(r(),d("div",X,[Y,s("div",Z,[s("div",ss,a(t(e)("wearSuccess")),1),s("div",es,[s("p",null,[P(a(t(e)("viewInMy")),1),s("a",null,a(t(e)("profile")),1)]),s("p",null,a(t(e)("wearSuccessTips")),1)])])])):(r(),d("div",ts,[as,s("div",os,[s("div",is,a(t(e)("error")),1),s("div",ns,[s("p",null,a(t(e)("errorTips")),1)])])]))]),_:1},8,["visible"])]))}});const fs=M(cs,[["__scopeId","data-v-c6c9e076"]]);export{fs as default};
