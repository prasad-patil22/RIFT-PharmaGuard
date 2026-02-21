import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import readline from "readline";
import { pgxVariants } from "./pgxMapping.js";

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-domain.com" // Add your deployed frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


async function generateLLMExplanation(resultData) {
  const prompt = `  
You are a clinical pharmacogenomics expert.

Given this structured pharmacogenomic analysis:

Patient ID: ${resultData.patient_id}
Drug: ${resultData.drug}
Primary Gene: ${resultData.pharmacogenomic_profile.primary_gene}
Diplotype: ${resultData.pharmacogenomic_profile.diplotype}
Phenotype: ${resultData.pharmacogenomic_profile.phenotype}
Risk Label: ${resultData.risk_assessment.risk_label}
Severity: ${resultData.risk_assessment.severity}

Detected Variants:
${resultData.pharmacogenomic_profile.detected_variants.length > 0
  ? resultData.pharmacogenomic_profile.detected_variants
      .map(v => `${v.rsid} (${v.star}, ${v.function})`)
      .join("\n")
  : "None detected"}

Provide a detailed explainable clinical reasoning.

Return STRICT JSON only:
{
  "summary": "...",
  "biological_mechanism": "...",
  "drug_metabolism_impact": "...",
  "clinical_rationale": "...",
  "cpic_alignment": "..."
}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are a pharmacogenomics clinical expert." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch {
    return {
      summary: completion.choices[0].message.content,
      biological_mechanism: "",
      drug_metabolism_impact: "",
      clinical_rationale: "",
      cpic_alignment: ""
    };
  }
}

/* ---------------- DRUG → GENE MAP ---------------- */

const drugGeneMap = {
  CODEINE: "CYP2D6",
  WARFARIN: "CYP2C9",
  CLOPIDOGREL: "CYP2C19",
  SIMVASTATIN: "SLCO1B1",
  AZATHIOPRINE: "TPMT",
  FLUOROURACIL: "DPYD",
};

/* ---------------- MULTER CONFIG ---------------- */

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ---------------- HELPER FUNCTIONS ---------------- */

function calculateDiplotype(variants) {
  if (!variants || variants.length === 0) return "*1/*1";

  // Sort variants by impact (no_function > reduced_function)
  const sortedVariants = [...variants].sort((a, b) => {
    const impactOrder = { "no_function": 0, "reduced_function": 1, "decreased_function": 1, "increased_function": 2 };
    const aImpact = impactOrder[a.function] || 3;
    const bImpact = impactOrder[b.function] || 3;
    return aImpact - bImpact;
  });

  // Use most impactful variants to determine diplotype
  const primaryVariant = sortedVariants[0];
  
  if (sortedVariants.length === 1) {
    // Single variant detected
    if (primaryVariant.genotype === "1/1") {
      // Homozygous variant
      return `${primaryVariant.star}/${primaryVariant.star}`;
    } else if (primaryVariant.genotype === "0/1") {
      // Heterozygous variant
      return `*1/${primaryVariant.star}`;
    }
    return "*1/*1";
  }

  // Multiple variants detected - likely compound heterozygous
  if (primaryVariant.genotype === "1/1") {
    return `${primaryVariant.star}/${primaryVariant.star}`;
  } else if (primaryVariant.genotype === "0/1") {
    // If we have multiple variants, one could be on each allele
    const secondVariant = sortedVariants[1];
    if (secondVariant && secondVariant.genotype === "0/1") {
      return `${primaryVariant.star}/${secondVariant.star}`;
    }
    return `*1/${primaryVariant.star}`;
  }

  return "*1/*1";
}

function calculateActivityScore(variants) {
  if (!variants || variants.length === 0) return 1; // Default to normal metabolism (wildtype *1/*1)
  
  // Sum activity scores from all detected variants
  let totalScore = 0;
  variants.forEach(v => {
    totalScore += v.activityScore || 0;
  });
  
  return totalScore;
}

function calculatePhenotype(variants) {
  if (!variants || variants.length === 0) {
    // Clinical default: No variants detected = wild-type *1/*1 = Normal Metabolizer
    return "NM";
  }

  const activityScore = calculateActivityScore(variants);

  // CPIC Phenotype Classification based on activity score
  if (activityScore === 0) {
    return "PM"; // Poor Metabolizer
  } else if (activityScore > 0 && activityScore < 1) {
    return "IM"; // Intermediate Metabolizer
  } else if (activityScore >= 1 && activityScore < 2) {
    return "NM"; // Normal Metabolizer
  } else if (activityScore >= 2 && activityScore < 2.5) {
    return "RM"; // Rapid Metabolizer
  } else if (activityScore >= 2.5) {
    return "URM"; // Ultra-Rapid Metabolizer
  }

  return "NM"; // Default to Normal Metabolizer
}

function determineRisk(drug, phenotype) {
  switch (drug) {
    // CYP2D6 - Codeine metabolism
    case "CODEINE":
      switch (phenotype) {
        case "PM":
          return { label: "Ineffective", severity: "high" };
        case "IM":
          return { label: "Adjust Dosage", severity: "moderate" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Toxic", severity: "high" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    // CYP2C9 - Warfarin metabolism
    case "WARFARIN":
      switch (phenotype) {
        case "PM":
          return { label: "Adjust Dosage", severity: "high" };
        case "IM":
          return { label: "Adjust Dosage", severity: "moderate" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Safe", severity: "low" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    // CYP2C19 - Clopidogrel metabolism
    case "CLOPIDOGREL":
      switch (phenotype) {
        case "PM":
          return { label: "Ineffective", severity: "high" };
        case "IM":
          return { label: "Adjust Dosage", severity: "moderate" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Safe", severity: "low" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    // SLCO1B1 - Simvastatin metabolism
    case "SIMVASTATIN":
      switch (phenotype) {
        case "PM":
          return { label: "Toxic", severity: "critical" };
        case "IM":
          return { label: "Adjust Dosage", severity: "high" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Safe", severity: "low" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    // TPMT - Azathioprine metabolism
    case "AZATHIOPRINE":
      switch (phenotype) {
        case "PM":
          return { label: "Toxic", severity: "critical" };
        case "IM":
          return { label: "Adjust Dosage", severity: "high" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Safe", severity: "low" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    // DPYD - Fluorouracil metabolism
    case "FLUOROURACIL":
      switch (phenotype) {
        case "PM":
          return { label: "Toxic", severity: "critical" };
        case "IM":
          return { label: "Adjust Dosage", severity: "high" };
        case "NM":
          return { label: "Safe", severity: "low" };
        case "RM":
          return { label: "Safe", severity: "low" };
        case "URM":
          return { label: "Safe", severity: "low" };
        default:
          return { label: "Unknown", severity: "none" };
      }

    default:
      return { label: "Unknown", severity: "none" };
  }
}

function getRecommendation(drug, phenotype, riskLabel) {
  const recommendations = {
    CODEINE: {
      "Toxic": {
        action: "Avoid drug - risk of overdose",
        dosage_adjustment: "Contraindicated",
        monitoring: "Do not use; consider alternative analgesic",
        alternative: "Methadone, tramadol, or other analgesics",
        guideline_reference: "CPIC Codeine Guideline v2",
      },
      "Adjust Dosage": {
        action: "Reduce dose by 25-50%",
        dosage_adjustment: "25-50% reduction recommended",
        monitoring: "Monitor for therapeutic response and side effects",
        alternative: "N/A",
        guideline_reference: "CPIC Codeine Guideline v2",
      },
      "Ineffective": {
        action: "Consider alternative medication",
        dosage_adjustment: "Not recommended",
        monitoring: "Poor response expected; switch to alternative",
        alternative: "Methadone, fentanyl transdermal patch",
        guideline_reference: "CPIC Codeine Guideline v2",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose",
        monitoring: "Routine monitoring",
        alternative: "N/A",
        guideline_reference: "CPIC Codeine Guideline v2",
      },
    },
    WARFARIN: {
      "Adjust Dosage": {
        action: "Use lower starting dose and increase gradually",
        dosage_adjustment: "Start at 2-5mg daily (vs standard 5-10mg)",
        monitoring: "Check INR more frequently (every 2-3 days initially)",
        alternative: "N/A",
        guideline_reference: "CPIC Warfarin-CYP2C9 Guideline",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose",
        monitoring: "Standard INR monitoring per protocol",
        alternative: "N/A",
        guideline_reference: "CPIC Warfarin-CYP2C9 Guideline",
      },
    },
    CLOPIDOGREL: {
      "Ineffective": {
        action: "Avoid drug - poor activation",
        dosage_adjustment: "Contraindicated",
        monitoring: "Consider alternative antiplatelet therapy",
        alternative: "Prasugrel, ticagrelor, or other P2Y12 inhibitors",
        guideline_reference: "CPIC Clopidogrel Guideline",
      },
      "Adjust Dosage": {
        action: "Use alternative P2Y12 inhibitor",
        dosage_adjustment: "Switch recommendation",
        monitoring: "Assess for stent thrombosis risk",
        alternative: "Prasugrel or ticagrelor preferred",
        guideline_reference: "CPIC Clopidogrel Guideline",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose (75mg daily)",
        monitoring: "Routine monitoring",
        alternative: "N/A",
        guideline_reference: "CPIC Clopidogrel Guideline",
      },
    },
    SIMVASTATIN: {
      "Toxic": {
        action: "Avoid drug - high myopathy risk",
        dosage_adjustment: "Contraindicated",
        monitoring: "Do not use; monitor for muscle pain or weakness",
        alternative: "Pravastatin, rosuvastatin, or other statins",
        guideline_reference: "CPIC SLCO1B1-Simvastatin Guideline",
      },
      "Adjust Dosage": {
        action: "Reduce dose or choose alternative statin",
        dosage_adjustment: "Maximum 20mg daily (vs standard 40-80mg)",
        monitoring: "Monitor CK levels and muscle symptoms",
        alternative: "Pravastatin or rosuvastatin recommended",
        guideline_reference: "CPIC SLCO1B1-Simvastatin Guideline",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose",
        monitoring: "Standard lipid monitoring",
        alternative: "N/A",
        guideline_reference: "CPIC SLCO1B1-Simvastatin Guideline",
      },
    },
    AZATHIOPRINE: {
      "Toxic": {
        action: "Avoid drug - high toxicity risk",
        dosage_adjustment: "Contraindicated",
        monitoring: "Neutropenia and hepatotoxicity risk; do not use",
        alternative: "Other immunosuppressants (mycophenolate, etc.)",
        guideline_reference: "CPIC TPMT Guideline",
      },
      "Adjust Dosage": {
        action: "Reduce dose significantly",
        dosage_adjustment: "10-30% of standard dose",
        monitoring: "Frequent CBC and LFT monitoring required",
        alternative: "Consider alternative immunosuppressant",
        guideline_reference: "CPIC TPMT Guideline",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose",
        monitoring: "Standard blood count monitoring",
        alternative: "N/A",
        guideline_reference: "CPIC TPMT Guideline",
      },
    },
    FLUOROURACIL: {
      "Toxic": {
        action: "Avoid drug - severe toxicity risk",
        dosage_adjustment: "Contraindicated",
        monitoring: "Life-threatening toxicity; do not use",
        alternative: "Alternative chemotherapy regimen required",
        guideline_reference: "CPIC DPYD Guideline",
      },
      "Adjust Dosage": {
        action: "Significant dose reduction",
        dosage_adjustment: "25-50% of standard dose",
        monitoring: "Close toxicity monitoring essential",
        alternative: "Consider alternative chemotherapy",
        guideline_reference: "CPIC DPYD Guideline",
      },
      "Safe": {
        action: "Standard dosing",
        dosage_adjustment: "Normal dose",
        monitoring: "Standard toxicity monitoring",
        alternative: "N/A",
        guideline_reference: "CPIC DPYD Guideline",
      },
    },
  };

  const drugRecs = recommendations[drug];
  if (drugRecs && drugRecs[riskLabel]) {
    return drugRecs[riskLabel];
  }

  // Fallback for unmapped combinations
  return {
    action: "Consult clinical pharmacist",
    dosage_adjustment: "Unknown - requires specialist review",
    monitoring: "Personalized monitoring plan needed",
    alternative: "Consult pharmacist for recommendations",
    guideline_reference: `CPIC ${drug} Guideline`,
  };
}

/* ---------------- ANALYZE ROUTE ---------------- */

app.post("/analyze", upload.single("vcfFile"), async (req, res) => {
  try {
    if (!req.file || !req.body.drug || !req.body.drug.trim()) {

      return res.status(400).json({
        message: "VCF file and drug name are required",
      });
    }

    // Parse drugs - support single drug or comma-separated drugs
    const drugInput = req.body.drug.toUpperCase().trim();
    const drugs = drugInput.split(",").map(d => d.trim()).filter(d => d);

    if (drugs.length === 0) {
      return res.status(400).json({
        message: "At least one valid drug name is required",
      });
    }

    // Validate all drugs before processing
    const invalidDrugs = drugs.filter(drug => !drugGeneMap[drug]);
    if (invalidDrugs.length > 0) {
      return res.status(400).json({
        message: `Unsupported drug(s): ${invalidDrugs.join(", ")}. Supported: ${Object.keys(drugGeneMap).join(", ")}`,
      });
    }

    const filePath = req.file.path;
    const detectedVariantsByGene = {};
    let patientId = "UNKNOWN";

    // Parse VCF file once, extract all variants organized by gene
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.startsWith("#CHROM")) {
        const headerParts = line.split("\t");
        patientId = headerParts[9] || "UNKNOWN";
        continue;
      }

      if (line.startsWith("#")) continue;

      const columns = line.split("\t");
      if (columns.length < 10) continue;

      const rsid = columns[2];
      const genotype = columns[9];

      // Check all genes for this variant
      Object.keys(pgxVariants).forEach(gene => {
        if (pgxVariants[gene] && pgxVariants[gene][rsid]) {
          if (!detectedVariantsByGene[gene]) {
            detectedVariantsByGene[gene] = [];
          }
          detectedVariantsByGene[gene].push({
            rsid,
            genotype,
            ...pgxVariants[gene][rsid],
          });
        }
      });
    }

    fs.unlinkSync(filePath);

    // Analyze each drug
    const analyses = [];

for (const drug of drugs) {

  const primaryGene = drugGeneMap[drug];
  const detectedVariants = detectedVariantsByGene[primaryGene] || [];

  const diplotype = calculateDiplotype(detectedVariants);
  const phenotype = calculatePhenotype(detectedVariants);
  const risk = determineRisk(drug, phenotype);
  const recommendation = getRecommendation(drug, phenotype, risk.label);

  let confidenceScore = 0.5;
  if (detectedVariants.length > 0) {
    confidenceScore += Math.min(0.4, detectedVariants.length * 0.15);
    confidenceScore += 0.1;
  }
  confidenceScore = Math.min(0.95, Math.max(0.5, confidenceScore));

  const baseResult = {
    patient_id: patientId,
    drug: drug,
    timestamp: new Date().toISOString(),

    risk_assessment: {
      risk_label: risk.label,
      confidence_score: Math.round(confidenceScore * 100) / 100,
      severity: risk.severity,
    },

    pharmacogenomic_profile: {
      primary_gene: primaryGene,
      diplotype: diplotype,
      phenotype: phenotype,
      detected_variants: detectedVariants,
    },

    clinical_recommendation: recommendation,

    quality_metrics: {
      vcf_parsing_success: true,
      variant_detection_success: detectedVariants.length > 0,
      gene_match_success: detectedVariants.length > 0,
      total_variants_detected: detectedVariants.length,
      primary_gene: primaryGene,
      phenotype_confidence: detectedVariants.length > 0 ? "high" : "medium",
    }
  };

  // 🔥 CALL GROQ HERE
  const explanation = await generateLLMExplanation(baseResult);

  baseResult.llm_generated_explanation = explanation;

  analyses.push(baseResult);
}


    // Return single object if one drug, array if multiple drugs
    if (analyses.length === 1) {
      return res.json(analyses[0]);
    } else {
      return res.json({
        patient_id: patientId,
        analyses: analyses,
        timestamp: new Date().toISOString(),
        drugCount: analyses.length,
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

/* ---------------- SERVER ---------------- */

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
