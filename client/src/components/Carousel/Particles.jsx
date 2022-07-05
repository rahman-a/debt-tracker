import React from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const ParticlesComponent = () => {
  const particlesInit = async (main) => {
    console.log(main)

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main)
  }

  const particlesOption = {
    background: {
      color: {
        value: '#212529',
      },
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40,
        },
        push: { particles_nb: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#1a374d4d' },
      links: {
        color: '#1a374d4d',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        bounce: false,
        direction: 'none',
        enable: true,
        outMode: 'bounce',
        random: false,
        speed: 2,
        straight: false,
      },
      number: { density: { enable: true, value_area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { random: true, value: 5 },
    },
    detectRetina: true,
  }
  return (
    <Particles
      id='tsparticles'
      style={{ zIndex: -1 }}
      options={particlesOption}
    />
  )
}

export default ParticlesComponent
