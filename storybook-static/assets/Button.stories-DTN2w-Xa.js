import{j as d}from"./jsx-runtime-u17CrQMm.js";import{R as l}from"./iframe-D5S5KG8a.js";import{c as u}from"./utils-IyxL_b2c.js";import"./preload-helper-PPVm8Dsz.js";const o=l.forwardRef(({className:s,variant:t="primary",...i},c)=>d.jsx("button",{ref:c,className:u("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",{"bg-blue-600 text-white hover:bg-blue-700":t==="primary","bg-gray-100 text-gray-900 hover:bg-gray-200":t==="secondary","border border-gray-200 bg-transparent hover:bg-gray-100":t==="outline"},s),...i}));o.displayName="Button";o.__docgenInfo={description:"",methods:[],displayName:"Button",props:{variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "outline"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"outline"'}]},description:"",defaultValue:{value:'"primary"',computed:!1}}}};const b={title:"Voynich UI/Button",component:o,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","outline"]},disabled:{control:"boolean"}}},r={args:{variant:"primary",children:"Primary Button"}},e={args:{variant:"secondary",children:"Secondary Button"}},a={args:{variant:"outline",children:"Outline Button"}},n={args:{variant:"primary",children:"Disabled Button",disabled:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Outline Button'
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true
  }
}`,...n.parameters?.docs?.source}}};const v=["Primary","Secondary","Outline","Disabled"];export{n as Disabled,a as Outline,r as Primary,e as Secondary,v as __namedExportsOrder,b as default};
