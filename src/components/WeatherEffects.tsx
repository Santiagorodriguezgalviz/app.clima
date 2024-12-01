import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

interface WeatherEffectsProps {
  weatherCode: number;
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCode }) => {
  const particlesInit = React.useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const getRainConfig = () => ({
    particles: {
      number: { value: 100 },
      color: { value: "#ffffff" },
      shape: { type: "line" },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        direction: "bottom",
        speed: 15,
        straight: true,
      },
      line_linked: { enable: false },
    },
    background: { enable: false },
  });

  const getSnowConfig = () => ({
    particles: {
      number: { value: 50 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 4 },
      },
      move: {
        direction: "bottom",
        speed: 3,
        random: true,
        straight: false,
      },
      line_linked: { enable: false },
    },
    background: { enable: false },
  });

  const getThunderstormConfig = () => ({
    particles: {
      number: { value: 2 },
      color: { value: "#ffff00" },
      shape: { type: "triangle" },
      size: {
        value: { min: 10, max: 20 },
      },
      move: {
        direction: "bottom",
        speed: 30,
        straight: true,
      },
      line_linked: { enable: false },
    },
    background: { enable: false },
  });

  const getParticlesConfig = () => {
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      return getRainConfig();
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return getSnowConfig();
    }
    if ([95, 96, 99].includes(weatherCode)) {
      return getThunderstormConfig();
    }
    return null;
  };

  const config = getParticlesConfig();
  if (!config) return null;

  return (
    <Particles
      id="weather-particles"
      init={particlesInit}
      options={config}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
};