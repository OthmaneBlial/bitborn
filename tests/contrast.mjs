import assert from 'node:assert/strict';

export function rgba(text) {
  const match=/^rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(text);
  assert.ok(match,`Unsupported computed sRGB color: ${text}`);
  const values=match.slice(1,4).map(Number),alpha=match[4]===undefined?1:Number(match[4]);
  assert.ok(values.every(value=>value>=0&&value<=255)&&alpha>=0&&alpha<=1,'sRGB channel bounds');
  return [...values,alpha];
}

export function composite(front,back) {return front.slice(0,3).map((value,index)=>value*front[3]+back[index]*(1-front[3]));}

function luminance(rgb) {
  const linear=rgb.map(value=>{const channel=value/255;return channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4;});
  return linear[0]*0.2126+linear[1]*0.7152+linear[2]*0.0722;
}

export function contrast(first,second) {
  const a=luminance(first),b=luminance(second);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}
