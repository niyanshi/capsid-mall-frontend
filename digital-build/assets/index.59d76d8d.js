import{d as S,u as w,a as N,y as $,r as b,f as L,o as n,c,b as e,t as i,e as t,F as B,h as F,bz as g,v as h,q,s as E,_ as U}from"./index.21f0358c.js";import{h as M}from"./campaign.e0699e2c.js";const p=o=>(q("data-v-8e500eed"),o=o(),E(),o),T={class:"list-wrap"},V={class:"campaign-title"},z=p(()=>e("div",{class:"campaign-icon"},null,-1)),D={class:"campaign-text"},G=p(()=>e("em",null,null,-1)),P=["onClick"],R={class:"campaign-item"},j=["src"],A={class:"campaign-name"},H=["onClick"],J=p(()=>e("em",{class:"icon-edit"},null,-1)),K=["onClick"],O=p(()=>e("em",{class:"icon-edit"},null,-1)),Q=S({__name:"index",setup(o){const{t:d}=w(),l=N(),_=$(),v="http://172.100.3.144:9080/file/download?fileName=",u=b([]),f=()=>{l.push("/campaign/campaign-create")},k=a=>{l.push({path:"/campaign/campaign-detail",query:{campaignId:a}})},C=a=>{l.push({path:"/campaign/campaign-create",query:{campaignId:a}})},I=a=>{l.push(`/campaign/campaign-nft-edit/${a}`)},y=async()=>{const r=await M({accountId:""});r.code===0&&(u.value=r.data.records)};return L(()=>{y()}),(a,r)=>(n(),c("div",T,[e("div",V,[z,e("div",D,i(t(d)("campaign-page.title")),1),e("div",{class:"create-button",onClick:f},[e("span",null,i(t(d)("campaign-page.create")),1),G])]),e("div",null,[(n(!0),c(B,null,F(u.value,(s,x)=>(n(),c("div",{key:x,class:"campaign-list",onClick:m=>k(s.id)},[e("div",R,[e("img",{src:`${t(v)}${s.banner}`,alt:""},null,8,j),e("div",A,[e("span",null,i(s.campaignName),1),String(s.ownerId)===t(_).currentUser.userId?(n(),c("div",{key:0,class:"edit r240",onClick:g(m=>C(s.id),["stop"])},[e("span",null,i(t(d)("campaign-page.edit")),1),J],8,H)):h("",!0),String(s.ownerId)===t(_).currentUser.userId?(n(),c("div",{key:1,class:"edit",onClick:g(m=>I(s.id),["stop"])},[e("span",null,i(t(d)("campaign-page.editNFT")),1),O],8,K)):h("",!0)])])],8,P))),128))])]))}});const Y=U(Q,[["__scopeId","data-v-8e500eed"]]);export{Y as default};
