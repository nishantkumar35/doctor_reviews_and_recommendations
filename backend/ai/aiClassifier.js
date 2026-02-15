const { pipeline } = require("@xenova/transformers");


const SPECIALTIES = [
  {
    name: "Cardiologist",
    desc: "Heart specialist who treats chest pain, breathing issues, heart disease, chest tightness, and heart-related problems."
  },
  {
    name: "Pulmonologist",
    desc: "Lung specialist who treats breathing problems, asthma, chest congestion, lung infections, and respiratory issues."
  },
  {
    name: "Dermatologist",
    desc: "Skin and hair specialist for acne, rashes, itching, allergies, infections, and hair fall problems."
  },
  {
    name: "Gastroenterologist",
    desc: "Stomach and digestive specialist who treats stomach pain, gas, acidity, vomiting, indigestion, and abdominal problems."
  },
  {
    name: "Neurologist",
    desc: "Brain and nerve specialist who treats headaches, migraines, seizures, dizziness, nerve pain, and neurological disorders."
  },
  {
    name: "Psychiatrist",
    desc: "Mental health doctor who treats anxiety, depression, stress, sadness, fear, and emotional disorders."
  },
  {
    name: "Orthopedic Surgeon",
    desc: "Bone and joint specialist who treats back pain, knee pain, fractures, bone injuries, and joint problems."
  },
  {
    name: "General Physician",
    desc: "General doctor for fever, cold, cough, fatigue, viral infections, weakness, and routine health checkups."
  },
  {
    name: "Pediatrician",
    desc: "Specialist doctor for infants, children, and adolescents health and medical care."
  },
  {
    name: "Gynecologist",
    desc: "Specialist in female reproductive health, pregnancy, and childbirth."
  },
  {
    name: "Endocrinologist",
    desc: "Specialist in hormone-related conditions, diabetes, and thyroid problems."
  },
  {
    name: "Ophthalmologist",
    desc: "Eye specialist for vision problems, cataract, and eye diseases."
  }
];

let embedder = null;
let isLoading = false;
const specialtyVectors = {};

const loadModel = async () => {
  if (embedder) return embedder;
  if (isLoading) {
    // Wait for existing loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return embedder;
  }

  try {
    isLoading = true;
    console.log("Starting to load AI Model...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Generating specialty vectors...");
    for (const sp of SPECIALTIES) {
      const output = await embedder(sp.desc, { pooling: 'mean', normalize: true });
      specialtyVectors[sp.name] = output.data;
    }
    console.log("AI Model and vectors loaded successfully");
    return embedder;
  } catch (err) {
    console.error("Critical error loading AI Model:", err);
    throw err;
  } finally {
    isLoading = false;
  }
};


async function embed(text) {
  if (!embedder) await loadModel();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return output.data;
}


function cosineSimilarity(a, b) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}


const predictSpecialty = async (problem) => {
  if (!embedder) await loadModel();

  const problemEmbedding = await embed(problem);

  let bestSpecialty = "General Physician";
  let bestScore = -1;

  for (const sp of SPECIALTIES) {
    const vector = specialtyVectors[sp.name];
    const score = cosineSimilarity(problemEmbedding, vector);

    if (score > bestScore) {
      bestScore = score;
      bestSpecialty = sp.name;
    }
  }

  console.log("\nUser Problem:", problem);
  console.log("➡ Predicted Specialty:", bestSpecialty);
  console.log("➡ Confidence Score:", bestScore.toFixed(4), "\n");

  return bestSpecialty;
};

module.exports = { loadModel, predictSpecialty };


if (require.main === module) {
  (async () => {
    await loadModel();
  })();
}
