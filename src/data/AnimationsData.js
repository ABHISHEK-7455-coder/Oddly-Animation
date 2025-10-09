import WaveAnimation from './WaveAnimation';
import OrbitSpinner from './OrbitSpinner';
import MorphingBlob from './MorphingBlob';
import BouncingBars from './BouncingBars';

export const animations = [
    {
        id: "wave",
        title: "Wave Pulse",
        description: "Smooth pulsing wave of circles.",
        component: WaveAnimation,
    },
    {
        id: "orbit",
        title: "Orbit Spinner",
        description: "Orbiting circular motion.",
        component: OrbitSpinner,
    },
    {
        id: "blob",
        title: "Morphing Blob",
        description: "A satisfying blob that morphs endlessly.",
        component: MorphingBlob,
    },
    {
        id: "bars",
        title: "Bouncing Bars",
        description: "A clean visual of audio-style bouncing bars.",
        component: BouncingBars,
    }
];
