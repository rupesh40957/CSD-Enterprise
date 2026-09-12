const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

async function update() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("csd_enterprises");

  const cards = [
    {
      id: "establishment",
      title: "Establishment",
      description:
        "We are system integrator was formed in 2019 and dedicated to delivering exceptional products and services to our clients offshore and onshore.",
      image: "/images/about/establishment.jpg",
    },
    {
      id: "vision",
      title: "Our Vision",
      description:
        "Our vision is to provide top-notch services & we strive to provide outstanding solutions that exceed client expectations and foster long-term relationships.",
      image: "/images/about/vision.jpg",
    },
    {
      id: "approach",
      title: "Our Approach",
      description:
        "We take a personalized approach to each client's needs, working closely with them to understand their unique challenges and develop customized solutions.",
      image: "/images/about/approach.svg",
    },
    {
      id: "expertise",
      title: "Our Expertise",
      description:
        "We have experienced and expert professionals in PLC, SCADA, CCTV Surveillance System, IT & Networking Infrastructure, Hydrometeorology & Satcom for offshore & onshore locations.",
      image: "/images/about/expertise.svg",
    },
    {
      id: "management",
      title: "Management & Employees",
      description:
        "Our management provides strategic direction, while our employees are dedicated to executing our vision with precision and care. Together, we work collaboratively to drive innovation, quality, and customer satisfaction.",
      image: "/images/about/management.svg",
    },
    {
      id: "core-values",
      title: "Our Core Values",
      description:
        "Upholding the highest ethical standards, operational safety, and engineering excellence across every mission-critical deployment.",
      image: "/images/about/core-values.svg",
      list: ["Integrity", "Excellence", "Collaboration", "Innovation"],
    },
  ];

  await db.collection("aboutContent").updateOne(
    {},
    {
      $set: {
        badge: "Company Profile & Ethos",
        heading: "About Us",
        description:
          "We are system integrator was formed in 2019 and dedicated to delivering exceptional products and services to our clients offshore and onshore.",
        visionTitle: "Our Vision",
        visionDescription:
          "Our vision is to provide top-notch services & we strive to provide outstanding solutions that exceed client expectations and foster long-term relationships.",
        experienceBadge: "Established 2019",
        statsOffshore: "Offshore",
        statsOffshoreSub: "CCTV Surveillance System, IT & Networking Infrastructure",
        statsOnshore: "Onshore",
        statsOnshoreSub: "Hydrometeorology & Satcom for offshore & onshore locations",
        establishmentImage: "/images/about/establishment.jpg",
        visionImage: "/images/about/vision.jpg",
        approachImage: "/images/about/approach.svg",
        expertiseImage: "/images/about/expertise.svg",
        managementImage: "/images/about/management.svg",
        coreValuesImage: "/images/about/core-values.svg",
        cards: cards,
        coreValues: [
          {
            icon: "ShieldCheck",
            title: "Integrity",
            description: "Uncompromised compliance, honesty, and safety standards.",
            highlight: "Ethical Engineering",
            color: "from-blue-500/20 to-cyan-500/20 text-cyan-400",
          },
          {
            icon: "Star",
            title: "Excellence",
            description: "Superior performance adhering to global industrial standards.",
            highlight: "Precision Quality",
            color: "from-amber-500/20 to-orange-500/20 text-amber-400",
          },
          {
            icon: "Users",
            title: "Collaboration",
            description: "Fostering trusted, enduring partnerships nationwide.",
            highlight: "Client Alignment",
            color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
          },
          {
            icon: "Cpu",
            title: "Innovation",
            description: "Harnessing next-gen automation, satellite satcom, and telemetry.",
            highlight: "Industry 4.0",
            color: "from-purple-500/20 to-cyan-500/20 text-purple-400",
          },
        ],
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log("MongoDB aboutContent updated with 6 visual cards and images!");
  await client.close();
}

update().catch(console.error);
