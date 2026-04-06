import React, { useEffect, useRef } from 'react';

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;

    // --- Shaders ---
    const vs = `
      precision highp float;
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uTime;

      float random(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      // Helper to create a soft light orb
      vec3 createOrb(vec2 uv, vec2 pos, vec3 color, float size) {
        float d = distance(uv, pos);
        return color * exp(-d * (5.0 / size));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = uv;
        p.x *= aspect;
        
        vec2 m = uMouse / uResolution.xy;
        m.x *= aspect;

        // Base Deep Atmosphere
        vec3 base = mix(vec3(0.005, 0.005, 0.015), vec3(0.0), uv.y);

        // --- Drifting Soft Lights ---
        // We create 10 independent orbs moving like the requested circle code
        vec3 orbs = vec3(0.0);
        
        for(int i = 1; i <= 15; i++) { // Increased to 15 orbs
            float fi = float(i);
            // Drifting logic: upward movement + horizontal sway
            float x = fract(random(vec2(fi, 123.45)) + uTime * (0.012 + random(vec2(fi)) * 0.015)) * aspect;
            float y = fract(random(vec2(fi, 543.21)) + uTime * (0.04 + random(vec2(fi)) * 0.06));
            
            // Pulse intensity - more dramatic
            float pulse = 0.6 + 0.4 * sin(uTime * 0.4 + fi * 1.5);
            float orbSize = 0.15 + 0.3 * random(vec2(fi, 99.9)); // Larger orbs
            
            // Brighter, more saturated colors
            vec3 orbColor = mix(vec3(0.04, 0.08, 0.3), vec3(0.05, 0.15, 0.45), random(vec2(fi)));
            orbs += createOrb(p, vec2(x, y), orbColor * pulse, orbSize);
        }

        // --- Main Mouse Glow ---
        float d = distance(p, m);
        float glow = exp(-d * 3.8);
        vec3 mouseColor = vec3(0.05, 0.15, 0.4) * glow;

        vec3 final = base + orbs + mouseColor;

        // Apply 32-bit Dithering to kill the 8-bit rings
        float dither = (random(uv) - 0.5) * (1.0 / 128.0);
        final += dither;

        gl_FragColor = vec4(final, 1.0);
      }
    `;

    // --- Setup ---
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(shaderProgram, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(shaderProgram, 'uResolution');
    const uMouse = gl.getUniformLocation(shaderProgram, 'uMouse');
    const uTime = gl.getUniformLocation(shaderProgram, 'uTime');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = canvas.height - e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let animationFrameID: number;

    const render = (time: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Ensure we're using the correct program before setting uniforms
      gl.useProgram(shaderProgram);

      // Smooth mouse easing for high-end feel
      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uTime, time * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameID = requestAnimationFrame(render);
    };

    animationFrameID = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationFrameID);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 w-full h-full block bg-black select-none pointer-events-none" />;
};

export default PremiumBackground;
