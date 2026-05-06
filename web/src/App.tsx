import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Mission } from "./components/Mission";
import { Capabilities } from "./components/Capabilities";
import { Simulator } from "./components/Simulator";
import { RoboticsAI } from "./components/RoboticsAI";
import { Construction } from "./components/Construction";
import { Development } from "./components/Development";
import { Manifesto } from "./components/Manifesto";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="grain relative min-h-screen bg-bone text-ink">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Simulator />
        <Mission />
        <Capabilities />
        <RoboticsAI />
        <Construction />
        <Development />
        <Manifesto />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
