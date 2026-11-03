// Aurora shader from the supplied ProfitizeBuild prompt.
const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;   // 0 a 1, y para cima
uniform float u_hover;  // 0 a 1
uniform vec3 u_warm;    // a borda quente da curva
uniform vec3 u_light;   // a faixa clara
uniform vec3 u_cool;    // a faixa fria
uniform vec3 u_deep;    // o fundo antes do preto
out vec4 o;
vec3 aurora(vec2 p, vec2 m, float t) {
  // só ondas de baixa frequência: a curva fica lisa, sem as cristas do fbm
  float dip = exp(-p.x * p.x * 0.9);
  float curve = 0.1 - 0.95 * dip
    + 0.09 * sin(p.x * 0.8 + t * 3.0)
    + 0.05 * sin(p.x * 1.5 - t * 2.2 + 1.3)
    + 0.03 * sin(p.x * 2.3 + t * 1.6 + 4.1);
  float md = exp(-pow(length(vec2(p.x - m.x, (p.y - m.y) * 0.5)), 2.0) * 2.2);
  curve -= 0.32 * md * u_hover;

  float d = p.y - curve;
  d += 0.04 * sin(p.x * 1.1 + p.y * 0.7 + t * 2.4);
  float s = -d;

  vec3 col = u_warm * (1.0 - smoothstep(0.0, 0.55, max(d, 0.0))) * 0.32;
  float b = max(s, 0.0);
  vec3 band = mix(u_warm, u_light, smoothstep(0.0, 0.34, b));
  band = mix(band, u_cool, smoothstep(0.26, 0.66, b));
  band = mix(band, u_deep, smoothstep(0.62, 1.15, b));
  band = mix(band, vec3(0.0), smoothstep(1.05, 1.75, b));
  return mix(col, band, smoothstep(-0.04, 0.16, s));
}

void main() {
  float asp = u_res.x / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y - 0.5) * 2.0;
  vec2 m = vec2((u_mouse.x - 0.5) * asp, u_mouse.y - 0.5) * 2.0;
  float t = u_time * 0.05;

  vec3 col = aurora(p, m, t);
  // a cópia de cima só aparece quando a tela fica mais alta que larga; no desktop o peso é zero
  float top = (1.0 - smoothstep(0.6, 1.05, asp)) * 0.6;
  if (top > 0.0) {
    vec3 up = aurora(vec2(-p.x, -p.y), vec2(-m.x, -m.y), t + 7.0) * top;
    col = 1.0 - (1.0 - col) * (1.0 - up); // soma como luz (screen)
  }

  col *= (1.0 - smoothstep(0.5, 2.3, length(p * vec2(0.5, 0.85))));
  col *= 0.92;
  o = vec4(col, 1.0);
}`;


const hex = value => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16) / 255);
export function mountAurora(host, colors) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-aurora-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); host.dataset.fallback = 'true'; return () => {}; }
  const shaders = [];
  let program, vao, raf = 0, visible = false, disposed = false, last = 0, clock = 18;
  let sync = () => {};
  let removePointer = () => {};
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData;
  function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    ro?.disconnect(); io?.disconnect();
    document.removeEventListener('visibilitychange', sync);
    removePointer();
    canvas.removeEventListener('webglcontextlost', onLost);
    if (vao) gl.deleteVertexArray(vao);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
    canvas.remove();
  }
  let ro, io;
  function onLost(event) { event.preventDefault(); host.dataset.fallback = 'true'; cleanup(); }
  canvas.addEventListener('webglcontextlost', onLost);
  try {
    program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Aurora shader compilation failed');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Aurora shader linking failed');
    gl.useProgram(program);
    vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const uniforms = Object.fromEntries(['u_res', 'u_time', 'u_mouse', 'u_hover', 'u_warm', 'u_light', 'u_cool', 'u_deep'].map(name => [name, gl.getUniformLocation(program, name)]));
    for (const name of ['warm', 'light', 'cool', 'deep']) gl.uniform3fv(uniforms[`u_${name}`], hex(colors[name]));
    const mouse = [.5, .5], target = [.5, .5];
    let hover = 0, hoverTarget = 0;
    if (!still && matchMedia('(hover: hover)').matches) {
      const onMove = event => {
        if (!visible || event.pointerType === 'touch') return;
        const rect = host.getBoundingClientRect();
        const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
        const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
        hoverTarget = Math.max(0, 1 - Math.hypot(dx, dy) / 120);
        target[0] = (event.clientX - rect.left) / Math.max(rect.width, 1);
        target[1] = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      };
      const leave = () => { hoverTarget = 0; };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('blur', leave);
      document.documentElement.addEventListener('pointerleave', leave);
      removePointer = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('blur', leave);
        document.documentElement.removeEventListener('pointerleave', leave);
      };
    }
    const draw = () => {
      if (disposed) return;
      gl.uniform1f(uniforms.u_time, clock);
      gl.uniform2f(uniforms.u_mouse, mouse[0], mouse[1]);
      gl.uniform1f(uniforms.u_hover, hover);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      if (disposed) return;
      const ratio = Math.min(devicePixelRatio || 1, 1.5) * .5;
      canvas.width = Math.max(1, Math.min(1280, Math.round(host.clientWidth * ratio)));
      canvas.height = Math.max(1, Math.min(900, Math.round(host.clientHeight * ratio)));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_res, canvas.width, canvas.height);
      draw();
    };
    const loop = now => {
      raf = 0;
      if (disposed || !visible || document.hidden || still) return;
      // Follow the display refresh rate; smoothing stays independent of FPS.
      const dt = last ? Math.min((now - last) / 1000, .1) : 0;
      clock += dt;
      const follow = 1 - Math.exp(-dt / .18);
      mouse[0] += (target[0] - mouse[0]) * follow;
      mouse[1] += (target[1] - mouse[1]) * follow;
      hover += (hoverTarget - hover) * (1 - Math.exp(-dt / .3));
      last = now;
      draw();
      raf = requestAnimationFrame(loop);
    };
    function resume() {
      cancelAnimationFrame(raf); raf = 0; last = 0;
      if (!disposed && visible && !document.hidden && !still) raf = requestAnimationFrame(loop);
    }
    sync = resume;
    ro = new ResizeObserver(resize); ro.observe(host);
    io = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); resume(); });
    io.observe(host);
    document.addEventListener('visibilitychange', sync);
    resize();
    return cleanup;
  } catch {
    host.dataset.fallback = 'true'; cleanup(); return () => {};
  }
}
