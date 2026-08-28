
import { BrowserRouter } from "react-router-dom";

import {About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Research, StarsCanvas} from './components';
import Education from "./components/Education";

const App = () => {

  return (
    <BrowserRouter>
     <div className='relative z-0 bg-primary'>
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Research />
      <Feedbacks />
      <Education />
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas/>
      </div>

     </div>
    </BrowserRouter>
  )
}

export default App
