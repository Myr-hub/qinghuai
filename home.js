const toggle = document.getElementById('theme');
toggle.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
  toggle.textContent = dark ? '浅色' : '深色';
});

// 固定无粉色调色板；通过空间权重混合，不对整屏旋转色相。
(() => {
  const canvas = document.getElementById('color-field');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const size = 64;
  const frame = context.createImageData(size, size);
  const palette = [[118,157,221],[102,203,217],[141,205,169],[235,219,145],[153,186,224],[187,225,209]];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const started = performance.now();
  let previous = 0, request = 0;
  function draw(t) {
    const centers = palette.map((_,i)=>({
      x: .5 + .47*Math.sin(t*(.34+i*.031)+i*2.4),
      y: .5 + .46*Math.cos(t*(.29+i*.027)+i*1.7)
    }));
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const u=x/(size-1), v=y/(size-1);
      // 曲面坐标使色带伸展、收拢和弯曲，而不是固定圆斑平移。
      const wx=u+.17*Math.sin(v*5.3+t*.48)+.09*Math.cos(u*4-v*3-t*.31);
      const wy=v+.16*Math.sin(u*5.1-t*.39)+.08*Math.cos(v*4+u*3+t*.28);
      let total=0,r=0,g=0,b=0;
      centers.forEach((c,i)=>{
        const dx=wx-c.x,dy=wy-c.y;
        const w=Math.exp(-(dx*dx+dy*dy)*(13+3*Math.sin(t*.25+i)))+.003;
        total+=w;r+=palette[i][0]*w;g+=palette[i][1]*w;b+=palette[i][2]*w;
      });
      const k=(y*size+x)*4;
      frame.data[k]=r/total;frame.data[k+1]=g/total;frame.data[k+2]=b/total;frame.data[k+3]=255;
    }
    context.putImageData(frame,0,0);
  }
  function tick(now) {
    if(!previous) previous=now;
    if(now-previous>=33) {previous=now;draw((now-started)/1000 * 1.35);}
    request=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(request);previous=0;
    if(reduced.matches) draw(0);
    else if(!document.hidden) request=requestAnimationFrame(tick);
  }
  draw(0);sync();
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
})();

