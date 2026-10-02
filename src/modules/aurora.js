/**
 * Hero background — a single full-screen WebGL fragment shader:
 * twinkling star layers, flowing aurora curtains and a glowing planet limb.
 * Zero dependencies. Pauses when off-screen / tab hidden.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

vec3 stars(vec2 p, float scale, float density, float t) {
  vec2 g = floor(p * scale);
  vec2 f = fract(p * scale) - 0.5;
  float h = hash(g);
  if (h < density) return vec3(0.0);
  vec2 off = vec2(hash(g + 1.7), hash(g + 9.1)) - 0.5;
  float d = length(f - off * 0.7);
  float tw = 0.6 + 0.4 * sin(t * (1.0 + h * 3.0) + h * 80.0);
  float s = smoothstep(0.08, 0.0, d) * tw;
  vec3 tint = mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.9, 0.8), hash(g + 3.3));
  return tint * s * (h - density) / (1.0 - density) * 2.2;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p  = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;

  // deep-space gradient
  vec3 col = mix(vec3(0.012, 0.016, 0.045), vec3(0.035, 0.035, 0.10), smoothstep(0.0, 1.0, uv.y));

  // parallax star layers
  col += stars(p + uMouse * 0.010 + vec2(0.0, uScroll * 0.05), 90.0, 0.965, t);
  col += stars(p + uMouse * 0.025 + vec2(0.0, uScroll * 0.12), 45.0, 0.975, t * 0.8) * 0.9;
  col += stars(p + uMouse * 0.050 + vec2(0.0, uScroll * 0.25), 18.0, 0.985, t * 0.6) * 0.8;

  // aurora curtains
  vec2 ap = p + uMouse * 0.03;
  float at = t * 0.045;
  vec3 aur = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float x = ap.x * (0.9 + fi * 0.08) + fi * 0.37;
    float base = -0.02 + fi * 0.03 + 0.22 * (fbm(vec2(x * 1.3 + at * 2.0, fi * 2.7 + at)) - 0.5);
    float d = ap.y - base;
    float curtain = smoothstep(-0.015, 0.02, d) * exp(-max(d, 0.0) * (3.2 + fi * 0.6));
    float rays = 0.45 + 0.55 * noise(vec2(x * 38.0 + at * 6.0, fi * 4.0 + at * 3.0));
    rays *= 0.7 + 0.3 * noise(vec2(x * 9.0 - at * 4.0, fi));
    float h = clamp(d * 2.6, 0.0, 1.0);
    vec3 c = mix(vec3(0.22, 0.98, 0.76), vec3(0.37, 0.72, 1.0), smoothstep(0.0, 0.35, h));
    c = mix(c, vec3(0.49, 0.36, 1.0), smoothstep(0.3, 0.7, h));
    c = mix(c, vec3(1.0, 0.37, 0.82), smoothstep(0.65, 1.0, h));
    float fade = smoothstep(-0.95, -0.35, ap.x + sin(at + fi) * 0.2) * smoothstep(0.95, 0.35, ap.x - cos(at * 0.7 + fi) * 0.2);
    aur += c * curtain * rays * fade * (0.30 - fi * 0.035);
  }
  col += aur * 1.15;

  // planet + atmospheric limb
  vec2 pc = vec2(0.0, -1.70 - uScroll * 0.25);
  float R = 1.32;
  float r = length(p - pc);
  float limb = exp(-abs(r - R) * 55.0) * 0.9 + exp(-max(r - R, 0.0) * 7.0) * 0.28;
  vec3 atm = mix(vec3(0.25, 0.55, 1.0), vec3(0.3, 1.0, 0.8), 0.35) * limb;
  if (r < R) {
    float shade = smoothstep(R, R - 0.6, r);
    vec3 ground = vec3(0.012, 0.014, 0.035) + vec3(0.03, 0.04, 0.09) * (1.0 - shade);
    // faint city lights
    float lights = step(0.985, hash(floor((p - pc) * 220.0))) * (1.0 - shade) * 0.6;
    col = ground + vec3(1.0, 0.75, 0.45) * lights + atm * 0.35;
  } else {
    col += atm;
  }

  // vignette + gentle grain
  col *= 1.0 - 0.35 * dot(uv - 0.5, uv - 0.5) * 2.0;
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.015;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function initAurora(canvas) {
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return; // CSS gradient fallback stays visible

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uScroll = gl.getUniformLocation(prog, 'uScroll');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Render at reduced resolution — the shader is soft, nobody will notice, GPUs will thank us.
  const quality = Math.min(window.devicePixelRatio || 1, 1.25) * (innerWidth < 700 ? 0.6 : 0.75);

  const resize = () => {
    const w = Math.floor(canvas.clientWidth * quality);
    const h = Math.floor(canvas.clientHeight * quality);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  resize();
  addEventListener('resize', resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = -(e.clientY / innerHeight - 0.5) * 2;
  });

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  const start = performance.now();
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    const scroll = Math.min(scrollY / innerHeight, 1.5);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uScroll, scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(frame);
}
