Para obtener los datos a guardar en los archivos .js ejecutar en la consola:

const datos = [];
const t1 = document.getElementsByClassName('highcharts-graph')[0];
const t2 = document.getElementsByClassName('highcharts-xaxis-labels')[0];
const t3 = document.getElementsByClassName('highcharts-yaxis-labels')[0];
let base = t1.parentNode.getAttribute("transform");
base = new RegExp("translate\\((.*),(.*)\\) scale").exec(base);
base = {x:Number.parseFloat(base[1]), y:Number.parseFloat(base[2])};
let path = t1.getAttribute("d").split(' ');
while(path.length > 0) {
  let c = path[0];
  if (c == "M" && path.length >= 3) {
    datos.push({x:base.x+Number.parseFloat(path[1]), y:base.y+Number.parseFloat(path[2])});
    path = path.splice(3);
  } else if (c == "C" && path.length >= 7) {
    datos.push({x:base.x+Number.parseFloat(path[5]), y:base.y+Number.parseFloat(path[6])});
    path = path.splice(7);
  } else {
    throw `${c} ${path.length}`;
  }
}
const parsearEje = function(temp, a) {
  if (temp.children.length < 2) { throw 'Err'; }
  let p = [
    {x:temp.children[0].getAttribute(a), y:temp.children[0].innerHTML},
    {x:temp.children[1].getAttribute(a), y:temp.children[1].innerHTML},
  ];
  let m = (p[1].y - p[0].y) / (p[1].x - p[0].x);
  let b = p[0].y - m*p[0].x;
  return (x) => m*x + b;
};
base = {
  x:parsearEje(t2, 'x'),
  y:parsearEje(t3, 'y')
};
`[${datos.map(d => `{x:${base.x(d.x)}, y:${base.y(d.y)}}`).join(',')}]`;