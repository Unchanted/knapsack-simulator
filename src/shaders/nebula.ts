
export const nebulaVertex = `
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;


export const nebulaShader = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: [0, 0] },
    qualityLevel: { value: 1 } 
  },
  
  vertexShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    uniform int qualityLevel;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    
    
    vec2 hash22(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float hash13(vec3 p) {
      p = fract(p * vec3(0.1031, 0.11369, 0.13787));
      p += dot(p, p.yxz + 19.19);
      return fract(p.x * p.y * p.z);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      
      
      vec3 u = f * f * (3.0 - 2.0 * f);
      
      
      float n = i.x + i.y * 157.0 + i.z * 113.0;
      
      vec4 v = vec4(
        hash13(i + vec3(0.0, 0.0, 0.0)),
        hash13(i + vec3(1.0, 0.0, 0.0)),
        hash13(i + vec3(0.0, 1.0, 0.0)),
        hash13(i + vec3(1.0, 1.0, 0.0))
      );
      
      vec2 vz = mix(v.xy, v.zw, u.y);
      float vyz = mix(vz.x, vz.y, u.x);
      
      v = vec4(
        hash13(i + vec3(0.0, 0.0, 1.0)),
        hash13(i + vec3(1.0, 0.0, 1.0)),
        hash13(i + vec3(0.0, 1.0, 1.0)),
        hash13(i + vec3(1.0, 1.0, 1.0))
      );
      
      vz = mix(v.xy, v.zw, u.y);
      float vzw = mix(vz.x, vz.y, u.x);
      
      return mix(vyz, vzw, u.z) * 2.0 - 1.0;
    }
    
    float fbm(vec3 p, int octaves) {
      float result = 0.0;
      float amplitude = 1.0;
      float frequency = 1.0;
      float total_amplitude = 0.0;
      int limit = qualityLevel < 1 ? 3 : (qualityLevel == 1 ? 5 : 6);
      
      for (int i = 0; i < 8; i++) {
        if (i >= octaves || i >= limit) break;
        
        result += amplitude * noise(p * frequency);
        total_amplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return result / total_amplitude * 0.5 + 0.5;
    }
    
    void main() {
      
      vec3 p = vPosition * 0.15;
      
      
      p.x += time * 0.03;
      p.y += sin(time * 0.02) * 0.02;
      
      
      float noise1 = fbm(p, 6);
      float noise2 = fbm(p * 2.0 + 10.0, 4);
      
      
      float density = smoothstep(0.4, 0.7, noise1);
      density *= smoothstep(0.3, 0.6, noise2);
      
      
      float edge = smoothstep(0.5, 0.6, noise1) - smoothstep(0.7, 0.8, noise1);
      edge *= smoothstep(0.4, 0.6, noise2);
      
      
      float detail = fbm(p * 4.0, 3) * 0.5;
      
      
      float stars = 0.0;
      if (qualityLevel > 0) {
        stars = pow(hash13(floor(vPosition * 50.0)), 20.0) * 0.6;
      }
      
      
      vec3 bgColor = vec3(0.01, 0.01, 0.04); 
      vec3 nebulaColor1 = vec3(0.2, 0.0, 0.4); 
      vec3 nebulaColor2 = vec3(0.6, 0.2, 0.8); 
      vec3 edgeColor = vec3(0.7, 0.3, 0.9); 
      vec3 accentColor = vec3(0.0, 0.5, 0.9); 
      
      
      vec3 finalColor = mix(bgColor, nebulaColor1, density * 0.8);
      finalColor = mix(finalColor, nebulaColor2, density * density * 0.8);
      finalColor = mix(finalColor, edgeColor, edge * 1.2);
      finalColor = mix(finalColor, accentColor, detail * edge * 0.5);
      
      
      finalColor += vec3(1.0, 1.0, 1.0) * stars;
      
      
      float depth = distance(vUv, vec2(0.5, 0.5)) * 2.0;
      finalColor = mix(finalColor, bgColor, depth * depth * 0.5);
      
      
      float alpha = mix(0.1, 0.85, density);
      alpha = max(alpha, edge * 0.7);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};
