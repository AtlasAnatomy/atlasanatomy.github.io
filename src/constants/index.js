import profile from "../assets/profile.png";
import {
    mobile,
    backend,
    creator,
    web,
    adobe,
    C,
    chatgpt,
    cplex,
    java,
    moodle,
    mysql,
    office,
    python,
    wordpress,
    css,
    html,
    romatre,
    cfl,
    ministero,
    trenitalia,
    torvergata,
    tu,
    ewg,
    its,
    paper1,
    paper2,
    paper3,
    paper4,
    paper5,
    paper6,
    paper7,
    paper8
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "Research",
      title: "Research",
    },
    {
      id: "Education",
      title: "Education",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Algorithm Developer",
      icon: web,
    },
    {
      title: "Machine Learning",
      icon: mobile,
    },
    {
      title: "Operations Research",
      icon: backend,
    },
    {
      title: "Data Scientist",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "Python",
      icon: python,
    },
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "C",
      icon: C,
    },
    {
      name: "MySQL",
      icon: mysql,
    },
    {
      name: "Java",
      icon: java,
    },
    {
      name: "Cplex",
      icon: cplex,
    },
    {
      name: "Office365",
      icon: office,
    },
    {
      name: "Moodle",
      icon: moodle,
    },
    {
      name: "Adobe Set",
      icon: adobe,
    },
    {
      name: "Wordpress",
      icon: wordpress,
    },
    {
      name: "ChatGPT/Gemini/CoPilot",
      icon: chatgpt,
    },
  ];
  
  const experiences = [
    {
      title: "Researcher",
      company_name: "CFL Multimodal & UniLu",
      icon: cfl,
      iconBg: "#E6DEDD",
      date: "Sep 2021 - Jan 2022",
      points: [
        "Developing OR and ML-based optimization algorithms for shunting operations at Bettembourg Terminal.",
        "Collaborating with cross-functional teams for the European Project 'ANTOINE' (University of Luxembourg - CFL - Luxembourg National Research Fund)",
        "Implementing event-based simulators using Python, SQL, Excel and other related technologies.",
      ],
    },
    {
      title: "Innovation Manager",
      company_name: "RDC - Research & Development Consulting - S.R.L.",
      icon: ministero,
      iconBg: "#0066cc",
      date: "Oct 2023 - Present",
      points: [
        "Creating detailed flowcharts to map and optimize complex processes.",
        "Leading digitalization initiatives to streamline and improve operational efficiency.",
        "Overseeing and managing innovative projects to drive technological advancements and business improvements.",
      ],
    },
    {
      title: "Researcher",
      company_name: "Trenitalia & La Sapienza",
      icon: trenitalia,
      iconBg: "#E6DEDD",
      date: "Sep 2019 - Apr 2020",
      points: [
        "Developing OR optimization algorithms for generating train calendar description from bit maps",
        "Collaborating with cross-functional teams including product managers, and other developers to create high-quality products.",
        "Implementing heuristic algorithms using C, Cplex, Excel and other related technologies.",
      ],
    },
    {
      title: "Researcher",
      company_name: "Volvo & TU Delft",
      icon: tu,
      iconBg: "#15A3D2",
      date: "Sep 2022 - Oct 2023",
      points: [
        "Developing OR optimization algorithms to schedule mixed fleet of electric and hybrid buses.",
        "Collaborating with cross-functional teams including product managers, and other developers to create high-quality products.",
        "Implementing metaheuristic algorithms using Python, Cplex, Excel and other related technologies.",
      ],
    },
    {
      title: "Academic Advisor/ex-Alumni Board",
      company_name: "Roma Tre University",
      icon: romatre,
      iconBg: "#E6DEDD",
      date: "Sep 2022 - Present",
      points: [
        "Conducting lessons, exercises, and seminars for integrative teaching and tutoring.",
        "Receiving and assisting students with their academic needs.",
        "Participating in midterm and final exams throughout the academic year.",
        "Planning and organizing educational activities by developing and maintaining educational platforms using Moodle, HTML, CSS and other related technologies.",
      ],
    },
    {
      title: "Member",
      company_name: "Euro & AIRO",
      icon: ewg,
      iconBg: "#E6DEDD",
      date: "Aug 2020 - Present",
      points: [
        "Engaging as a speaker and lecturer at international conferences organized by EURO and AIRO, contributing to ongoing discussions and sharing insights.",
        "Continuously organizing and facilitating workshops for various audiences, fostering learning and skill development.",
        "Actively participating in round table discussions and brainstorming sessions, fostering collaboration and idea exchange.",
      ],
    },
    {
      title: "Scientific-Educational Coordinator",
      company_name: "ITS ECO-STEM Generation",
      icon: its,
      iconBg: "#E6DEDD",
      date: "Oct 2023 - Present",
      points: [
        "Coordinating the educational line to ensure high-quality courses within the ITS.",
        "Ongoing communication with companies to establish collaborations and enhance student experiences through traineeships.",
        "Teaching modules in Computer Science and Mathematics.",
        "Implementing the educational platform using Moodle, HTML, and CSS to improve the learning experience for students.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "The research showcases the candidate's exceptional scholarly depth and collaborative prowess, warranting endorsement for the Ph.D. title and future research endeavors.",
      name: "Francesco Viti",
      designation: "Associate Professor",
      company: "UniLU",
      image: profile,
    },
    {
      testimonial:
        "Tommaso has showcased outstanding abilities in independent and collaborative research, demonstrating curiosity, efficiency, innovative problem-solving skills, and rigorous presentation.",
      name: "Andrea D'Ariano",
      designation: "Full Professor",
      company: "Roma Tre Uni",
      image: profile,
    },
    {
      testimonial:
        "Every research component in the thesis demonstrates originality, enhances disciplinary knowledge, and adheres to rigorous methodology, strongly meeting international dissertation standards.",
      name: "Taku Fujiyama",
      designation: "Full Professor",
      company: "University College London",
      image: profile,
    },
  ];
  
  const projects = [
    {
      name: "OR Model for Shunting",
      description:
        "The research presents models to optimize freight rail shunting, emphasizing emissions and cost reduction while ensuring service quality. Tested with real data, it highlights the impact of wagon selection criteria on performance.",
      tags: [
        {
          name: "OR",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "LaTex",
          color: "pink-text-gradient",
        },
      ],
      image: paper1,
      source_code_link: "https://www.sciencedirect.com/science/article/pii/S0360835223008896?via%3Dihub",
    },
    {
      name: "E-based Simulator for Shunting",
      description:
        "The study explores how mileage-based maintenance affects freight train and shunting operations, proposing four Shunt-In policies. Simulations using Bettembourg Multimodal Terminal data indicate significant impacts, including an 11% increase in shunting operations and substantial underestimation of fleet size and mileage compared to a No-Maintenance scenario.",
      tags: [
        {
          name: "OR & ML",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "Scikit-learn",
          color: "pink-text-gradient",
        },
      ],
      image: paper2,
      source_code_link: "https://www.sciencedirect.com/science/article/pii/S2210970623000628",
    },
    {
      name: "Arrival Delay Time Prediction",
      description:
        "The study creates data-driven models to predict short-term arrival delays in freight rail operations, with the lightGBM model outperforming others. Key predictors include departure delay time, trip distance, and train composition, aiding operators in mitigating disruptions and planning future operations efficiently.",
      tags: [
        {
          name: "ML",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "Scikit-learn",
          color: "pink-text-gradient",
        },
      ],
      image: paper3,
      source_code_link: "https://ieeexplore.ieee.org/document/10122504",
    },
    {
      name: "Scheduling of Passenger Trains",
      description:
        "The study extends the train platforming problem to optimize train and locomotive routing and scheduling simultaneously. It employs 0-1 integer programming and dual decomposition methods (LR and ADMM) for efficient solution. A case study at Guangzhou railway station validates the proposed approach's efficiency and effectiveness.",
      tags: [
        {
          name: "OR",
          color: "blue-text-gradient",
        },
        {
          name: "MatLab",
          color: "green-text-gradient",
        },
        {
          name: "LaTex",
          color: "pink-text-gradient",
        },
      ],
      image: paper4,
      source_code_link: "https://www.sciencedirect.com/science/article/pii/S0968090X23001493?via%3Dihub",
    },
    {
      name: "Scheduling Electric Bus Fleet",
      description:
        "The study tackles scalability issues in electric bus scheduling with a novel Repeated Local Search (RLS) for full-size instances, considering fleet assignment, charging, and infrastructure constraints. Two metaheuristics, Simulated Annealing and Genetic Algorithm, build on RLS solutions. Results show scalability improvements and solution effectiveness, with diminishing gains as bus fleets electrify in larger urban settings.",
      tags: [
        {
          name: "OR",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "HTML & CSS",
          color: "pink-text-gradient",
        },
      ],
      image: paper5,
      source_code_link: "https://www.travisions.eu/TRAVisions/young_researcher_results_2024/#:~:text=Optimizing%20Mixed%2DFleet%20Multi%2DTerminal%20Electric%20Bus%20Schedules%20with%20Cutting%2DEdge%20Metaheuristics",
    },
    {
      name: "Train Travel Time Prediction",
      description:
        "The study introduces T.R2_LSTM_A, a two-stage transfer learning model, enhancing China-Europe Railway Express (CRE) train travel time predictions. By incorporating attention mechanisms and LSTM networks, it effectively captures time series data characteristics, outperforming other methods in a real-life CRE case study.",
      tags: [
        {
          name: "OR & ML",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "Scikit-learn",
          color: "pink-text-gradient",
        },
      ],
      image: paper6,
      source_code_link: "https://www.sciencedirect.com/science/article/pii/S0957417424008558?via%3Dihub",
    },
    {
      name: "Train-to-Train Rescue",
      description:
        "The paper proposes a train rescheduling approach for metro systems during breakdowns, incorporating train-to-train rescue procedures. Simultaneous timetable and rolling stock rescheduling is addressed, with simulations validating effectiveness using real-world data from Beijing metro Yizhuang line.",
      tags: [
        {
          name: "OR",
          color: "blue-text-gradient",
        },
        {
          name: "Python",
          color: "green-text-gradient",
        },
        {
          name: "Cplex",
          color: "pink-text-gradient",
        },
      ],
      image: paper7,
      source_code_link: "https://ieeexplore.ieee.org/document/10528265",
    },
    {
      name: "Train Calendar Generation",
      description:
        "The paper offers a linear programming model and heuristic algorithm for generating descriptive sentences from train calendars for user queries. The algorithm, based on 'Divide and Conquer,' efficiently processes calendar periods, ensuring consistent computation time even with increased complexity, and yields high-quality solutions.",
      tags: [
        {
          name: "OR & NLP",
          color: "blue-text-gradient",
        },
        {
          name: "C",
          color: "green-text-gradient",
        },
        {
          name: "LaTex",
          color: "pink-text-gradient",
        },
      ],
      image: paper8,
      source_code_link: "https://onlinelibrary.wiley.com/doi/full/10.1155/2021/4664010",
    },
  ];

  const educations = [
    {
      title: "Ph.D. in Computer Science and Automation",
      company_name: "Roma Tre University - Department of Engineering",
      icon: romatre,
      iconBg: "#E6DEDD",
      date: "Oct 2020 - Apr 2024",
      points: [
        "Engaged in collaborative projects with universities worldwide, including UniLu, TU Delft, La Sapienza, and Beijing Jiatong University.",
        "Fostered partnerships with renowned European companies such as Trenitalia, CFL Multimodal, and Volvo.",
        "Published 8 journal papers, including those featured in leading publications, alongside presenting 11 conference papers.",
        "Successfully defended Ph.D. thesis with the highest degree of distinction.",
      ],
    },
    {
      title: "Master's Degree in Industrial and Automation Engineering",
      company_name: "Roma Tre University - Department of Engineering",
      icon: romatre,
      iconBg: "#E6DEDD",
      date: "Sep 2017 - Jul 2020",
      points: [
        "Final Grade: 108/110.",
        "Thesis: A Fast and Effective Greedy Heuristic for On-line Train Calendars Generation.",
      ],
    },
    {
      title: "Bachelor's Degree in Industrial Engineering",
      company_name: "University of Rome 'Tor Vergata'",
      icon: torvergata,
      iconBg: "#E6DEDD",
      date: "Oct 2012 - Jul 2016",
      points: [
      ],
    },
  ];
  
  export { services, technologies, experiences, educations, testimonials, projects };