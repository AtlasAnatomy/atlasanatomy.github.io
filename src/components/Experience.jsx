import { experiences } from '../constants';
import { SectionWrapper } from '../hoc';
import SectionHeading from './SectionHeading';
import Timeline from './Timeline';

const Experience = () => (
  <>
    <SectionHeading eyebrow="What I have done so far" title="Work.">
      Research posts, a consultancy, a company I co-founded, and the teaching that runs alongside
      all of it. The through-line is the same: a process that can be modelled, and software that
      makes the model useful to someone.
    </SectionHeading>

    <Timeline items={experiences} />
  </>
);

export default SectionWrapper(Experience, 'work');
