var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/store.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// src/data/curriculum.ts
var INITIAL_SUBSCRIPTION_CONFIG = {
  yearlyPriceDZD: 2500,
  monthlyPriceDZD: 500,
  freeTrialDays: 7,
  ccpNumber: "0023489123",
  ccpKey: "45",
  ccpHolder: "PharmedQuest Education Alg\xE9rie",
  baridiMobRip: "00799999002348912345",
  baridiMobPhone: "+213 555 12 34 56",
  activeAnnouncementFr: "\u{1F4E2} Concours de R\xE9sidanat 2024 : 150 nouveaux QCMs officiels d'Alger et d'Oran viennent d'\xEAtre ajout\xE9s !",
  activeAnnouncementEn: "\u{1F4E2} Residency Exam 2024: 150 new official MCQs from Algiers & Oran faculties have been added!",
  announcementEnabled: true
};
var PROFESSIONS = [
  {
    id: "pharmacy",
    nameFr: "Pharmacie",
    nameEn: "Pharmacy",
    subtitleFr: "Cursus universitaire de 5 ans \u2022 Pr\xE9paration aux EMDs & R\xE9sidanat",
    subtitleEn: "5-year university curriculum \u2022 EMDs & Residency exam prep",
    totalYears: 5,
    icon: "pill",
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: "medicine",
    nameFr: "M\xE9decine",
    nameEn: "Medicine",
    subtitleFr: "Cursus universitaire de 6 ans \u2022 Pr\xE9paration aux stages & R\xE9sidanat",
    subtitleEn: "6-year university curriculum \u2022 Clinical rotations & Residency exam prep",
    totalYears: 6,
    icon: "stethoscope",
    color: "from-cyan-600 to-blue-700"
  }
];
var ACADEMIC_YEARS = [
  // Pharmacy (1st to 5th Year)
  {
    id: "pharmacy-1",
    professionId: "pharmacy",
    yearNumber: 1,
    labelFr: "1\xE8re Ann\xE9e Pharmacie",
    labelEn: "1st Year Pharmacy",
    descriptionFr: "Chimie g\xE9n\xE9rale, Biologie cellulaire, Anatomie, Math\xE9matiques & Biophysique",
    descriptionEn: "General Chemistry, Cell Biology, Anatomy, Mathematics & Biophysics",
    modulesCount: 4
  },
  {
    id: "pharmacy-2",
    professionId: "pharmacy",
    yearNumber: 2,
    labelFr: "2\xE8me Ann\xE9e Pharmacie",
    labelEn: "2nd Year Pharmacy",
    descriptionFr: "Chimie organique, Physiologie, Botanique m\xE9dicale, G\xE9n\xE9tique",
    descriptionEn: "Organic Chemistry, Physiology, Medical Botany, Genetics",
    modulesCount: 4
  },
  {
    id: "pharmacy-3",
    professionId: "pharmacy",
    yearNumber: 3,
    labelFr: "3\xE8me Ann\xE9e Pharmacie",
    labelEn: "3rd Year Pharmacy",
    descriptionFr: "Pharmacologie g\xE9n\xE9rale & sp\xE9ciale, Pharmacie Gal\xE9nique, Biochimie clinique",
    descriptionEn: "General & Special Pharmacology, Galenic Pharmacy, Clinical Biochemistry",
    modulesCount: 6
  },
  {
    id: "pharmacy-4",
    professionId: "pharmacy",
    yearNumber: 4,
    labelFr: "4\xE8me Ann\xE9e Pharmacie",
    labelEn: "4th Year Pharmacy",
    descriptionFr: "Toxicologie, Chimie Th\xE9rapeutique, Microbiologie, Immunologie",
    descriptionEn: "Toxicology, Medicinal Chemistry, Microbiology, Immunology",
    modulesCount: 5
  },
  {
    id: "pharmacy-5",
    professionId: "pharmacy",
    yearNumber: 5,
    labelFr: "5\xE8me Ann\xE9e Pharmacie",
    labelEn: "5th Year Pharmacy",
    descriptionFr: "Pharmacie clinique, Pharmacovigilance, L\xE9gislation, Pr\xE9paration R\xE9sidanat",
    descriptionEn: "Clinical Pharmacy, Pharmacovigilance, Law & Ethics, Residency prep",
    modulesCount: 5
  },
  // Medicine (1st to 6th Year)
  {
    id: "medicine-1",
    professionId: "medicine",
    yearNumber: 1,
    labelFr: "1\xE8re Ann\xE9e M\xE9decine",
    labelEn: "1st Year Medicine",
    descriptionFr: "Anatomie descriptive, Embryologie, Histologie, Chimie & Biophysique",
    descriptionEn: "Descriptive Anatomy, Embryology, Histology, Chemistry & Biophysics",
    modulesCount: 4
  },
  {
    id: "medicine-2",
    professionId: "medicine",
    yearNumber: 2,
    labelFr: "2\xE8me Ann\xE9e M\xE9decine",
    labelEn: "2nd Year Medicine",
    descriptionFr: "Physiologie g\xE9n\xE9rale, Anatomie pathologique, S\xE9miologie m\xE9dicale",
    descriptionEn: "General Physiology, Histopathology, Medical Semioclinic",
    modulesCount: 4
  },
  {
    id: "medicine-3",
    professionId: "medicine",
    yearNumber: 3,
    labelFr: "3\xE8me Ann\xE9e M\xE9decine",
    labelEn: "3rd Year Medicine",
    descriptionFr: "Cardiologie, Pneumologie, Gastro-ent\xE9rologie, N\xE9phrologie, H\xE9matologie",
    descriptionEn: "Cardiology, Pulmonology, Gastroenterology, Nephrology, Hematology",
    modulesCount: 6
  },
  {
    id: "medicine-4",
    professionId: "medicine",
    yearNumber: 4,
    labelFr: "4\xE8me Ann\xE9e M\xE9decine",
    labelEn: "4th Year Medicine",
    descriptionFr: "Neurologie, Maladies infectieuses, Endocrinologie, Rhumatologie",
    descriptionEn: "Neurology, Infectious Diseases, Endocrinology, Rheumatology",
    modulesCount: 5
  },
  {
    id: "medicine-5",
    professionId: "medicine",
    yearNumber: 5,
    labelFr: "5\xE8me Ann\xE9e M\xE9decine",
    labelEn: "5th Year Medicine",
    descriptionFr: "P\xE9diatrie, Gyn\xE9cologie-Obst\xE9trique, Psychiatrie, Dermatologie",
    descriptionEn: "Pediatrics, Gynecology-Obstetrics, Psychiatry, Dermatology",
    modulesCount: 5
  },
  {
    id: "medicine-6",
    professionId: "medicine",
    yearNumber: 6,
    labelFr: "6\xE8me Ann\xE9e M\xE9decine",
    labelEn: "6th Year Medicine",
    descriptionFr: "Urgences, R\xE9animation, M\xE9decine l\xE9gale, Synth\xE8se clinique & R\xE9sidanat",
    descriptionEn: "Emergency Medicine, Intensive Care, Forensic Medicine, Residency Synthesis",
    modulesCount: 5
  }
];
var SUBJECT_MODULES = [
  // Pharmacy 3rd Year
  {
    id: "pharm-3-pharmacology",
    academicYearId: "pharmacy-3",
    professionId: "pharmacy",
    yearNumber: 3,
    titleFr: "Pharmacologie",
    titleEn: "Pharmacology",
    code: "PHARM-301",
    icon: "pill",
    color: "teal",
    descriptionFr: "Pharmacodynamie, AINS, antibiotiques, cardiovasculaire et syst\xE8me nerveux.",
    descriptionEn: "Pharmacodynamics, NSAIDs, antibiotics, cardiovascular, and nervous system.",
    lessonsCount: 5,
    questionCount: 140,
    isPopular: true
  },
  {
    id: "pharm-3-galenic",
    academicYearId: "pharmacy-3",
    professionId: "pharmacy",
    yearNumber: 3,
    titleFr: "Pharmacie Gal\xE9nique",
    titleEn: "Galenic Pharmacy",
    code: "PHARM-302",
    icon: "flask",
    color: "emerald",
    descriptionFr: "Formes pharmaceutiques, biodisponibilit\xE9, comprim\xE9s, injectables et st\xE9rilisation.",
    descriptionEn: "Pharmaceutical dosage forms, bioavailability, tablets, parenterals, and sterilization.",
    lessonsCount: 4,
    questionCount: 95
  },
  {
    id: "pharm-3-biochem",
    academicYearId: "pharmacy-3",
    professionId: "pharmacy",
    yearNumber: 3,
    titleFr: "Biochimie Clinique",
    titleEn: "Clinical Biochemistry",
    code: "PHARM-303",
    icon: "dna",
    color: "sky",
    descriptionFr: "M\xE9tabolisme glucidique, lipidique, prot\xE9ique et enzymologie clinique.",
    descriptionEn: "Carbohydrate, lipid, and protein metabolism, and clinical enzymology.",
    lessonsCount: 4,
    questionCount: 88
  },
  {
    id: "pharm-3-semiologie",
    academicYearId: "pharmacy-3",
    professionId: "pharmacy",
    yearNumber: 3,
    titleFr: "S\xE9miologie M\xE9dicale",
    titleEn: "Medical Semioclinic",
    code: "PHARM-304",
    icon: "activity",
    color: "amber",
    descriptionFr: "Signes cliniques, examens physiques et diagnostics biologiques.",
    descriptionEn: "Clinical signs, physical examination, and biological diagnostics.",
    lessonsCount: 3,
    questionCount: 72
  },
  // Pharmacy 4th Year
  {
    id: "pharm-4-toxicology",
    academicYearId: "pharmacy-4",
    professionId: "pharmacy",
    yearNumber: 4,
    titleFr: "Toxicologie",
    titleEn: "Toxicology",
    code: "PHARM-401",
    icon: "shield-alert",
    color: "rose",
    descriptionFr: "Toxiques gazeux, m\xE9taux lourds, pesticides, drogues et toxicologie d urgence.",
    descriptionEn: "Gaseous poisons, heavy metals, pesticides, illicit drugs, and emergency tox.",
    lessonsCount: 4,
    questionCount: 110,
    isPopular: true
  },
  {
    id: "pharm-4-chimie-therap",
    academicYearId: "pharmacy-4",
    professionId: "pharmacy",
    yearNumber: 4,
    titleFr: "Chimie Th\xE9rapeutique",
    titleEn: "Medicinal Chemistry",
    code: "PHARM-402",
    icon: "atom",
    color: "indigo",
    descriptionFr: "Relations structure-activit\xE9, synth\xE8se et m\xE9tabolisme des principes actifs.",
    descriptionEn: "Structure-activity relationships, synthesis, and metabolic pathways of active drugs.",
    lessonsCount: 4,
    questionCount: 85
  },
  // Medicine 3rd Year
  {
    id: "med-3-cardio",
    academicYearId: "medicine-3",
    professionId: "medicine",
    yearNumber: 3,
    titleFr: "Cardiologie",
    titleEn: "Cardiology",
    code: "MED-301",
    icon: "heart-pulse",
    color: "rose",
    descriptionFr: "Insuffisance cardiaque, HTA, Syndromes coronariens aigus et Valvulopathies.",
    descriptionEn: "Heart failure, Hypertension, Acute coronary syndromes, and Valvulopathies.",
    lessonsCount: 5,
    questionCount: 165,
    isPopular: true
  },
  {
    id: "med-3-pneumo",
    academicYearId: "medicine-3",
    professionId: "medicine",
    yearNumber: 3,
    titleFr: "Pneumologie",
    titleEn: "Pulmonology",
    code: "MED-302",
    icon: "wind",
    color: "cyan",
    descriptionFr: "Asthme, BPCO, Pneumopathies infectieuses et Tuberculose pulmonaire.",
    descriptionEn: "Asthma, COPD, Community-acquired pneumonia, and Pulmonary tuberculosis.",
    lessonsCount: 4,
    questionCount: 120,
    isPopular: true
  },
  {
    id: "med-3-gastro",
    academicYearId: "medicine-3",
    professionId: "medicine",
    yearNumber: 3,
    titleFr: "Gastro-Ent\xE9rologie",
    titleEn: "Gastroenterology",
    code: "MED-303",
    icon: "utensils",
    color: "amber",
    descriptionFr: "Ulc\xE8re gastro-duod\xE9nal, Cirrhose, H\xE9patites et H\xE9morragies digestives.",
    descriptionEn: "Peptic ulcer disease, Liver cirrhosis, Viral hepatitis, and GI bleedings.",
    lessonsCount: 4,
    questionCount: 95
  },
  {
    id: "med-3-nephro",
    academicYearId: "medicine-3",
    professionId: "medicine",
    yearNumber: 3,
    titleFr: "N\xE9phrologie",
    titleEn: "Nephrology",
    code: "MED-304",
    icon: "droplets",
    color: "blue",
    descriptionFr: "Insuffisance r\xE9nale aigu\xEB et chronique, N\xE9phropathies glom\xE9rulaires.",
    descriptionEn: "Acute kidney injury, Chronic kidney disease, Glomerulopathies.",
    lessonsCount: 3,
    questionCount: 80
  }
];
var LESSON_CHAPTERS = [
  // Under Pharmacy 3rd Year -> Pharmacology
  {
    id: "pharm-3-pharmaco-nsaid",
    moduleId: "pharm-3-pharmacology",
    titleFr: "Anti-inflammatoires Non St\xE9ro\xEFdiens (AINS) & Cortico\xEFdes",
    titleEn: "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) & Corticosteroids",
    questionCount: 28,
    estimatedMinutes: 25,
    downloadSize: "1.4 MB",
    isDownloaded: true,
    order: 1
  },
  {
    id: "pharm-3-pharmaco-antibiotics",
    moduleId: "pharm-3-pharmacology",
    titleFr: "Antibiotiques : B\xEAta-lactamines, Aminosides & Macrolides",
    titleEn: "Antibiotics: Beta-lactams, Aminoglycosides & Macrolides",
    questionCount: 35,
    estimatedMinutes: 30,
    downloadSize: "2.1 MB",
    isDownloaded: true,
    order: 2
  },
  {
    id: "pharm-3-pharmaco-cardio",
    moduleId: "pharm-3-pharmacology",
    titleFr: "M\xE9dicaments du Syst\xE8me Cardiovasculaire (B\xEAta-bloquants, IEC, ARA-II)",
    titleEn: "Cardiovascular Pharmacology (Beta-blockers, ACE inhibitors, ARBs)",
    questionCount: 32,
    estimatedMinutes: 30,
    downloadSize: "1.8 MB",
    isDownloaded: false,
    order: 3
  },
  {
    id: "pharm-3-pharmaco-nervous",
    moduleId: "pharm-3-pharmacology",
    titleFr: "Syst\xE8me Nerveux Autonome (Sympathomim\xE9tiques & Parasympatholytiques)",
    titleEn: "Autonomic Nervous System (Sympathomimetics & Anticholinergics)",
    questionCount: 24,
    estimatedMinutes: 20,
    downloadSize: "1.2 MB",
    isDownloaded: false,
    order: 4
  },
  {
    id: "pharm-3-pharmaco-pk",
    moduleId: "pharm-3-pharmacology",
    titleFr: "Pharmacocin\xE9tique Fondamentale (ADME, Clairance, Demi-vie)",
    titleEn: "Fundamental Pharmacokinetics (ADME, Clearance, Half-life)",
    questionCount: 21,
    estimatedMinutes: 20,
    downloadSize: "1.1 MB",
    isDownloaded: false,
    order: 5
  },
  // Under Medicine 3rd Year -> Cardiology
  {
    id: "med-3-cardio-heart-failure",
    moduleId: "med-3-cardio",
    titleFr: "Insuffisance Cardiaque Aigu\xEB & Chronique",
    titleEn: "Acute & Chronic Heart Failure",
    questionCount: 35,
    estimatedMinutes: 30,
    downloadSize: "2.4 MB",
    isDownloaded: true,
    order: 1
  },
  {
    id: "med-3-cardio-sca",
    moduleId: "med-3-cardio",
    titleFr: "Syndromes Coronariens Aigus (SCA ST+ et ST-)",
    titleEn: "Acute Coronary Syndromes (STEMI and NSTEMI)",
    questionCount: 40,
    estimatedMinutes: 35,
    downloadSize: "2.6 MB",
    isDownloaded: true,
    order: 2
  },
  {
    id: "med-3-cardio-hta",
    moduleId: "med-3-cardio",
    titleFr: "Hypertension Art\xE9rielle de l Adulte (HTA essentielle & secondaire)",
    titleEn: "Adult Arterial Hypertension (Essential & Secondary)",
    questionCount: 30,
    estimatedMinutes: 25,
    downloadSize: "1.7 MB",
    isDownloaded: false,
    order: 3
  }
];
var MCQ_QUESTIONS = [
  // Question 1: NSAIDs
  {
    id: "q-pharm-nsaid-01",
    lessonId: "pharm-3-pharmaco-nsaid",
    moduleId: "pharm-3-pharmacology",
    facultySource: "Facult\xE9 de M\xE9decine et Pharmacie d Alger - Concours de R\xE9sidanat 2023",
    examYear: 2023,
    questionTextFr: "Concernant les Anti-inflammatoires Non St\xE9ro\xEFdiens (AINS) classiques (inhibiteurs non s\xE9lectifs des COX), quelle est la proposition EXACTE ?",
    questionTextEn: "Regarding classic Non-Steroidal Anti-Inflammatory Drugs (non-selective COX inhibitors), which of the following statements is CORRECT?",
    optionsFr: [
      "Ils stimulent la synth\xE8se de la prostaglandine E2 (PGE2) au niveau de la muqueuse gastrique.",
      "Leur action analg\xE9sique et antipyr\xE9tique est principalement li\xE9e \xE0 l inhibition de la COX-2 inductible.",
      "Ils sont formellement recommand\xE9s au cours du troisi\xE8me trimestre de la grossesse.",
      "Ils augmentent la filtration glom\xE9rulaire par vasodilatation de l art\xE9riole aff\xE9rente r\xE9nale.",
      "Ils n induisent aucune interaction avec les anticoagulants oraux antivitamine K (AVK)."
    ],
    optionsEn: [
      "They stimulate the synthesis of prostaglandin E2 (PGE2) in the gastric mucosa.",
      "Their analgesic and antipyretic efficacy is predominantly linked to the inhibition of inducible COX-2.",
      "They are formally recommended during the third trimester of pregnancy.",
      "They increase glomerular filtration by vasodilating the renal afferent arteriole.",
      "They do not interact with vitamin K antagonist (VKA) oral anticoagulants."
    ],
    correctOptionIndexes: [1],
    isMultipleChoice: false,
    explanationFr: "L effet th\xE9rapeutique anti-inflammatoire et antipyr\xE9tique est principalement d\xFB \xE0 l inhibition de la COX-2 (inductible lors de l inflammation), tandis que les effets ind\xE9sirables gastriques et r\xE9naux r\xE9sultent de l inhibition de la COX-1 constitutive (cytoprotectrice). Les AINS sont formellement contre-indiqu\xE9s \xE0 partir du d\xE9but du 6\xE8me mois (24 SA) en raison du risque de fermeture pr\xE9matur\xE9e du canal art\xE9riel et d insuffisance r\xE9nale f\u0153tale.",
    explanationEn: "The anti-inflammatory and antipyretic therapeutic actions are mainly driven by inhibiting inducible COX-2, whereas gastrointestinal and renal toxicities arise from inhibiting constitutive COX-1. NSAIDs are strictly contraindicated from the 24th gestational week due to risks of premature closure of the fetal ductus arteriosus and neonatal renal failure.",
    difficulty: "medium",
    comments: [
      {
        id: "c1",
        userName: "Kamel B. (R\xE9sident Alger)",
        userAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80",
        faculty: "Facult\xE9 d Alger",
        text: "Pi\xE8ge classique de r\xE9sidanat : la contre-indication absolue au 3\xE8me trimestre tombe quasiment chaque ann\xE9e !",
        timestamp: "Il y a 2 jours"
      },
      {
        id: "c2",
        userName: "Sara T.",
        userAvatar: "https://images.unsplash.com/photo-1594824813596-f5290b21fa75?auto=format&fit=crop&w=120&q=80",
        faculty: "Facult\xE9 d Oran",
        text: "Attention aussi \xE0 l interaction AINS + IEC qui pr\xE9cipite l insuffisance r\xE9nale aigu\xEB fonctionnelle.",
        timestamp: "Hier"
      }
    ]
  },
  // Question 2: NSAIDs renal & platelet
  {
    id: "q-pharm-nsaid-02",
    lessonId: "pharm-3-pharmaco-nsaid",
    moduleId: "pharm-3-pharmacology",
    facultySource: "Facult\xE9 de Pharmacie d Oran - EMD Pharmacologie 2022",
    examYear: 2022,
    questionTextFr: "L acide ac\xE9tylsalicylique (Aspirine) \xE0 faible dose (75 \xE0 160 mg/jour) exerce un effet antiagr\xE9gant plaquettaire prolong\xE9. Quel m\xE9canisme mol\xE9culaire explique la dur\xE9e de cet effet ?",
    questionTextEn: "Low-dose acetylsalicylic acid (Aspirin 75-160 mg/day) exerts a prolonged antiplatelet effect. Which molecular mechanism explains the duration of this effect?",
    optionsFr: [
      "L inhibition r\xE9versible et comp\xE9titive de la prostacycline synth\xE9tase endoth\xE9liale.",
      "L ac\xE9tylation irr\xE9versible de la s\xE9rine 529 de la COX-1 plaquettaire, anucl\xE9\xE9e et incapable de resynth\xE9tiser l enzyme.",
      "Le blocage direct et irr\xE9versible des r\xE9cepteurs P2Y12 de l ad\xE9nosine diphosphate (ADP).",
      "L induction d une synth\xE8se accrue de thromboxane A2 (TXA2) au niveau vasculaire.",
      "Une liaison covalente irr\xE9versible avec le complexe glycoprot\xE9ique GPIIb/IIIa."
    ],
    optionsEn: [
      "Reversible and competitive inhibition of endothelial prostacyclin synthetase.",
      "Irreversible acetylation of Serine 529 of platelet COX-1, which lack nuclei and cannot resynthesize the enzyme.",
      "Direct irreversible antagonism of adenosine diphosphate (ADP) P2Y12 receptors.",
      "Induction of increased thromboxane A2 (TXA2) synthesis in vascular beds.",
      "Irreversible covalent binding to the glycoprotein GPIIb/IIIa complex."
    ],
    correctOptionIndexes: [1],
    isMultipleChoice: false,
    explanationFr: "L aspirine ac\xE9tyle de mani\xE8re irr\xE9versible le r\xE9sidu S\xE9rine 529 de la COX-1. Comme les plaquettes sont des fragments cellulaires d\xE9pourvus de noyau, elles ne peuvent pas synth\xE9tiser de nouvelles mol\xE9cules de COX-1. L effet antiagr\xE9gant persiste donc toute la dur\xE9e de vie des plaquettes (7 \xE0 10 jours).",
    explanationEn: "Aspirin irreversibly acetylates the Serine 529 residue of COX-1. Because platelets lack a nucleus, they cannot synthesize new proteins or enzymes; therefore, TXA2 production is blocked for the entire lifespan of the platelet (7-10 days).",
    difficulty: "easy",
    comments: []
  },
  // Question 3: Beta-lactams
  {
    id: "q-pharm-antibio-01",
    lessonId: "pharm-3-pharmaco-antibiotics",
    moduleId: "pharm-3-pharmacology",
    facultySource: "Facult\xE9 de M\xE9decine de Constantine - R\xE9sidanat 2021",
    examYear: 2021,
    questionTextFr: "Parmi les associations antibiotiques suivantes, laquelle permet de surmonter la r\xE9sistance bact\xE9rienne par production de p\xE9nicillinase chez Staphylococcus aureus s\xE9cr\xE9teur ?",
    questionTextEn: "Among the following antibiotic regimens, which one successfully overcomes bacterial resistance driven by penicillinase production in penicillinase-producing Staphylococcus aureus?",
    optionsFr: [
      "Amoxicilline + Acide clavulanique",
      "Ampicilline + Gentamicine",
      "Ticarcilline + Colistine",
      "P\xE9nicilline G + Streptomycine",
      "C\xE9fotaxime + Vancomycine"
    ],
    optionsEn: [
      "Amoxicillin + Clavulanic acid",
      "Ampicillin + Gentamicin",
      "Ticarcillin + Colistin",
      "Penicillin G + Streptomycin",
      "Cefotaxime + Vancomycin"
    ],
    correctOptionIndexes: [0],
    isMultipleChoice: false,
    explanationFr: "L acide clavulanique est un inhibiteur suicide des b\xEAta-lactamases (p\xE9nicillinases). En s associant \xE0 l amoxicilline, il prot\xE8ge le noyau b\xEAta-lactame de l hydrolyse enzymatique bact\xE9rienne, restaurant ainsi le spectre antimicrobien.",
    explanationEn: "Clavulanic acid acts as a suicide inhibitor of beta-lactamases (penicillinases). By combining it with amoxicillin, it prevents enzymatic hydrolysis of the beta-lactam core, thereby restoring antibiotic efficacy against beta-lactamase-producing strains.",
    difficulty: "easy",
    comments: []
  },
  // Question 4: Cardiology (Heart Failure)
  {
    id: "q-med-cardio-01",
    lessonId: "med-3-cardio-heart-failure",
    moduleId: "med-3-cardio",
    facultySource: "Facult\xE9 de M\xE9decine d Alger - Concours de R\xE9sidanat 2023",
    examYear: 2023,
    questionTextFr: "Dans l insuffisance cardiaque chronique \xE0 fraction d \xE9jection r\xE9duite (IC-FEr < 40%), quel groupe th\xE9rapeutique fait partie des \xAB 4 fantastiques \xBB (quadrith\xE9rapie recommand\xE9e classe I) r\xE9duisant la mortalit\xE9 globale ?",
    questionTextEn: 'In chronic heart failure with reduced ejection fraction (HFrEF < 40%), which pharmacological class represents one of the foundational "four pillars" (Class I recommendation) proven to reduce all-cause mortality?',
    optionsFr: [
      "Inhibiteurs calciques dihydropyridiniques (ex: Amlodipine)",
      "Inhibiteurs des SGLT2 (gliflozines, ex: Dapagliflozine ou Empagliflozine)",
      "D\xE9riv\xE9s nitr\xE9s \xE0 lib\xE9ration prolong\xE9e",
      "Digitaliques (Digoxine)",
      "Diur\xE9tiques de l anse \xE0 forte dose en monoth\xE9rapie"
    ],
    optionsEn: [
      "Dihydropyridine calcium channel blockers (e.g., Amlodipine)",
      "SGLT2 inhibitors (gliflozins, e.g., Dapagliflozin or Empagliflozin)",
      "Long-acting oral nitrates",
      "Cardiac glycosides (Digoxin)",
      "High-dose loop diuretics in monotherapy"
    ],
    correctOptionIndexes: [1],
    isMultipleChoice: false,
    explanationFr: "Les 4 piliers majeurs de l IC-FEr selon les recommandations internationales (ESC/AHA) et nationales sont : 1) Les B\xEAta-bloquants (Bisoprolol, Carv\xE9dilol, M\xE9toprolol) ; 2) Les ARNI (Sacubitril/Valsartan) ou IEC ; 3) Les Antagonistes des r\xE9cepteurs des min\xE9ralocortico\xEFdes (Spironolactone/\xC9pl\xE9r\xE9none) ; 4) Les Inhibiteurs des SGLT2 (Dapagliflozine/Empagliflozine). Ces 4 classes diminuent significativement les hospitalisations et la mortalit\xE9 cardiovasculaire.",
    explanationEn: "The 4 foundational pillars for HFrEF according to international (ESC) guidelines are: 1) Beta-blockers; 2) ARNI (Sacubitril/Valsartan) or ACE inhibitors; 3) Mineralocorticoid receptor antagonists (Spironolactone/Eplerenone); 4) SGLT2 inhibitors (Dapagliflozin/Empagliflozin). All four significantly lower mortality and cardiovascular hospitalizations.",
    difficulty: "medium",
    comments: [
      {
        id: "c3",
        userName: "Dr. Mehdi (Cardiologue R\xE9sident)",
        userAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80",
        faculty: "CHU Mustapha Bacha Alger",
        text: "Nouveau standard absolu au r\xE9sidanat : la quadrith\xE9rapie doit \xEAtre connue sur le bout des doigts.",
        timestamp: "Il y a 3 jours"
      }
    ]
  },
  // Question 5: Cardiology (Acute Coronary Syndrome)
  {
    id: "q-med-cardio-02",
    lessonId: "med-3-cardio-sca",
    moduleId: "med-3-cardio",
    facultySource: "Facult\xE9 de M\xE9decine d Annaba - EMD Cardiologie 2023",
    examYear: 2023,
    questionTextFr: "Devant un patient de 55 ans consultant pour douleur thoracique r\xE9tro-sternale constrictive irradiant au bras gauche \xE9voluant depuis 90 minutes, l ECG montre un sus-d\xE9calage persistant du segment ST de 3 mm en DII, DIII, aVF avec image en miroir en DI, aVL. Quel est le diagnostic et la prise en charge imm\xE9diate prioritaire ?",
    questionTextEn: "A 55-year-old male presents with 90 minutes of retrosternal crushing chest pain radiating to the left arm. ECG shows persistent ST-segment elevation of 3 mm in leads II, III, aVF with reciprocal depression in leads I, aVL. What is the diagnosis and highest-priority immediate management?",
    optionsFr: [
      "Infarctus du myocarde inf\xE9rieur (STEMI) : D\xE9buter imm\xE9diatement une double antiagr\xE9gation, anticoagulation et coronarographie urgente (angioplastie primaire).",
      "P\xE9ricardite aigu\xEB b\xE9nigne : Prescrire Aspirine 1g x 3/jour et Colchicine.",
      "Angor instable : R\xE9aliser un dosage des troponines et attendre le r\xE9sultat \xE0 H+3 avant tout geste invasif.",
      "Dissection aortique aigu\xEB de type B : Administrer imm\xE9diatement des thrombolytiques intraveineux.",
      "Spasme coronarien d Prinzmetal : Traiter uniquement par d\xE9riv\xE9s nitr\xE9s sublinguaux sans surveillance."
    ],
    optionsEn: [
      "Inferior myocardial infarction (STEMI): Immediately initiate dual antiplatelet therapy, anticoagulation, and urgent coronary angiography (primary PCI).",
      "Acute benign pericarditis: Prescribe Aspirin 1g TID and Colchicine.",
      "Unstable angina: Order high-sensitivity troponins and wait 3 hours before invasive stratagems.",
      "Type B aortic dissection: Immediately infuse systemic thrombolytics.",
      "Prinzmetal variant angina: Treat exclusively with sublingual nitrates without monitoring."
    ],
    correctOptionIndexes: [0],
    isMultipleChoice: false,
    explanationFr: "Le sus-d\xE9calage persistant du segment ST en DII, DIII, aVF avec miroir en DI, aVL signe une occlusion coronaire aigu\xEB de la paroi inf\xE9rieure (territoire de l art\xE8re coronaire droite ou circonflexe). C est une urgence absolue n\xE9cessitant r\xE9perfusion myocardique en extr\xEAme urgence par angioplastie primaire (d\xE9lai < 120 min) associ\xE9e \xE0 la DAPT (Aspirine + Ticagr\xE9lor ou Prasugrel) et h\xE9parine.",
    explanationEn: "Persistent ST-segment elevation in leads II, III, aVF with reciprocal ST-depression in leads I, aVL establishes acute inferior STEMI (usually right coronary artery occlusion). It is an emergency requiring immediate reperfusion (primary PCI within 120 min) alongside dual antiplatelet therapy and therapeutic anticoagulation.",
    difficulty: "hard",
    comments: []
  }
];
var initialReportedQuestions = [
  {
    id: "rep-1",
    questionId: "q-med-cardio-01",
    studentName: "Dr. Sarah M. (R\xE9sidente R1)",
    reason: "Mise \xE0 jour des consensus",
    suggestion: "Selon la mise \xE0 jour ESC 2023, la dapagliflozine ou empagliflozine (iSGLT2) est d\xE9sormais en recommandation IA pour toute FEVG r\xE9duite sans d\xE9lai.",
    timestamp: "2024-10-12",
    status: "pending"
  },
  {
    id: "rep-2",
    questionId: "q-pharma-ains-02",
    studentName: "Yacine B. (5\xE8me Ann\xE9e)",
    reason: "Orthographe & Clart\xE9",
    suggestion: "Proposition B : Pr\xE9ciser syndrome de Reye p\xE9diatrique pour l aspirine.",
    timestamp: "2024-10-09",
    status: "approved"
  }
];

// server/store.ts
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "db.json");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
var defaultChecklist = {
  adminCreated: false,
  languagesConfigured: true,
  pharmacyConfigured: true,
  medicineConfigured: true,
  yearsConfigured: true,
  subjectsConfigured: true,
  lessonsConfigured: true,
  qcmsConfigured: true,
  pricingConfigured: false,
  settingsReviewed: false
};
var initialSuggestedQuestions = [
  {
    id: "sug-1",
    studentName: "Dr. Mehdi Slimani (R\xE9sident R2)",
    studentEmail: "mehdi.slimani@univ-alger.dz",
    professionId: "medicine",
    academicYearId: "med_y6",
    moduleId: "mod_med_cardio",
    lessonId: "les_med_cardio_1",
    questionText: "Quel est le d\xE9lai maximal recommand\xE9 pour r\xE9aliser une angioplastie primaire (PCI) apr\xE8s premier contact m\xE9dical dans le STEMI ?",
    options: [
      "Dans les 60 minutes",
      "Dans les 120 minutes (2 heures)",
      "Dans les 24 heures",
      "Dans les 48 heures",
      "Uniquement apr\xE8s fibrinolyse syst\xE9matique"
    ],
    correctIndexes: [1],
    explanation: "Selon les recommandations ESC de prise en charge du syndrome coronarien avec sus-d\xE9calage de ST, le d\xE9lai premier contact m\xE9dical - ballonnet doit \xEAtre inf\xE9rieur \xE0 120 minutes.",
    facultySource: "Facult\xE9 de M\xE9decine d'Alger - EMD Urgences",
    difficulty: "medium",
    isMultipleChoice: false,
    timestamp: "2024-10-18",
    status: "pending"
  }
];
function getInitialDatabase() {
  return {
    admin: null,
    // Starts as null so First-time Setup Flow triggers!
    adminTokens: {},
    checklist: defaultChecklist,
    professions: PROFESSIONS,
    academicYears: ACADEMIC_YEARS,
    modules: SUBJECT_MODULES,
    lessons: LESSON_CHAPTERS,
    questions: MCQ_QUESTIONS.map((q) => ({
      ...q,
      isDraft: false,
      isDeleted: false,
      createdAt: "2024-01-01"
    })),
    reportedQuestions: initialReportedQuestions,
    suggestedQuestions: initialSuggestedQuestions,
    subscriptionConfig: INITIAL_SUBSCRIPTION_CONFIG,
    announcement: "\u{1F4E2} Plateforme PharmedQuest Alg\xE9rie : La banque de QCMs officiels de r\xE9sidanat et d'EMD est \xE0 jour !",
    enrolledStudentsCount: 10482,
    quizzesCompletedCount: 48920
  };
}
var dbCache = null;
function getDatabase() {
  if (dbCache) return dbCache;
  if (import_fs.default.existsSync(DB_FILE)) {
    try {
      const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
      dbCache = JSON.parse(raw);
      return dbCache;
    } catch (e) {
      console.error("Error reading db.json, recreating initial DB:", e);
    }
  }
  const initial = getInitialDatabase();
  saveDatabase(initial);
  dbCache = initial;
  return dbCache;
}
function saveDatabase(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    dbCache = data;
  } catch (e) {
    console.error("Error saving db.json:", e);
  }
}
function hashPassword(password, salt) {
  const generatedSalt = salt || import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}
function verifyPassword(password, hash, salt) {
  try {
    const calculated = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    return import_crypto.default.timingSafeEqual(Buffer.from(calculated, "hex"), Buffer.from(hash, "hex"));
  } catch (e) {
    return false;
  }
}
function generateToken() {
  return import_crypto.default.randomBytes(32).toString("hex");
}
function getAdminStatus() {
  const db = getDatabase();
  const exists = !!db.admin;
  return {
    adminSetupRequired: !exists,
    adminExists: exists,
    adminEmail: exists ? db.admin?.email : void 0,
    adminName: exists ? db.admin?.name : void 0
  };
}
function setupFirstAdmin(name, email, password) {
  const db = getDatabase();
  if (db.admin) {
    throw new Error("Le compte Administrateur Principal existe d\xE9j\xE0. La configuration initiale est verrouill\xE9e d\xE9finitivement.");
  }
  if (!name || name.trim().length < 2) {
    throw new Error("Veuillez fournir un nom d'administrateur valide.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new Error("L'adresse e-mail de l'administrateur est invalide.");
  }
  if (!password || password.length < 8) {
    throw new Error("Le mot de passe doit comporter au moins 8 caract\xE8res.");
  }
  const { hash, salt } = hashPassword(password);
  const adminId = `admin_${Date.now()}`;
  const newAdmin = {
    id: adminId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hash,
    salt,
    role: "super_admin",
    isOwner: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const token = generateToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1e3;
  db.admin = newAdmin;
  db.adminTokens = {
    [token]: {
      adminId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt
    }
  };
  db.checklist.adminCreated = true;
  saveDatabase(db);
  return {
    success: true,
    admin: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: "super_admin",
      isOwner: true
    },
    token
  };
}
function loginAdmin(email, password) {
  const db = getDatabase();
  if (!db.admin) {
    throw new Error("Aucun compte administrateur n'a encore \xE9t\xE9 cr\xE9\xE9. Veuillez proc\xE9der \xE0 la configuration initiale.");
  }
  if (db.admin.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new Error("Identifiants administrateur incorrects.");
  }
  const isValid = verifyPassword(password, db.admin.passwordHash, db.admin.salt);
  if (!isValid) {
    throw new Error("Identifiants administrateur incorrects.");
  }
  const token = generateToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1e3;
  if (!db.adminTokens) db.adminTokens = {};
  db.adminTokens[token] = {
    adminId: db.admin.id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    expiresAt
  };
  saveDatabase(db);
  return {
    success: true,
    admin: {
      id: db.admin.id,
      name: db.admin.name,
      email: db.admin.email,
      role: "super_admin",
      isOwner: true
    },
    token
  };
}
function verifyAdminToken(token) {
  if (!token) return false;
  const db = getDatabase();
  const session = db.adminTokens?.[token];
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    delete db.adminTokens[token];
    saveDatabase(db);
    return false;
  }
  return true;
}
function getPublicContent() {
  const db = getDatabase();
  const activeQuestions = db.questions.filter((q) => !q.isDeleted && !q.isDraft);
  return {
    professions: db.professions,
    academicYears: db.academicYears,
    modules: db.modules,
    lessons: db.lessons,
    questions: activeQuestions,
    subscriptionConfig: db.subscriptionConfig,
    announcement: db.announcement
  };
}
function getAdminContent() {
  const db = getDatabase();
  return {
    professions: db.professions,
    academicYears: db.academicYears,
    modules: db.modules,
    lessons: db.lessons,
    questions: db.questions,
    // Includes drafts & soft-deleted
    reportedQuestions: db.reportedQuestions,
    suggestedQuestions: db.suggestedQuestions,
    subscriptionConfig: db.subscriptionConfig,
    announcement: db.announcement,
    checklist: db.checklist,
    stats: {
      totalQuestions: db.questions.filter((q) => !q.isDeleted).length,
      publishedQuestions: db.questions.filter((q) => !q.isDeleted && !q.isDraft).length,
      draftQuestions: db.questions.filter((q) => !q.isDeleted && q.isDraft).length,
      deletedQuestions: db.questions.filter((q) => q.isDeleted).length,
      pharmacyQuestions: db.questions.filter((q) => !q.isDeleted && q.professionId === "pharmacy").length,
      medicineQuestions: db.questions.filter((q) => !q.isDeleted && q.professionId === "medicine").length,
      modulesCount: db.modules.length,
      lessonsCount: db.lessons.length,
      pendingReportsCount: db.reportedQuestions.filter((r) => r.status === "pending").length,
      pendingSuggestionsCount: db.suggestedQuestions.filter((s) => s.status === "pending").length,
      enrolledStudents: db.enrolledStudentsCount,
      completedQuizzes: db.quizzesCompletedCount
    }
  };
}
function addOrUpdateModule(moduleData) {
  const db = getDatabase();
  let mod;
  if (moduleData.id) {
    const idx = db.modules.findIndex((m) => m.id === moduleData.id);
    if (idx !== -1) {
      db.modules[idx] = { ...db.modules[idx], ...moduleData };
      mod = db.modules[idx];
    } else {
      mod = moduleData;
      db.modules.push(mod);
    }
  } else {
    mod = {
      id: `mod_${moduleData.professionId}_${Date.now()}`,
      academicYearId: moduleData.academicYearId || "pharmacy-1",
      professionId: moduleData.professionId || "pharmacy",
      yearNumber: moduleData.yearNumber || 1,
      titleFr: moduleData.titleFr || "Nouveau Module",
      titleEn: moduleData.titleEn || "New Subject",
      code: moduleData.code || "MOD-NEW",
      icon: moduleData.icon || "book-open",
      color: moduleData.color || "from-teal-600 to-teal-800",
      descriptionFr: moduleData.descriptionFr || "",
      descriptionEn: moduleData.descriptionEn || "",
      lessonsCount: 0,
      questionCount: 0
    };
    db.modules.push(mod);
  }
  const yearIdx = db.academicYears.findIndex((y) => y.id === mod.academicYearId);
  if (yearIdx !== -1) {
    db.academicYears[yearIdx].modulesCount = db.modules.filter((m) => m.academicYearId === mod.academicYearId).length;
  }
  db.checklist.subjectsConfigured = true;
  saveDatabase(db);
  return mod;
}
function deleteModule(moduleId) {
  const db = getDatabase();
  const mod = db.modules.find((m) => m.id === moduleId);
  if (!mod) return false;
  db.modules = db.modules.filter((m) => m.id !== moduleId);
  db.lessons = db.lessons.filter((l) => l.moduleId !== moduleId);
  db.questions = db.questions.filter((q) => q.moduleId !== moduleId);
  const yearIdx = db.academicYears.findIndex((y) => y.id === mod.academicYearId);
  if (yearIdx !== -1) {
    db.academicYears[yearIdx].modulesCount = db.modules.filter((m) => m.academicYearId === mod.academicYearId).length;
  }
  saveDatabase(db);
  return true;
}
function addOrUpdateLesson(lessonData) {
  const db = getDatabase();
  let lesson;
  if (lessonData.id) {
    const idx = db.lessons.findIndex((l) => l.id === lessonData.id);
    if (idx !== -1) {
      db.lessons[idx] = { ...db.lessons[idx], ...lessonData };
      lesson = db.lessons[idx];
    } else {
      lesson = lessonData;
      db.lessons.push(lesson);
    }
  } else {
    lesson = {
      id: `les_${Date.now()}`,
      moduleId: lessonData.moduleId || db.modules[0]?.id || "mod-default",
      titleFr: lessonData.titleFr || "Nouveau Chapitre",
      titleEn: lessonData.titleEn || "New Chapter",
      questionCount: 0,
      estimatedMinutes: lessonData.estimatedMinutes || 25,
      downloadSize: "1.2 MB",
      isDownloaded: false,
      order: db.lessons.filter((l) => l.moduleId === lessonData.moduleId).length + 1
    };
    db.lessons.push(lesson);
  }
  const modIdx = db.modules.findIndex((m) => m.id === lesson.moduleId);
  if (modIdx !== -1) {
    db.modules[modIdx].lessonsCount = db.lessons.filter((l) => l.moduleId === lesson.moduleId).length;
  }
  db.checklist.lessonsConfigured = true;
  saveDatabase(db);
  return lesson;
}
function deleteLesson(lessonId) {
  const db = getDatabase();
  const lesson = db.lessons.find((l) => l.id === lessonId);
  if (!lesson) return false;
  db.lessons = db.lessons.filter((l) => l.id !== lessonId);
  db.questions = db.questions.filter((q) => q.lessonId !== lessonId);
  const modIdx = db.modules.findIndex((m) => m.id === lesson.moduleId);
  if (modIdx !== -1) {
    db.modules[modIdx].lessonsCount = db.lessons.filter((l) => l.moduleId === lesson.moduleId).length;
  }
  saveDatabase(db);
  return true;
}
function addOrUpdateYear(yearData) {
  const db = getDatabase();
  let year;
  if (yearData.id) {
    const idx = db.academicYears.findIndex((y) => y.id === yearData.id);
    if (idx !== -1) {
      db.academicYears[idx] = { ...db.academicYears[idx], ...yearData };
      year = db.academicYears[idx];
    } else {
      year = yearData;
      db.academicYears.push(year);
    }
  } else {
    const nextYearNum = db.academicYears.filter((y) => y.professionId === yearData.professionId).length + 1;
    year = {
      id: `${yearData.professionId}-${nextYearNum}`,
      professionId: yearData.professionId || "pharmacy",
      yearNumber: nextYearNum,
      labelFr: `${nextYearNum}\xE8me Ann\xE9e ${yearData.professionId === "pharmacy" ? "Pharmacie" : "M\xE9decine"}`,
      labelEn: `${nextYearNum}th Year ${yearData.professionId === "pharmacy" ? "Pharmacy" : "Medicine"}`,
      descriptionFr: yearData.descriptionFr || "Programme acad\xE9mique universitaire",
      descriptionEn: yearData.descriptionEn || "University academic curriculum",
      modulesCount: 0
    };
    db.academicYears.push(year);
  }
  db.checklist.yearsConfigured = true;
  saveDatabase(db);
  return year;
}
function addOrUpdateQuestion(qData) {
  const db = getDatabase();
  let q;
  if (qData.id) {
    const idx = db.questions.findIndex((x) => x.id === qData.id);
    if (idx !== -1) {
      db.questions[idx] = {
        ...db.questions[idx],
        ...qData,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      q = db.questions[idx];
    } else {
      q = {
        ...qData,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.questions.unshift(q);
    }
  } else {
    q = {
      id: `q_${Date.now()}`,
      lessonId: qData.lessonId || db.lessons[0]?.id || "",
      moduleId: qData.moduleId || db.modules[0]?.id || "",
      professionId: qData.professionId || "pharmacy",
      academicYearId: qData.academicYearId || "pharmacy-1",
      facultySource: qData.facultySource || "Facult\xE9 de M\xE9decine et Pharmacie d'Alger",
      examYear: qData.examYear || (/* @__PURE__ */ new Date()).getFullYear(),
      questionTextFr: qData.questionTextFr || "",
      questionTextEn: qData.questionTextEn || qData.questionTextFr || "",
      optionsFr: qData.optionsFr || ["", "", "", ""],
      optionsEn: qData.optionsEn || qData.optionsFr || ["", "", "", ""],
      correctOptionIndexes: qData.correctOptionIndexes && qData.correctOptionIndexes.length > 0 ? qData.correctOptionIndexes : [0],
      isMultipleChoice: (qData.correctOptionIndexes?.length || 1) > 1,
      explanationFr: qData.explanationFr || "",
      explanationEn: qData.explanationEn || qData.explanationFr || "",
      difficulty: qData.difficulty || "medium",
      comments: [],
      isDraft: qData.isDraft ?? false,
      isDeleted: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.questions.unshift(q);
  }
  recalcQuestionCounts(db);
  db.checklist.qcmsConfigured = true;
  saveDatabase(db);
  return q;
}
function softDeleteQuestion(id) {
  const db = getDatabase();
  const q = db.questions.find((x) => x.id === id);
  if (!q) return false;
  q.isDeleted = true;
  q.deletedAt = (/* @__PURE__ */ new Date()).toISOString();
  recalcQuestionCounts(db);
  saveDatabase(db);
  return true;
}
function restoreQuestion(id) {
  const db = getDatabase();
  const q = db.questions.find((x) => x.id === id);
  if (!q) return false;
  q.isDeleted = false;
  delete q.deletedAt;
  recalcQuestionCounts(db);
  saveDatabase(db);
  return true;
}
function permanentDeleteQuestion(id) {
  const db = getDatabase();
  const countBefore = db.questions.length;
  db.questions = db.questions.filter((x) => x.id !== id);
  if (db.questions.length !== countBefore) {
    recalcQuestionCounts(db);
    saveDatabase(db);
    return true;
  }
  return false;
}
function duplicateQuestion(id) {
  const db = getDatabase();
  const original = db.questions.find((x) => x.id === id);
  if (!original) return null;
  const copy = {
    ...original,
    id: `q_copy_${Date.now()}`,
    questionTextFr: `${original.questionTextFr} (Copie)`,
    questionTextEn: `${original.questionTextEn} (Copy)`,
    isDraft: true,
    isDeleted: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    comments: []
  };
  db.questions.unshift(copy);
  recalcQuestionCounts(db);
  saveDatabase(db);
  return copy;
}
function moveQuestion(id, newLessonId, newModuleId) {
  const db = getDatabase();
  const q = db.questions.find((x) => x.id === id);
  if (!q) return null;
  const targetLesson = db.lessons.find((l) => l.id === newLessonId);
  q.lessonId = newLessonId;
  if (targetLesson) {
    q.moduleId = targetLesson.moduleId;
    const targetMod = db.modules.find((m) => m.id === targetLesson.moduleId);
    if (targetMod) {
      q.professionId = targetMod.professionId;
      q.academicYearId = targetMod.academicYearId;
    }
  } else if (newModuleId) {
    q.moduleId = newModuleId;
  }
  q.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  recalcQuestionCounts(db);
  saveDatabase(db);
  return q;
}
function recalcQuestionCounts(db) {
  const activeQuestions = db.questions.filter((q) => !q.isDeleted && !q.isDraft);
  for (const lesson of db.lessons) {
    lesson.questionCount = activeQuestions.filter((q) => q.lessonId === lesson.id).length;
  }
  for (const mod of db.modules) {
    mod.questionCount = activeQuestions.filter((q) => q.moduleId === mod.id).length;
  }
}
function addReport(reportData) {
  const db = getDatabase();
  const rep = {
    ...reportData,
    id: `rep_${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"),
    status: "pending"
  };
  db.reportedQuestions.unshift(rep);
  saveDatabase(db);
  return rep;
}
function resolveReport(id, action) {
  const db = getDatabase();
  const rep = db.reportedQuestions.find((r) => r.id === id);
  if (!rep) return false;
  rep.status = action;
  saveDatabase(db);
  return true;
}
function addSuggestion(sugData) {
  const db = getDatabase();
  const sug = {
    ...sugData,
    id: `sug_${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"),
    status: "pending"
  };
  db.suggestedQuestions.unshift(sug);
  saveDatabase(db);
  return sug;
}
function resolveSuggestion(id, action) {
  const db = getDatabase();
  const sug = db.suggestedQuestions.find((s) => s.id === id);
  if (!sug) return { success: false };
  sug.status = action;
  if (action === "approved") {
    const newQ = {
      id: `q_sug_${Date.now()}`,
      lessonId: sug.lessonId,
      moduleId: sug.moduleId,
      professionId: sug.professionId,
      academicYearId: sug.academicYearId,
      facultySource: sug.facultySource || "Proposition \xE9tudiante valid\xE9e par le comit\xE9",
      examYear: (/* @__PURE__ */ new Date()).getFullYear(),
      questionTextFr: sug.questionText,
      questionTextEn: sug.questionText,
      optionsFr: sug.options,
      optionsEn: sug.options,
      correctOptionIndexes: sug.correctIndexes,
      isMultipleChoice: sug.isMultipleChoice,
      explanationFr: sug.explanation,
      explanationEn: sug.explanation,
      difficulty: sug.difficulty,
      comments: [],
      isDraft: false,
      isDeleted: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.questions.unshift(newQ);
    recalcQuestionCounts(db);
    saveDatabase(db);
    return { success: true, publishedQuestion: newQ };
  }
  saveDatabase(db);
  return { success: true };
}
function updateSubscriptionConfig(config) {
  const db = getDatabase();
  db.subscriptionConfig = { ...db.subscriptionConfig, ...config };
  db.checklist.pricingConfigured = true;
  saveDatabase(db);
  return db.subscriptionConfig;
}
function updateAnnouncement(text) {
  const db = getDatabase();
  db.announcement = text;
  saveDatabase(db);
  return db.announcement;
}
function updateChecklist(itemKey, value) {
  const db = getDatabase();
  db.checklist[itemKey] = value;
  saveDatabase(db);
  return db.checklist;
}

// server.ts
import_dotenv.default.config();
var PORT = 3e3;
var aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "PharmedQuest API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/auth/status", (_req, res) => {
    try {
      const status = getAdminStatus();
      res.json(status);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/auth/setup-admin", (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = setupFirstAdmin(name, email, password);
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/auth/admin-login", (req, res) => {
    try {
      const { email, password } = req.body;
      const result = loginAdmin(email, password);
      res.json(result);
    } catch (e) {
      res.status(401).json({ error: e.message });
    }
  });
  app.get("/api/auth/verify-admin", (req, res) => {
    const token = req.headers["x-admin-token"];
    const isValid = verifyAdminToken(token);
    if (isValid) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: "Session expir\xE9e ou non autoris\xE9e." });
    }
  });
  app.get("/api/content", (_req, res) => {
    try {
      const content = getPublicContent();
      res.json(content);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/reports", (req, res) => {
    try {
      const report = addReport(req.body);
      res.status(201).json(report);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/suggestions", (req, res) => {
    try {
      const suggestion = addSuggestion(req.body);
      res.status(201).json(suggestion);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  const requireAdmin = (req, res, next) => {
    const token = req.headers["x-admin-token"];
    if (!verifyAdminToken(token)) {
      return res.status(403).json({ error: "Acc\xE8s refus\xE9. Autorisation administrateur requise." });
    }
    next();
  };
  app.get("/api/admin/content", requireAdmin, (_req, res) => {
    try {
      const data = getAdminContent();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/admin/modules", requireAdmin, (req, res) => {
    try {
      const mod = addOrUpdateModule(req.body);
      res.json(mod);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.delete("/api/admin/modules/:id", requireAdmin, (req, res) => {
    try {
      const success = deleteModule(req.params.id);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/lessons", requireAdmin, (req, res) => {
    try {
      const lesson = addOrUpdateLesson(req.body);
      res.json(lesson);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.delete("/api/admin/lessons/:id", requireAdmin, (req, res) => {
    try {
      const success = deleteLesson(req.params.id);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/years", requireAdmin, (req, res) => {
    try {
      const year = addOrUpdateYear(req.body);
      res.json(year);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/questions/create", (req, res) => {
    try {
      const question = addOrUpdateQuestion(req.body);
      res.json(question);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/questions", requireAdmin, (req, res) => {
    try {
      const question = addOrUpdateQuestion(req.body);
      res.json(question);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/questions/:id/soft-delete", requireAdmin, (req, res) => {
    try {
      const success = softDeleteQuestion(req.params.id);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/questions/:id/restore", requireAdmin, (req, res) => {
    try {
      const success = restoreQuestion(req.params.id);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.delete("/api/admin/questions/:id", requireAdmin, (req, res) => {
    try {
      const success = permanentDeleteQuestion(req.params.id);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/questions/:id/duplicate", requireAdmin, (req, res) => {
    try {
      const copy = duplicateQuestion(req.params.id);
      res.json(copy);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/questions/:id/move", requireAdmin, (req, res) => {
    try {
      const { newLessonId, newModuleId } = req.body;
      const moved = moveQuestion(req.params.id, newLessonId, newModuleId);
      res.json(moved);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/reports/:id/resolve", requireAdmin, (req, res) => {
    try {
      const { action } = req.body;
      const success = resolveReport(req.params.id, action);
      res.json({ success });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/suggestions/:id/resolve", requireAdmin, (req, res) => {
    try {
      const { action } = req.body;
      const result = resolveSuggestion(req.params.id, action);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post(["/api/admin/subscription", "/api/admin/pricing"], requireAdmin, (req, res) => {
    try {
      const updated = updateSubscriptionConfig(req.body);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post(["/api/admin/announcement", "/api/admin/announcements"], requireAdmin, (req, res) => {
    try {
      const text = req.body.text || req.body.announcement || "";
      const updated = updateAnnouncement(text);
      res.json({ text: updated, announcement: updated });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/admin/checklist", requireAdmin, (req, res) => {
    try {
      const { key, value } = req.body;
      const updated = updateChecklist(key, value);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const {
        questionText,
        options,
        correctOptionIndexes,
        studentAnswerIndexes,
        module: module2,
        lesson,
        language = "fr"
      } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          source: "fallback",
          explanation: language === "fr" ? `**Analyse P\xE9dagogique PharmedQuest :**

- **R\xE9ponse(s) exacte(s)** : ${correctOptionIndexes.map((idx) => `Option ${String.fromCharCode(65 + idx)}`).join(", ")}.
- **M\xE9canisme cl\xE9** : Dans le cadre de **${lesson || module2 || "cette mati\xE8re"}**, cette r\xE8gle th\xE9rapeutique d\xE9coule directement des consensus universitaires et des recommandations officielles de la facult\xE9.
- **Astuce mn\xE9monique** : Retenez toujours les contre-indications absolues et les effets ind\xE9sirables majeurs qui reviennent fr\xE9quemment aux examens de r\xE9sidanat et aux EMD.
- **Conseil pour l'examen** : \xC9liminez d'abord les propositions manifestement erron\xE9es.` : `**PharmedQuest Academic Breakdown:**

- **Correct Answer(s)**: ${correctOptionIndexes.map((idx) => `Option ${String.fromCharCode(65 + idx)}`).join(", ")}.
- **Core Concept**: In the context of **${lesson || module2 || "this module"}**, this concept is aligned with standard university curriculum and residency examination guidelines.
- **Clinical Pearl**: Always verify contraindications, dosage adjustments, and receptor selectivity on related exam questions.`
        });
      }
      const prompt = `You are a distinguished Professor of Medicine and Pharmacy preparing students for university residency examinations (concours de r\xE9sidanat) and module exams (EMD).
Language of answer: ${language === "fr" ? "French" : "English"}.

Question:
"${questionText}"

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}: ${opt}`).join("\n")}

Correct Answer(s): ${correctOptionIndexes.map((i) => String.fromCharCode(65 + i)).join(", ")}
Student Answer(s): ${studentAnswerIndexes && studentAnswerIndexes.length > 0 ? studentAnswerIndexes.map((i) => String.fromCharCode(65 + i)).join(", ") : "None / Reviewing"}
Module/Subject: ${module2 || "Medical/Pharmacy"}
Chapter/Lesson: ${lesson || "General"}

Please provide a structured, high-yield explanation:
1. **Direct Rationale**: Why the correct choice(s) is/are clinically & theoretically correct.
2. **Analysis of Distractors**: Briefly explain why the other options are wrong or misleading.
3. **High-Yield Clinical Pearl / Mnemonic**: A memorable exam tip or mnemonic useful for university exams.
Keep the tone encouraging, rigorous, and academic.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });
      res.json({
        source: "gemini",
        explanation: response.text || "Explication g\xE9n\xE9r\xE9e avec succ\xE8s."
      });
    } catch (error) {
      console.error("AI Explain Error:", error);
      res.json({
        source: "fallback",
        explanation: req.body.language === "fr" ? "Explication clinique : La justification repose sur le m\xE9canisme pharmacologique et physiopathologique standard enseign\xE9 dans les facult\xE9s alg\xE9riennes de m\xE9decine et pharmacie." : "Clinical explanation: Based on standard pharmacological and medical curriculum for university examinations."
      });
    }
  });
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { query, context, language = "fr" } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          source: "fallback",
          response: language === "fr" ? `Excellente question sur **${context?.subject || "le cours"}**. En r\xE9vision m\xE9dicale, concentrez-vous sur les m\xE9canismes d'action, les posologies usuelles, les effets secondaires fr\xE9quents et les diagnostics diff\xE9rentiels.` : `Great question regarding **${context?.subject || "the lecture"}**. For medical exam preparation, focus on underlying mechanisms, contraindications, and classic differential diagnoses.`
        });
      }
      const prompt = `You are PharmedQuest AI, an expert medical and pharmacology tutor assisting an Algerian medical/pharmacy university student.
Language: ${language === "fr" ? "French" : "English"}.
Context: ${JSON.stringify(context || {})}
Student Question: "${query}"

Provide an accurate, educational, clear, and encouraging explanation suitable for medical students preparing for university exams and residency.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });
      res.json({
        source: "gemini",
        response: response.text
      });
    } catch (error) {
      console.error("AI Ask Error:", error);
      res.json({
        source: "fallback",
        response: req.body.language === "fr" ? "Pour approfondir ce point, consultez les fiches de synth\xE8se du cours et comparez les cas cliniques similaires." : "Review the module lecture notes and practice related MCQs to solidify this topic."
      });
    }
  });
  app.post("/api/ai/generate-question", async (req, res) => {
    try {
      const { profession, year, module: module2, lesson, language = "fr" } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          question: language === "fr" ? "Concernant les anti-inflammatoires non st\xE9ro\xEFdiens (AINS), quelle est la proposition exacte ?" : "Regarding non-steroidal anti-inflammatory drugs (NSAIDs), which statement is correct?",
          options: language === "fr" ? [
            "Ils inhibent s\xE9lectivement la phospholipase A2",
            "Ils inhibent la cyclo-oxyg\xE9nase (COX)",
            "Ils sont indiqu\xE9s au 3\xE8me trimestre de la grossesse",
            "Ils diminuent le risque d'ulc\xE8re gastrique",
            "Ils n'ont aucun effet sur l'agr\xE9gation plaquettaire"
          ] : [
            "They selectively inhibit phospholipase A2",
            "They inhibit cyclooxygenase (COX)",
            "They are indicated in the 3rd trimester of pregnancy",
            "They decrease the risk of gastric ulceration",
            "They have no effect on platelet aggregation"
          ],
          correctIndexes: [1],
          explanation: language === "fr" ? "Les AINS agissent principalement par inhibition des isoformes de la cyclo-oxyg\xE9nase (COX-1 et COX-2)." : "NSAIDs primarily act by inhibiting cyclooxygenase (COX-1 and COX-2) enzymes."
        });
      }
      const prompt = `Generate a single university-level medical/pharmacy multiple-choice question (MCQ) for students.
Profession: ${profession}
Academic Year: ${year}
Subject/Module: ${module2}
Lesson: ${lesson}
Language: ${language === "fr" ? "French" : "English"}

Output strictly valid JSON with this format:
{
  "question": "string",
  "options": ["string", "string", "string", "string", "string"],
  "correctIndexes": [number],
  "explanation": "string"
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: "Failed to generate question" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PharmedQuest server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
