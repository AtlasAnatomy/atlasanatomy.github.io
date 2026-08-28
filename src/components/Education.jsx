import { educations } from '../constants';
import { SectionWrapper } from '../hoc';
import SectionHeading from './SectionHeading';
import Timeline from './Timeline';

const Education = () => (
  <>
    <SectionHeading eyebrow="Where I studied" title="Education." />
    <Timeline items={educations} />
  </>
);

export default SectionWrapper(Education, 'education');
