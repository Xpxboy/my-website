import React, { useEffect, useRef } from 'react';

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
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
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = uv;
        p.x *= aspect;

        vec2 m = uMouse / uResolution.xy;
        m.x *= aspect;

        // --- Main mouse glow (warm amber/gold) ---
        float d = distance(p, m);
        
        // Large soft outer glow
        float outerGlow = exp(-d * 2.2) * 0.55;
        // Tighter inner core
        float innerGlow = exp(-d * 5.5) * 0.45;
        
        float glow = outerGlow + innerGlow;

        // Warm amber color palette
        vec3 warmColor = mix(
          vec3(0.95, 0.65, 0.25),   // warm amber
          vec3(1.0, 0.85, 0.55),     // soft gold
          innerGlow / (glow + 0.001)
        );

        // Subtle animated shimmer
        float shimmer = 0.92 + 0.08 * sin(uTime * 1.2 + d * 8.0);
        glow *= shimmer;

        // Very subtle drifting warm particles (much lighter than before)
        float particles = 0.0;
        for (int i = 1; i <= 6; i++) {
          float fi = float(i);
          float x = fract(random(vec2(fi, 123.45)) + uTime * (0.008 + random(vec2(fi)) * 0.01)) * aspect;
          float y = fract(random(vec2(fi, 543.21)) + uTime * (0.02 + random(vec2(fi)) * 0.03));
          float pd = distance(p, vec2(x, y));
          float pulse = 0.5 + 0.5 * sin(uTime * 0.6 + fi * 2.0);
          particles += exp(-pd * 12.0) * 0.07 * pulse;
        }

        vec3 particleColor = vec3(1.0, 0.78, 0.4) * particles;

        vec3 finalColor = warmColor * glow + particleColor;

        // Alpha based on glow intensity — fully transparent where there's no glow
        float alpha = clamp(glow * 1.4 + particles * 0.8, 0.0, 0.6);

        // Dither to prevent banding
        float dither = (random(uv + uTime * 0.01) - 0.5) * (1.0 / 128.0);
        finalColor += dither;
        alpha += dither * 0.5;

        gl_FragColor = vec4(finalColor, alpha);
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

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

      gl.useProgram(shaderProgram);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Smooth mouse easing
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'soft-light',
      }}
    />
  );
};

export default PremiumBackground;
