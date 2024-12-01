import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

interface RainEffectProps {
  isDark: boolean;
}

export const RainEffect: React.FC<RainEffectProps> = ({ isDark }) => {
  const particlesInit = React.useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="rain-particles"
      init={particlesInit}
      options={{
        fullScreen: false,
        particles: {
          number: {
            value: 200,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: isDark ? "#ffffff" : "#6b7280"
          },
          shape: {
            type: "line"
          },
          size: {
            value: { min: 1, max: 3 },
            random: true
          },
          move: {
            enable: true,
            speed: 20,
            direction: "bottom",
            straight: true,
            outModes: "out"
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            random: true
          },
          tilt: {
            direction: "right",
            enable: true,
            random: true,
            value: {
              min: 0,
              max: 15
            }
          },
          wobble: {
            enable: true,
            distance: 2,
            speed: 2
          }
        },
        background: {
          color: {
            value: "transparent"
          }
        }
      }}
      className="absolute inset-0 pointer-events-none"
    />
  );
};