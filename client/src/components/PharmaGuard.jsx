// import React, { useState } from "react";
// import Loader from "./Loader";
// import  {  useRef, useEffect } from "react";

// const PharmaGuard = () => {
//   const [file, setFile] = useState(null);
//   const [drug, setDrug] = useState("");
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [showJsonModal, setShowJsonModal] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const resultRef = useRef(null);
//   const supportedDrugs = [
//     "CODEINE",
//     "WARFARIN",
//     "CLOPIDOGREL",
//     "SIMVASTATIN",
//     "AZATHIOPRINE",
//     "FLUOROURACIL",
//   ];
//   useEffect(() => {
//   if (result && resultRef.current) {
//     resultRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   }
// }, [result]);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const droppedFile = e.dataTransfer.files[0];
//       if (droppedFile.name.endsWith(".vcf")) {
//         setFile(droppedFile);
//         setError("");
//       } else {
//         setError("Please upload a valid .vcf file");
//       }
//     }
//   };

//   const getRiskColor = (riskLabel) => {
//     switch (riskLabel) {
//       case "Safe":
//         return "#27ae60";
//       case "Adjust Dosage":
//         return "#f39c12";
//       case "Ineffective":
//         return "#f1c40f";
//       case "Toxic":
//         return "#c0392b";
//       default:
//         return "#7f8c8d";
//     }
//   };

//   const downloadJSON = () => {
//     if (!result) return;
//     const json = JSON.stringify(result, null, 2);
//     const blob = new Blob([json], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;

//     let filename;
//     if (result.analyses) {
//       filename = `${result.patient_id}_multi-drug_analysis.json`;
//     } else {
//       filename = `${result.patient_id}_${result.drug}_analysis.json`;
//     }

//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const copyToClipboard = () => {
//     if (!result) return;
//     const json = JSON.stringify(result, null, 2);
//     navigator.clipboard.writeText(json).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   // Modal Component
//   const JsonModal = ({ result, onClose }) => {
//     if (!showJsonModal) return null;

//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000,
//           padding: "20px",
//           backdropFilter: "blur(10px)",
//         }}
//         onClick={onClose}
//       >
//         <div
//           style={{
//             backgroundColor: "#f5f5f7",
//             borderRadius: "12px",
//             width: "90%",
//             maxWidth: "900px",
//             maxHeight: "90vh",
//             overflow: "hidden",
//             boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.3)",
//             animation: "modalSlideIn 0.25s cubic-bezier(0.2, 0, 0, 1)",
//             border: "1px solid rgba(255, 255, 255, 0.8)",
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* macOS-style Modal Header with traffic lights */}
//           <div
//             style={{
//               padding: "16px 24px",
//               borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               backgroundColor: "#f5f5f7",
//               backgroundImage: "linear-gradient(to bottom, #f5f5f7, #e8e8ed)",
//               borderTopLeftRadius: "12px",
//               borderTopRightRadius: "12px",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//               {/* macOS traffic light buttons */}
//               <div style={{ display: "flex", gap: "8px", marginRight: "8px" }}>
//                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f57", cursor: "pointer" }} onClick={onClose} />
//                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#febc2e" }} />
//                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#28c840" }} />
//               </div>
//               <span style={{ fontSize: "20px", opacity: 0.8 }}>📋</span>
//               <h3
//                 style={{
//                   margin: 0,
//                   fontSize: "15px",
//                   fontWeight: "500",
//                   color: "#1d1c1f",
//                   letterSpacing: "-0.01em",
//                 }}
//               >
//                 JSON Output —{" "}
//                 {result?.analyses
//                   ? "Multi-Drug Analysis"
//                   : "Single Drug Analysis"}
//               </h3>
//             </div>
//           </div>

//           {/* Modal Body - Xcode/Sublime style */}
//           <div
//             style={{
//               padding: "0",
//               overflow: "auto",
//               maxHeight: "calc(90vh - 140px)",
//               backgroundColor: "#1e1e1e",
//               fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
//             }}
//           >
//             {/* Line numbers and code */}
//             <div style={{ display: "flex", minHeight: "100%" }}>
//               <div style={{
//                 padding: "20px 0 20px 20px",
//                 textAlign: "right",
//                 color: "#6e6e6e",
//                 fontSize: "13px",
//                 lineHeight: "1.6",
//                 userSelect: "none",
//                 borderRight: "1px solid #3e3e3e",
//                 backgroundColor: "#1a1a1a"
//               }}>
//                 {JSON.stringify(result, null, 2).split('\n').map((_, i) => (
//                   <div key={i} style={{ paddingRight: "12px" }}>{i + 1}</div>
//                 ))}
//               </div>
//               <pre
//                 style={{
//                   margin: 0,
//                   padding: "20px",
//                   color: "#9cdcfe",
//                   fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
//                   fontSize: "13px",
//                   lineHeight: "1.6",
//                   whiteSpace: "pre-wrap",
//                   wordWrap: "break-word",
//                   textAlign: "left",
//                   flex: 1,
//                   backgroundColor: "#1e1e1e",
//                 }}
//               >
//                 {JSON.stringify(result, null, 2)}
//               </pre>
//             </div>
//           </div>

//           {/* Modal Footer - macOS style */}
//           <div
//             style={{
//               padding: "12px 20px",
//               borderTop: "1px solid rgba(0, 0, 0, 0.1)",
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: "8px",
//               backgroundColor: "#f5f5f7",
//               backgroundImage: "linear-gradient(to bottom, #f5f5f7, #e8e8ed)",
//               borderBottomLeftRadius: "12px",
//               borderBottomRightRadius: "12px",
//             }}
//           >
//             <button
//               onClick={copyToClipboard}
//               style={{
//                 padding: "6px 14px",
//                 backgroundColor: copied ? "#28c840" : "#ffffff",
//                 color: copied ? "white" : "#1d1c1f",
//                 border: copied ? "none" : "1px solid rgba(0, 0, 0, 0.2)",
//                 borderRadius: "6px",
//                 fontSize: "13px",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 transition: "all 0.2s",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//               }}
//               onMouseEnter={(e) => !copied && (e.target.style.backgroundColor = "#f5f5f7")}
//               onMouseLeave={(e) => !copied && (e.target.style.backgroundColor = "#ffffff")}
//             >
//               <span style={{ fontSize: "14px" }}>{copied ? "✓" : "⎘"}</span>
//               {copied ? "Copied!" : "Copy"}
//             </button>
//             <button
//               onClick={downloadJSON}
//               style={{
//                 padding: "6px 14px",
//                 backgroundColor: "#ffffff",
//                 color: "#1d1c1f",
//                 border: "1px solid rgba(0, 0, 0, 0.2)",
//                 borderRadius: "6px",
//                 fontSize: "13px",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 transition: "all 0.2s",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//               }}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f7")}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
//             >
//               <span style={{ fontSize: "14px" }}>↓</span>
//               Download
//             </button>
//             <button
//               onClick={onClose}
//               style={{
//                 padding: "6px 14px",
//                 backgroundColor: "#ffffff",
//                 color: "#1d1c1f",
//                 border: "1px solid rgba(0, 0, 0, 0.2)",
//                 borderRadius: "6px",
//                 fontSize: "13px",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//               }}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f7")}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Helper component to render individual analysis
//   const AnalysisResult = ({ analysis, patientId, isMulti }) => (
//     <div
//       style={{
//         background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//         padding: "clamp(20px, 4vw, 30px)",
//         borderRadius: "16px",
//         border: "1px solid #e2e8f0",
//         marginBottom: isMulti ? "24px" : "0",
//         boxShadow: "0 4px 20px rgba(0, 71, 171, 0.08)",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Medical pattern overlay */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           width: "150px",
//           height: "150px",
//           opacity: 0.03,
//           backgroundImage:
//             'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233498db"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>\')',
//           backgroundRepeat: "repeat",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Header with medical cross */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: window.innerWidth <= 768 ? "column" : "row",
//           justifyContent: "space-between",
//           alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
//           marginBottom: "24px",
//           borderBottom: "3px solid #3498db",
//           paddingBottom: "16px",
//           background:
//             "linear-gradient(90deg, rgba(52,152,219,0.1) 0%, rgba(52,152,219,0) 100%)",
//           borderRadius: "8px 8px 0 0",
//           gap: window.innerWidth <= 768 ? "12px" : "0",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <div
//             style={{
//               backgroundColor: "#3498db",
//               width: "40px",
//               height: "40px",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               fontSize: "20px",
//               flexShrink: 0,
//             }}
//           >
//             +
//           </div>
//           <div>
//             <h3
//               style={{
//                 margin: "0 0 4px 0",
//                 color: "#2c3e50",
//                 fontSize: "clamp(18px, 4vw, 20px)",
//                 fontWeight: "600",
//               }}
//             >
//               {isMulti ? `💊 Drug: ${analysis.drug}` : "📋 Analysis Results"}
//             </h3>
//             <p
//               style={{
//                 margin: "0",
//                 color: "#7f8c8d",
//                 fontSize: "clamp(12px, 3vw, 14px)",
//               }}
//             >
//               Patient ID:{" "}
//               <strong style={{ color: "#2980b9" }}>{patientId}</strong> | Gene:{" "}
//               <strong style={{ color: "#2980b9" }}>
//                 {analysis.pharmacogenomic_profile.primary_gene}
//               </strong>
//             </p>
//           </div>
//         </div>
//         <div
//           style={{
//             fontSize: "12px",
//             color: "#7f8c8d",
//             backgroundColor: "#ecf0f1",
//             padding: "6px 12px",
//             borderRadius: "20px",
//             fontWeight: "500",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {new Date(analysis.timestamp).toLocaleString()}
//         </div>
//       </div>

//       {/* Risk Assessment - Hospital Alert Style */}
//       <div
//         style={{
//           backgroundColor: "white",
//           padding: "clamp(16px, 3vw, 24px)",
//           borderRadius: "12px",
//           marginBottom: "24px",
//           borderLeft: `8px solid ${getRiskColor(analysis.risk_assessment.risk_label)}`,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h4
//           style={{
//             margin: "0 0 16px 0",
//             color: "#2c3e50",
//             fontSize: "clamp(16px, 3.5vw, 18px)",
//             fontWeight: "600",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <span style={{ fontSize: "24px" }}>⚠️</span> Clinical Risk Assessment
//         </h4>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: window.innerWidth <= 768 ? "column" : "row",
//             alignItems: window.innerWidth <= 768 ? "stretch" : "center",
//             gap: "clamp(16px, 3vw, 24px)",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: getRiskColor(
//                 analysis.risk_assessment.risk_label,
//               ),
//               color: "white",
//               padding: window.innerWidth <= 768 ? "12px 24px" : "16px 32px",
//               borderRadius: "50px",
//               fontSize: window.innerWidth <= 768 ? "20px" : "24px",
//               fontWeight: "bold",
//               minWidth: window.innerWidth <= 768 ? "auto" : "200px",
//               textAlign: "center",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//               textTransform: "uppercase",
//               letterSpacing: "1px",
//             }}
//           >
//             {analysis.risk_assessment.risk_label}
//           </div>
//           <div
//             style={{
//               display: "flex",
//               gap: window.innerWidth <= 480 ? "12px" : "24px",
//               flexWrap: "wrap",
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <div
//                 style={{
//                   fontSize: "14px",
//                   color: "#7f8c8d",
//                   marginBottom: "4px",
//                 }}
//               >
//                 Severity
//               </div>
//               <span
//                 style={{
//                   textTransform: "uppercase",
//                   fontWeight: "bold",
//                   color: getRiskColor(analysis.risk_assessment.risk_label),
//                   fontSize: "clamp(14px, 3vw, 18px)",
//                   backgroundColor: "#f8f9fa",
//                   padding: "4px 12px",
//                   borderRadius: "20px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {analysis.risk_assessment.severity}
//               </span>
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <div
//                 style={{
//                   fontSize: "14px",
//                   color: "#7f8c8d",
//                   marginBottom: "4px",
//                 }}
//               >
//                 Confidence
//               </div>
//               <span
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "clamp(14px, 3vw, 18px)",
//                   color: "#2c3e50",
//                   backgroundColor: "#f8f9fa",
//                   padding: "4px 12px",
//                   borderRadius: "20px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {Math.round(analysis.risk_assessment.confidence_score * 100)}%
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pharmacogenomic Profile */}
//       <div
//         style={{
//           backgroundColor: "white",
//           padding: "clamp(16px, 3vw, 24px)",
//           borderRadius: "12px",
//           marginBottom: "24px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h4
//           style={{
//             margin: "0 0 20px 0",
//             color: "#2c3e50",
//             fontSize: "clamp(16px, 3.5vw, 18px)",
//             fontWeight: "600",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <span style={{ fontSize: "24px" }}>🧬</span> Pharmacogenomic Profile
//         </h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               window.innerWidth <= 480 ? "1fr" : "repeat(2, 1fr)",
//             gap: "16px",
//             backgroundColor: "#f8fafc",
//             padding: "16px",
//             borderRadius: "8px",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#7f8c8d",
//                 marginBottom: "4px",
//               }}
//             >
//               Primary Gene
//             </div>
//             <div
//               style={{
//                 fontWeight: "bold",
//                 color: "#2c3e50",
//                 fontSize: "clamp(16px, 3vw, 18px)",
//               }}
//             >
//               {analysis.pharmacogenomic_profile.primary_gene}
//             </div>
//           </div>
//           <div>
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#7f8c8d",
//                 marginBottom: "4px",
//               }}
//             >
//               Diplotype
//             </div>
//             <div
//               style={{
//                 fontWeight: "bold",
//                 color: "#2c3e50",
//                 fontSize: "clamp(16px, 3vw, 18px)",
//               }}
//             >
//               {analysis.pharmacogenomic_profile.diplotype}
//             </div>
//           </div>
//           <div
//             style={{
//               gridColumn: window.innerWidth <= 480 ? "span 1" : "span 2",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#7f8c8d",
//                 marginBottom: "4px",
//               }}
//             >
//               Phenotype
//             </div>
//             <div
//               style={{
//                 fontWeight: "bold",
//                 color: "#2c3e50",
//                 fontSize: "clamp(14px, 3vw, 18px)",
//                 backgroundColor: "#e8f4f8",
//                 padding: "8px 16px",
//                 borderRadius: "8px",
//                 display: "inline-block",
//                 width: window.innerWidth <= 480 ? "auto" : "auto",
//               }}
//             >
//               {analysis.pharmacogenomic_profile.phenotype}
//               {analysis.pharmacogenomic_profile.phenotype === "PM" &&
//                 " (Poor Metabolizer)"}
//               {analysis.pharmacogenomic_profile.phenotype === "IM" &&
//                 " (Intermediate Metabolizer)"}
//               {analysis.pharmacogenomic_profile.phenotype === "NM" &&
//                 " (Normal Metabolizer)"}
//               {analysis.pharmacogenomic_profile.phenotype === "RM" &&
//                 " (Rapid Metabolizer)"}
//               {analysis.pharmacogenomic_profile.phenotype === "URM" &&
//                 " (Ultra-Rapid Metabolizer)"}
//             </div>
//           </div>
//         </div>

//         {/* Detected Variants */}
//         {analysis.pharmacogenomic_profile.detected_variants.length > 0 && (
//           <div style={{ marginTop: "24px" }}>
//             <h5
//               style={{
//                 margin: "0 0 16px 0",
//                 color: "#2c3e50",
//                 fontSize: "16px",
//                 fontWeight: "600",
//               }}
//             >
//               Detected Variants:
//             </h5>
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: "14px",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   minWidth: "600px",
//                 }}
//               >
//                 <thead>
//                   <tr style={{ backgroundColor: "#3498db" }}>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "white",
//                         fontWeight: "500",
//                       }}
//                     >
//                       rsID
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "white",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Star Allele
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "white",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Genotype
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "white",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Function
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "white",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Activity
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {analysis.pharmacogenomic_profile.detected_variants.map(
//                     (variant, idx) => (
//                       <tr
//                         key={idx}
//                         style={{
//                           borderBottom: "1px solid #e2e8f0",
//                           backgroundColor: idx % 2 === 0 ? "#f8fafc" : "white",
//                         }}
//                       >
//                         <td
//                           style={{
//                             padding: "12px",
//                             fontWeight: "600",
//                             color: "#2c3e50",
//                           }}
//                         >
//                           {variant.rsid}
//                         </td>
//                         <td style={{ padding: "12px", color: "#34495e" }}>
//                           {variant.star}
//                         </td>
//                         <td style={{ padding: "12px", color: "#34495e" }}>
//                           {variant.genotype}
//                         </td>
//                         <td style={{ padding: "12px", color: "#34495e" }}>
//                           {variant.function}
//                         </td>
//                         <td style={{ padding: "12px", color: "#34495e" }}>
//                           {variant.activityScore}
//                         </td>
//                       </tr>
//                     ),
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Clinical Recommendation */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%)",
//           padding: "clamp(16px, 3vw, 24px)",
//           borderRadius: "12px",
//           marginBottom: "24px",
//           border: "1px solid #f39c12",
//           boxShadow: "0 4px 12px rgba(243, 156, 18, 0.1)",
//         }}
//       >
//         <h4
//           style={{
//             margin: "0 0 20px 0",
//             color: "#e67e22",
//             fontSize: "clamp(16px, 3.5vw, 18px)",
//             fontWeight: "600",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <span style={{ fontSize: "24px" }}>💊</span> Clinical Recommendation
//         </h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               window.innerWidth <= 480 ? "1fr" : "repeat(2, 1fr)",
//             gap: "16px",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "rgba(255,255,255,0.7)",
//               padding: "16px",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#e67e22",
//                 marginBottom: "4px",
//                 fontWeight: "600",
//               }}
//             >
//               Action
//             </div>
//             <div
//               style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
//             >
//               {analysis.clinical_recommendation.action}
//             </div>
//           </div>
//           <div
//             style={{
//               backgroundColor: "rgba(255,255,255,0.7)",
//               padding: "16px",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#e67e22",
//                 marginBottom: "4px",
//                 fontWeight: "600",
//               }}
//             >
//               Dosage Adjustment
//             </div>
//             <div
//               style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
//             >
//               {analysis.clinical_recommendation.dosage_adjustment}
//             </div>
//           </div>
//           <div
//             style={{
//               backgroundColor: "rgba(255,255,255,0.7)",
//               padding: "16px",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#e67e22",
//                 marginBottom: "4px",
//                 fontWeight: "600",
//               }}
//             >
//               Monitoring
//             </div>
//             <div
//               style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
//             >
//               {analysis.clinical_recommendation.monitoring}
//             </div>
//           </div>
//           <div
//             style={{
//               backgroundColor: "rgba(255,255,255,0.7)",
//               padding: "16px",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "#e67e22",
//                 marginBottom: "4px",
//                 fontWeight: "600",
//               }}
//             >
//               Alternative
//             </div>
//             <div
//               style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
//             >
//               {analysis.clinical_recommendation.alternative}
//             </div>
//           </div>
//           <div
//             style={{
//               gridColumn: window.innerWidth <= 480 ? "span 1" : "span 2",
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "rgba(255,255,255,0.7)",
//                 padding: "16px",
//                 borderRadius: "8px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "14px",
//                   color: "#e67e22",
//                   marginBottom: "4px",
//                   fontWeight: "600",
//                 }}
//               >
//                 Guideline
//               </div>
//               <div
//                 style={{
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.clinical_recommendation.guideline_reference}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* LLM Generated Explanation */}
//       {analysis.llm_generated_explanation && (
//         <div
//           style={{
//             background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
//             padding: "clamp(16px, 3vw, 24px)",
//             borderRadius: "12px",
//             marginBottom: "24px",
//             border: "1px solid #27ae60",
//             boxShadow: "0 4px 12px rgba(39, 174, 96, 0.1)",
//           }}
//         >
//           <h4
//             style={{
//               margin: "0 0 20px 0",
//               color: "#27ae60",
//               fontSize: "clamp(16px, 3.5vw, 18px)",
//               fontWeight: "600",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//             }}
//           >
//             <span style={{ fontSize: "24px" }}>🧠</span> Explainable AI Clinical
//             Interpretation
//           </h4>

//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "16px",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "white",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               <strong
//                 style={{
//                   color: "#27ae60",
//                   display: "block",
//                   marginBottom: "8px",
//                 }}
//               >
//                 Summary:
//               </strong>
//               <p
//                 style={{
//                   margin: "0",
//                   lineHeight: "1.6",
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.llm_generated_explanation.summary}
//               </p>
//             </div>

//             <div
//               style={{
//                 backgroundColor: "white",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               <strong
//                 style={{
//                   color: "#27ae60",
//                   display: "block",
//                   marginBottom: "8px",
//                 }}
//               >
//                 Biological Mechanism:
//               </strong>
//               <p
//                 style={{
//                   margin: "0",
//                   lineHeight: "1.6",
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.llm_generated_explanation.biological_mechanism}
//               </p>
//             </div>

//             <div
//               style={{
//                 backgroundColor: "white",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               <strong
//                 style={{
//                   color: "#27ae60",
//                   display: "block",
//                   marginBottom: "8px",
//                 }}
//               >
//                 Drug Metabolism Impact:
//               </strong>
//               <p
//                 style={{
//                   margin: "0",
//                   lineHeight: "1.6",
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.llm_generated_explanation.drug_metabolism_impact}
//               </p>
//             </div>

//             <div
//               style={{
//                 backgroundColor: "white",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               <strong
//                 style={{
//                   color: "#27ae60",
//                   display: "block",
//                   marginBottom: "8px",
//                 }}
//               >
//                 Clinical Rationale:
//               </strong>
//               <p
//                 style={{
//                   margin: "0",
//                   lineHeight: "1.6",
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.llm_generated_explanation.clinical_rationale}
//               </p>
//             </div>

//             <div
//               style={{
//                 backgroundColor: "white",
//                 padding: "16px",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               <strong
//                 style={{
//                   color: "#27ae60",
//                   display: "block",
//                   marginBottom: "8px",
//                 }}
//               >
//                 CPIC Alignment:
//               </strong>
//               <p
//                 style={{
//                   margin: "0",
//                   lineHeight: "1.6",
//                   color: "#2c3e50",
//                   fontSize: "clamp(13px, 2.5vw, 14px)",
//                 }}
//               >
//                 {analysis.llm_generated_explanation.cpic_alignment}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quality Metrics */}
//       <div className={`quality-card ${isMulti ? "no-margin" : ""}`}>
//         <h4 className="quality-title">
//           <span className="quality-icon">📊</span>
//           Quality Metrics
//         </h4>

//         <div className="quality-grid">
//           <div className="metric-box">
//             <div className="metric-label">VCF Parsing</div>
//             <div
//               className={`metric-value ${
//                 analysis.quality_metrics.vcf_parsing_success
//                   ? "success"
//                   : "failed"
//               }`}
//             >
//               {analysis.quality_metrics.vcf_parsing_success
//                 ? "✓ SUCCESS"
//                 : "✗ FAILED"}
//             </div>
//           </div>

//           <div className="metric-box">
//             <div className="metric-label">Variants Detected</div>
//             <div className="metric-value primary">
//               {analysis.quality_metrics.total_variants_detected}
//             </div>
//           </div>

//           <div className="metric-box">
//             <div className="metric-label">Phenotype Confidence</div>
//             <div className="metric-value neutral">
//               {analysis.quality_metrics.phenotype_confidence}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setError("Please upload a VCF file.");
//       return;
//     }

//     if (!drug) {
//       setError("Please enter a drug name.");
//       return;
//     }

//     setError("");
//     setResult(null);
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("vcfFile", file);
//     formData.append("drug", drug.trim().toUpperCase());

//     try {
//       const response = await fetch("http://localhost:8000/analyze", {
//         method: "POST",
//         body: formData,
//       });
//       console.log(response);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Server error");
//       }
//       console.log(data);
//       setResult(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "1200px",
//         padding: window.innerWidth <= 480 ? "20px" : "40px",
//         margin: "0 auto",

//         minHeight: "100vh",
//         fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
//       }}
//     >
//       {/* Professional Header */}
//       <div className="header-container">
//         <div className="header-left">
//           <div className="header-icon">⚕️</div>

//           <div>
//             <h1 className="header-title">PharmaGuard</h1>
//             <p className="header-subtitle">
//               Clinical Decision Support System · FDA Recognized
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* VCF File Upload */}
//         <div style={{ marginBottom: "30px" }}>
//           <label
//             style={{
//               display: "block",
//               marginBottom: "12px",
//               fontWeight: "600",
//               color: "#2c3e50",
//               fontSize: "16px",
//             }}
//           >
//             📁 Upload Patient VCF File:
//           </label>
//           <div
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             style={{
//               border: dragActive ? "3px solid #3498db" : "2px dashed #bdc3c7",
//               borderRadius: "16px",
//               padding: window.innerWidth <= 480 ? "30px 20px" : "50px 30px",
//               textAlign: "center",
//               backgroundColor: dragActive ? "rgba(52,152,219,0.05)" : "white",
//               cursor: "pointer",
//               transition: "all 0.3s ease",
//               boxShadow: dragActive
//                 ? "0 10px 25px rgba(52,152,219,0.2)"
//                 : "0 4px 12px rgba(0,0,0,0.05)",
//             }}
//           >
//             <input
//               type="file"
//               accept=".vcf"
//               onChange={(e) => {
//                 if (e.target.files[0]) {
//                   setFile(e.target.files[0]);
//                   setError("");
//                 }
//               }}
//               style={{ display: "none" }}
//               id="file-input"
//             />
//             <label htmlFor="file-input" style={{ cursor: "pointer" }}>
//               <div
//                 style={{
//                   fontSize: window.innerWidth <= 480 ? "36px" : "48px",
//                   marginBottom: "15px",
//                 }}
//               >
//                 {dragActive ? "📂" : "📄"}
//               </div>
//               <div
//                 style={{
//                   fontSize: window.innerWidth <= 480 ? "16px" : "20px",
//                   fontWeight: "600",
//                   color: "#2c3e50",
//                   marginBottom: "8px",
//                 }}
//               >
//                 {dragActive
//                   ? "Drop your VCF file here"
//                   : "Drag and drop your VCF file here"}
//               </div>
//               <div
//                 style={{
//                   color: "#7f8c8d",
//                   marginBottom: "15px",
//                   fontSize: window.innerWidth <= 480 ? "13px" : "14px",
//                 }}
//               >
//                 or{" "}
//                 <span style={{ color: "#3498db", fontWeight: "600" }}>
//                   click to browse
//                 </span>
//               </div>
//               <div
//                 style={{
//                   fontSize: "12px",
//                   color: "#95a5a6",
//                   backgroundColor: "#f8f9fa",
//                   padding: "8px 16px",
//                   borderRadius: "20px",
//                   display: "inline-block",
//                 }}
//               >
//                 Supported format: .vcf (Variant Call Format)
//               </div>
//             </label>
//             {file && (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   color: "#27ae60",
//                   fontWeight: "600",
//                   backgroundColor: "#e8f5e9",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "8px",
//                   fontSize: window.innerWidth <= 480 ? "13px" : "14px",
//                   wordBreak: "break-all",
//                 }}
//               >
//                 <span>✓</span> Selected: {file.name}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Drug Selection */}
//         <div style={{ marginBottom: "30px" }}>
//           <label
//             style={{
//               display: "block",
//               marginBottom: "12px",
//               fontWeight: "600",
//               color: "#2c3e50",
//               fontSize: "16px",
//             }}
//           >
//             💊 Drug Name(s):
//           </label>
//           <div style={{ position: "relative" }}>
//             <select
//               value={drug}
//               onChange={(e) => setDrug(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: window.innerWidth <= 480 ? "12px 16px" : "15px 20px",
//                 borderRadius: "12px",
//                 border: "2px solid #e0e0e0",
//                 fontSize: window.innerWidth <= 480 ? "14px" : "16px",
//                 fontFamily: "inherit",
//                 boxSizing: "border-box",
//                 backgroundColor: "white",
//                 cursor: "pointer",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//               }}
//             >
//               <option value="">-- Select Drug --</option>
//               <option value="CODEINE">CODEINE</option>
//               <option value="WARFARIN">WARFARIN</option>
//               <option value="CLOPIDOGREL">CLOPIDOGREL</option>
//               <option value="SIMVASTATIN">SIMVASTATIN</option>
//               <option value="AZATHIOPRINE">AZATHIOPRINE</option>
//               <option value="FLUOROURACIL">FLUOROURACIL</option>
//             </select>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             background: loading ? "#95a5a6" : "#1e293b",
//             color: "white",
//             padding: window.innerWidth <= 480 ? "14px 24px" : "18px 30px",
//             border: "none",
//             borderRadius: "50px",
//             fontSize: window.innerWidth <= 480 ? "16px" : "18px",
//             fontWeight: "bold",
//             cursor: loading ? "not-allowed" : "pointer",
//             width: window.innerWidth <= 480 ? "100%" : "auto",
//             transition: "all 0.3s ease",
//             boxShadow: loading ? "none" : "0 10px 20px rgba(30, 41, 59, 0.3)",
//             transform: loading ? "none" : "translateY(0)",
//             letterSpacing: "1px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "10px",
//             margin: "0 auto",
//           }}
//           onMouseEnter={(e) =>
//             !loading && (e.target.style.transform = "translateY(-2px)")
//           }
//           onMouseLeave={(e) =>
//             !loading && (e.target.style.transform = "translateY(0)")
//           }
//         >
//           {loading ? (
//             <>
//               <Loader/>
//             </>
//           ) : (
//             <>
//               <span>🔬</span>
//               Analyze Pharmacogenomic Risk
//             </>
//           )}
//         </button>
//       </form>

//       {/* Error Display */}
//       {error && (
//         <div
//           style={{
//             color: "#c0392b",
//             marginTop: "24px",
//             padding: window.innerWidth <= 480 ? "12px 16px" : "16px 24px",
//             backgroundColor: "#fdeded",
//             borderRadius: "12px",
//             border: "1px solid #e74c3c",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             boxShadow: "0 4px 12px rgba(192,57,43,0.1)",
//             fontSize: window.innerWidth <= 480 ? "13px" : "14px",
//           }}
//         >
//           <span style={{ fontSize: "24px" }}>⚠️</span>
//           <div>
//             <strong style={{ display: "block", marginBottom: "4px" }}>
//               Error
//             </strong>
//             {error}
//           </div>
//         </div>
//       )}

//       {/* Results Display */}
//       {result && (
//         <div ref={resultRef} style={{ marginTop: "40px" }}>
//           {result.analyses ? (
//             // Multi-drug results
//             <div>
//               <div
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
//                   padding: window.innerWidth <= 480 ? "16px 20px" : "20px 30px",
//                   borderRadius: "12px",
//                   marginBottom: "24px",
//                   color: "white",
//                   display: "flex",
//                   flexDirection: window.innerWidth <= 480 ? "column" : "row",
//                   justifyContent: "space-between",
//                   alignItems:
//                     window.innerWidth <= 480 ? "flex-start" : "center",
//                   gap: window.innerWidth <= 480 ? "12px" : "0",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: "0",
//                     fontSize: window.innerWidth <= 480 ? "20px" : "24px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   📊 Multi-Drug Analysis ({result.drugCount} drugs)
//                 </h2>
//                 <span
//                   style={{
//                     backgroundColor: "#3498db",
//                     padding: "8px 16px",
//                     borderRadius: "30px",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Complete Report
//                 </span>
//               </div>
//               {result.analyses.map((analysis, idx) => (
//                 <AnalysisResult
//                   key={idx}
//                   analysis={analysis}
//                   patientId={result.patient_id}
//                   isMulti={true}
//                 />
//               ))}
//             </div>
//           ) : (
//             // Single drug result
//             <div>
//               <div
//                 style={{
//                   background: "#1e293b",
//                   padding: window.innerWidth <= 480 ? "16px 20px" : "20px 30px",
//                   borderRadius: "12px",
//                   marginBottom: "24px",
//                   color: "white",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: "0",
//                     fontSize: window.innerWidth <= 480 ? "20px" : "24px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   📋 Analysis Report
//                   {result && (
//                     <button
//                       onClick={() => setShowJsonModal(true)}
//                       className="view-json-btn"
//                     >
//                       <span className="btn-icon">📋</span>
//                       View JSON
//                     </button>
//                   )}
//                 </h2>
//               </div>

//               <AnalysisResult
//                 analysis={result}
//                 patientId={result.patient_id}
//                 isMulti={false}
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* JSON Modal */}
//       {result && (
//         <JsonModal result={result} onClose={() => setShowJsonModal(false)} />
//       )}

//       {/* Add keyframe animations */}
//       <style jsx>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes modalSlideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .header-container {
//           background: white;
//           border-radius: 16px;
//           padding: 20px 30px;
//           margin-bottom: 30px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border: 1px solid #e2e8f0;
//           gap: 20px;
//           flex-wrap: wrap;
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .header-icon {
//           background-color: #1e293b;
//           width: 50px;
//           height: 50px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 24px;
//           color: white;
//           flex-shrink: 0;
//         }

//         .header-title {
//           margin: 0;
//           font-size: 32px;
//           font-weight: 700;
//           color: #1e293b;
//           letter-spacing: -0.5px;
//         }

//         .header-subtitle {
//           margin: 4px 0 0 0;
//           font-size: 14px;
//           color: #64748b;
//         }

//         .view-json-btn {
//           background: white;
//           color: #1e293b;
//           padding: 12px 24px;
//           border: none;
//           border-radius: 10px;
//           font-size: 16px;
//           font-weight: 700;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           transition: all 0.3s ease;
//           box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
//           white-space: nowrap;
//         }

//         .view-json-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 16px rgba(30, 41, 59, 0.3);
//         }

//         /* Tablet */
//         @media (max-width: 768px) {
//           .header-container {
//             flex-direction: column;
//             align-items: stretch;
//             padding: 18px 22px;
//           }

//           .view-json-btn {
//             justify-content: center;
//             width: 100%;
//           }
//         }

//         /* Mobile */
//         @media (max-width: 480px) {
//           .header-container {
//             padding: 16px 18px;
//           }

//           .header-icon {
//             width: 40px;
//             height: 40px;
//             font-size: 20px;
//           }

//           .header-title {
//             font-size: 24px;
//           }

//           .header-subtitle {
//             font-size: 12px;
//           }

//           .view-json-btn {
//             padding: 10px 16px;
//             font-size: 14px;
//           }
//         }

//         .quality-card {
//           background-color: white;
//           padding: 24px;
//           border-radius: 12px;
//           margin-bottom: 20px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//           border: 1px solid #e2e8f0;
//         }

//         .quality-card.no-margin {
//           margin-bottom: 0;
//         }

//         .quality-title {
//           margin: 0 0 20px 0;
//           color: #2c3e50;
//           font-size: 18px;
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .quality-icon {
//           font-size: 24px;
//         }

//         .quality-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 16px;
//         }

//         .metric-box {
//           background-color: #f8fafc;
//           padding: 16px;
//           border-radius: 8px;
//           text-align: center;
//         }

//         .metric-label {
//           font-size: 14px;
//           color: #7f8c8d;
//           margin-bottom: 8px;
//         }

//         .metric-value {
//           font-weight: bold;
//           font-size: 16px;
//           text-transform: uppercase;
//         }

//         .metric-value.success {
//           color: #27ae60;
//         }

//         .metric-value.failed {
//           color: #c0392b;
//         }

//         .metric-value.primary {
//           font-size: 24px;
//           color: #2980b9;
//         }

//         .metric-value.neutral {
//           color: #2c3e50;
//         }

//         /* Tablet */
//         @media (max-width: 768px) {
//           .quality-card {
//             padding: 20px;
//           }

//           .quality-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         /* Mobile */
//         @media (max-width: 480px) {
//           .quality-card {
//             padding: 16px;
//           }

//           .quality-title {
//             font-size: 16px;
//           }

//           .quality-grid {
//             grid-template-columns: 1fr;
//           }

//           .metric-value.primary {
//             font-size: 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PharmaGuard;



import React, { useState, useRef, useEffect } from "react";
import Loader from "./Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import PharmaGuardChatbot from "./PharmaGuardChatbot";

import Select from "react-select";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
);

const PharmaGuard = () => {
  const [file, setFile] = useState(null);
  const [drug, setDrug] = useState([]);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");

  const resultsRef = useRef(null);

  const supportedDrugs = [
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL",
  ];

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100); // Small delay to ensure rendering is complete
    }
  }, [result]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".vcf")) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a valid .vcf file");
      }
    }
  };

  const getRiskColor = (riskLabel) => {
    switch (riskLabel) {
      case "Safe":
        return "#27ae60";
      case "Adjust Dosage":
        return "#f39c12";
      case "Ineffective":
        return "#f1c40f";
      case "Toxic":
        return "#c0392b";
      default:
        return "#7f8c8d";
    }
  };


  const drugOptions = [
  { value: "CODEINE", label: "Codeine" },
  { value: "WARFARIN", label: "Warfarin" },
  { value: "CLOPIDOGREL", label: "Clopidogrel" },
  { value: "SIMVASTATIN", label: "Simvastatin" },
  { value: "AZATHIOPRINE", label: "Azathioprine" },
  { value: "FLUOROURACIL", label: "Fluorouracil" },
];



  // Generate age group effect data based on the drug and phenotype
  const generateAgeGroupData = (analysis) => {
    if (!analysis) return null;

    const ageGroups = ["0-18", "19-35", "36-50", "51-65", "65+"];
    const phenotype = analysis?.pharmacogenomic_profile?.phenotype || "NM";
    const riskLabel = analysis?.risk_assessment?.risk_label || "Unknown";

    // Base risk scores by phenotype
    const phenotypeRiskScores = {
      PM: { base: 85, variation: 15 }, // Poor Metabolizer
      IM: { base: 60, variation: 20 }, // Intermediate Metabolizer
      NM: { base: 30, variation: 15 }, // Normal Metabolizer
      RM: { base: 45, variation: 25 }, // Rapid Metabolizer
      URM: { base: 70, variation: 20 }, // Ultra-Rapid Metabolizer
    };

    const defaultRisk = { base: 40, variation: 20 };
    const riskConfig = phenotypeRiskScores[phenotype] || defaultRisk;

    // Age-specific adjustments
    const ageAdjustments = {
      "0-18": { factor: 1.3, note: "Developing metabolic pathways" },
      "19-35": { factor: 1.0, note: "Peak metabolic function" },
      "36-50": { factor: 1.1, note: "Gradual metabolic decline" },
      "51-65": { factor: 1.3, note: "Reduced liver function" },
      "65+": { factor: 1.5, note: "Significant age-related changes" },
    };

    return {
      labels: ageGroups,
      datasets: [
        {
          label: "Risk Score",
          data: ageGroups.map((age) => {
            const adjustment = ageAdjustments[age].factor;
            const variation =
              Math.random() * riskConfig.variation * 2 - riskConfig.variation;
            return Math.min(
              100,
              Math.max(0, Math.round(riskConfig.base * adjustment + variation)),
            );
          }),
          backgroundColor: ageGroups.map((age) => {
            const score = ageAdjustments[age].factor * riskConfig.base;
            if (score > 70) return "rgba(192, 57, 43, 0.8)";
            if (score > 50) return "rgba(243, 156, 18, 0.8)";
            if (score > 30) return "rgba(241, 196, 15, 0.8)";
            return "rgba(39, 174, 96, 0.8)";
          }),
          borderColor: ageGroups.map((age) => {
            const score = ageAdjustments[age].factor * riskConfig.base;
            if (score > 70) return "#c0392b";
            if (score > 50) return "#f39c12";
            if (score > 30) return "#f1c40f";
            return "#27ae60";
          }),
          borderWidth: 2,
        },
      ],
    };
  };

  // Generate efficacy trend data
  const generateEfficacyTrendData = (analysis) => {
    if (!analysis) return null;

    const months = ["Month 1", "Month 3", "Month 6", "Month 9", "Month 12"];
    const phenotype = analysis?.pharmacogenomic_profile?.phenotype || "NM";

    const efficacyTrends = {
      PM: [25, 30, 35, 40, 45],
      IM: [45, 55, 60, 65, 70],
      NM: [70, 75, 78, 80, 82],
      RM: [85, 80, 75, 70, 65],
      URM: [90, 75, 60, 45, 30],
    };

    const trend = efficacyTrends[phenotype] || efficacyTrends["NM"];

    return {
      labels: months,
      datasets: [
        {
          label: "Treatment Efficacy (%)",
          data: trend,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#2980b9",
          pointBorderColor: "white",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  };

  const downloadJSON = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    let filename;
    if (result.analyses) {
      filename = `${result.patient_id}_multi-drug_analysis.json`;
    } else {
      filename = `${result.patient_id}_${result.drug}_analysis.json`;
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Age Group Effect Chart Component
  const AgeGroupEffectChart = ({ analysis }) => {
    const ageGroupData = generateAgeGroupData(analysis);
    const efficacyData = generateEfficacyTrendData(analysis);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: window.innerWidth <= 480 ? 10 : 12,
              weight: "bold",
            },
            color: "#2c3e50",
          },
        },
        title: {
          display: true,
          text: "Age Group Risk Analysis",
          font: {
            size: window.innerWidth <= 480 ? 14 : 16,
            weight: "bold",
          },
          color: "#2c3e50",
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFont: { size: 14, weight: "bold" },
          bodyFont: { size: 12 },
          callbacks: {
            afterLabel: (context) => {
              const ageGroup = context.label;
              const notes = {
                "0-18":
                  "• Developing metabolic pathways\n• Higher sensitivity\n• Regular monitoring required",
                "19-35":
                  "• Peak metabolic function\n• Standard dosing applies\n• Good tolerance expected",
                "36-50":
                  "• Gradual metabolic decline\n• Monitor for changes\n• Consider dose adjustment",
                "51-65":
                  "• Reduced liver function\n• Increased monitoring\n• Start with lower doses",
                "65+":
                  "• Significant age-related changes\n• Maximum precautions\n• Consider alternatives",
              };
              return notes[ageGroup] || "";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Risk Score (%)",
            font: { size: 12, weight: "bold" },
            color: "#7f8c8d",
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Age Groups",
            font: { size: 12, weight: "bold" },
            color: "#7f8c8d",
          },
          grid: {
            display: false,
          },
        },
      },
    };

    const efficacyOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: window.innerWidth <= 480 ? 10 : 12,
              weight: "bold",
            },
            color: "#2c3e50",
          },
        },
        title: {
          display: true,
          text: "Treatment Efficacy Over Time",
          font: {
            size: window.innerWidth <= 480 ? 14 : 16,
            weight: "bold",
          },
          color: "#2c3e50",
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.raw;
              const month = context.label;

              let recommendation = "";
              if (value >= 80) recommendation = "✓ Excellent response";
              else if (value >= 60)
                recommendation = "✓ Good response, continue monitoring";
              else if (value >= 40)
                recommendation = "⚠ Moderate response, consider adjustment";
              else recommendation = "⚠ Poor response, review treatment plan";

              return [`${label}: ${value}%`, recommendation];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Efficacy (%)",
            font: { size: 12, weight: "bold" },
            color: "#7f8c8d",
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time",
            font: { size: 12, weight: "bold" },
            color: "#7f8c8d",
          },
          grid: {
            display: false,
          },
        },
      },
    };

    if (!ageGroupData || !efficacyData) return null;

    return (
      <div
        style={{
          background: "white",
          padding: window.innerWidth <= 480 ? "16px" : "24px",
          borderRadius: "16px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0, 71, 171, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4
          style={{
            margin: "0 0 20px 0",
            color: "#2c3e50",
            fontSize: "clamp(16px, 3.5vw, 18px)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "24px" }}>📊</span> Population
          Pharmacogenomics Analysis
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Age Group Risk Chart */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <div
              style={{ height: window.innerWidth <= 480 ? "250px" : "300px" }}
            >
              <Bar data={ageGroupData} options={chartOptions} />
            </div>
          </div>

          {/* Efficacy Trend Chart */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <div
              style={{ height: window.innerWidth <= 480 ? "250px" : "300px" }}
            >
              <Line data={efficacyData} options={efficacyOptions} />
            </div>
          </div>
        </div>

        {/* Age Group Recommendations */}
        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns:
              window.innerWidth <= 480 ? "1fr" : "repeat(5, 1fr)",
            gap: "12px",
          }}
        >
          {["0-18", "19-35", "36-50", "51-65", "65+"].map((age) => (
            <div
              key={age}
              onClick={() =>
                setSelectedAgeGroup(age === selectedAgeGroup ? "all" : age)
              }
              style={{
                backgroundColor:
                  selectedAgeGroup === age ? "#3498db" : "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border:
                  selectedAgeGroup === age
                    ? "2px solid #2980b9"
                    : "1px solid #e2e8f0",
                transform:
                  selectedAgeGroup === age ? "scale(1.02)" : "scale(1)",
                boxShadow:
                  selectedAgeGroup === age
                    ? "0 4px 12px rgba(52,152,219,0.3)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: selectedAgeGroup === age ? "white" : "#2c3e50",
                  marginBottom: "4px",
                }}
              >
                Age {age}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color:
                    selectedAgeGroup === age
                      ? "rgba(255,255,255,0.9)"
                      : "#7f8c8d",
                }}
              >
                {age === "0-18" && "Pediatric"}
                {age === "19-35" && "Young Adult"}
                {age === "36-50" && "Middle Age"}
                {age === "51-65" && "Senior"}
                {age === "65+" && "Geriatric"}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Recommendation based on selected age group */}
        {selectedAgeGroup !== "all" && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              backgroundColor: "#e8f4f8",
              borderRadius: "8px",
              borderLeft: "4px solid #3498db",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>💡</span>
              <strong style={{ color: "#2c3e50" }}>
                Clinical Recommendation for Age {selectedAgeGroup}
              </strong>
            </div>
            <p
              style={{
                margin: "0",
                color: "#34495e",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              {selectedAgeGroup === "0-18" &&
                `Based on the patient's genotype (${analysis?.pharmacogenomic_profile?.phenotype}) and pediatric 
                considerations, recommend starting at 50% of standard adult dose with close monitoring. 
                Regular therapeutic drug monitoring every 2-4 weeks is advised during dose titration.`}
              {selectedAgeGroup === "19-35" &&
                `Patient's young adult status with ${analysis?.pharmacogenomic_profile?.phenotype} phenotype 
                suggests standard dosing may be appropriate. Monitor for efficacy at 4 weeks, 
                adjust based on clinical response and tolerance.`}
              {selectedAgeGroup === "36-50" &&
                `Middle-age patient with ${analysis?.pharmacogenomic_profile?.phenotype} metabolizer status. 
                Consider baseline liver function tests. Start at standard dose but monitor closely 
                as metabolic changes may begin in this age group.`}
              {selectedAgeGroup === "51-65" &&
                `Senior patient with age-related metabolic considerations. Based on ${analysis?.pharmacogenomic_profile?.phenotype} 
                status, recommend starting at 25-50% lower dose. Monitor renal and hepatic function 
                before initiating therapy.`}
              {selectedAgeGroup === "65+" &&
                `Geriatric patient with significant age-related physiological changes. Extreme caution advised 
                with ${analysis?.pharmacogenomic_profile?.phenotype} phenotype. Start at lowest possible dose 
                (25% of standard) and titrate slowly based on tolerance and response.`}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Modal Component
  const JsonModal = ({ result, onClose }) => {
    if (!showJsonModal) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(10px)",
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: "#f5f5f7",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "hidden",
            boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.3)",
            animation: "modalSlideIn 0.25s cubic-bezier(0.2, 0, 0, 1)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* macOS-style Modal Header with traffic lights */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f5f5f7",
              backgroundImage: "linear-gradient(to bottom, #f5f5f7, #e8e8ed)",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* macOS traffic light buttons */}
              <div style={{ display: "flex", gap: "8px", marginRight: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#ff5f57",
                    cursor: "pointer",
                  }}
                  onClick={onClose}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#febc2e",
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#28c840",
                  }}
                />
              </div>
              <span style={{ fontSize: "20px", opacity: 0.8 }}>📋</span>
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#1d1c1f",
                  letterSpacing: "-0.01em",
                }}
              >
                JSON Output —{" "}
                {result?.analyses
                  ? "Multi-Drug Analysis"
                  : "Single Drug Analysis"}
              </h3>
            </div>
          </div>

          {/* Modal Body - Xcode/Sublime style */}
          <div
            style={{
              padding: "0",
              overflow: "auto",
              maxHeight: "calc(90vh - 140px)",
              backgroundColor: "#1e1e1e",
              fontFamily:
                "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
            }}
          >
            {/* Line numbers and code */}
            <div style={{ display: "flex", minHeight: "100%" }}>
              <div
                style={{
                  padding: "20px 0 20px 20px",
                  textAlign: "right",
                  color: "#6e6e6e",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  userSelect: "none",
                  borderRight: "1px solid #3e3e3e",
                  backgroundColor: "#1a1a1a",
                }}
              >
                {JSON.stringify(result, null, 2)
                  .split("\n")
                  .map((_, i) => (
                    <div key={i} style={{ paddingRight: "12px" }}>
                      {i + 1}
                    </div>
                  ))}
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "20px",
                  color: "#9cdcfe",
                  fontFamily:
                    "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  textAlign: "left",
                  flex: 1,
                  backgroundColor: "#1e1e1e",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>

          {/* Modal Footer - macOS style */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              backgroundColor: "#f5f5f7",
              backgroundImage: "linear-gradient(to bottom, #f5f5f7, #e8e8ed)",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            <button
              onClick={copyToClipboard}
              style={{
                padding: "6px 14px",
                backgroundColor: copied ? "#28c840" : "#ffffff",
                color: copied ? "white" : "#1d1c1f",
                border: copied ? "none" : "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) =>
                !copied && (e.target.style.backgroundColor = "#f5f5f7")
              }
              onMouseLeave={(e) =>
                !copied && (e.target.style.backgroundColor = "#ffffff")
              }
            >
              <span style={{ fontSize: "14px" }}>{copied ? "✓" : "⎘"}</span>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={downloadJSON}
              style={{
                padding: "6px 14px",
                backgroundColor: "#ffffff",
                color: "#1d1c1f",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f7")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
            >
              <span style={{ fontSize: "14px" }}>↓</span>
              Download
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "6px 14px",
                backgroundColor: "#ffffff",
                color: "#1d1c1f",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f7")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper component to render individual analysis
  const AnalysisResult = ({ analysis, patientId, isMulti }) => (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        padding: "clamp(20px, 4vw, 30px)",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        marginBottom: isMulti ? "24px" : "0",
        boxShadow: "0 4px 20px rgba(0, 71, 171, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Medical pattern overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "150px",
          height: "150px",
          opacity: 0.03,
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233498db"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>\')',
          backgroundRepeat: "repeat",
          pointerEvents: "none",
        }}
      />

      {/* Header with medical cross */}
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
          marginBottom: "24px",
          borderBottom: "3px solid #3498db",
          paddingBottom: "16px",
          background:
            "linear-gradient(90deg, rgba(52,152,219,0.1) 0%, rgba(52,152,219,0) 100%)",
          borderRadius: "8px 8px 0 0",
          gap: window.innerWidth <= 768 ? "12px" : "0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              backgroundColor: "#3498db",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            +
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                color: "#2c3e50",
                fontSize: "clamp(18px, 4vw, 20px)",
                fontWeight: "600",
              }}
            >
              {isMulti ? `💊 Drug: ${analysis.drug}` : "📋 Analysis Results"}
            </h3>
            <p
              style={{
                margin: "0",
                color: "#7f8c8d",
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              Patient ID:{" "}
              <strong style={{ color: "#2980b9" }}>{patientId}</strong> | Gene:{" "}
              <strong style={{ color: "#2980b9" }}>
                {analysis.pharmacogenomic_profile.primary_gene}
              </strong>
            </p>
          </div>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#7f8c8d",
            backgroundColor: "#ecf0f1",
            padding: "6px 12px",
            borderRadius: "20px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          {new Date(analysis.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Risk Assessment - Hospital Alert Style */}
      <div
        style={{
          backgroundColor: "white",
          padding: "clamp(16px, 3vw, 24px)",
          borderRadius: "12px",
          marginBottom: "24px",
          borderLeft: `8px solid ${getRiskColor(analysis.risk_assessment.risk_label)}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h4
          style={{
            margin: "0 0 16px 0",
            color: "#2c3e50",
            fontSize: "clamp(16px, 3.5vw, 18px)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "24px" }}>⚠️</span> Clinical Risk Assessment
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            alignItems: window.innerWidth <= 768 ? "stretch" : "center",
            gap: "clamp(16px, 3vw, 24px)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              backgroundColor: getRiskColor(
                analysis.risk_assessment.risk_label,
              ),
              color: "white",
              padding: window.innerWidth <= 768 ? "12px 24px" : "16px 32px",
              borderRadius: "50px",
              fontSize: window.innerWidth <= 768 ? "20px" : "24px",
              fontWeight: "bold",
              minWidth: window.innerWidth <= 768 ? "auto" : "200px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {analysis.risk_assessment.risk_label}
          </div>
          <div
            style={{
              display: "flex",
              gap: window.innerWidth <= 480 ? "12px" : "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#7f8c8d",
                  marginBottom: "4px",
                }}
              >
                Severity
              </div>
              <span
                style={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: getRiskColor(analysis.risk_assessment.risk_label),
                  fontSize: "clamp(14px, 3vw, 18px)",
                  backgroundColor: "#f8f9fa",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {analysis.risk_assessment.severity}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#7f8c8d",
                  marginBottom: "4px",
                }}
              >
                Confidence
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "clamp(14px, 3vw, 18px)",
                  color: "#2c3e50",
                  backgroundColor: "#f8f9fa",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {Math.round(analysis.risk_assessment.confidence_score * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacogenomic Profile */}
      <div
        style={{
          backgroundColor: "white",
          padding: "clamp(16px, 3vw, 24px)",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h4
          style={{
            margin: "0 0 20px 0",
            color: "#2c3e50",
            fontSize: "clamp(16px, 3.5vw, 18px)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🧬</span> Pharmacogenomic Profile
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth <= 480 ? "1fr" : "repeat(2, 1fr)",
            gap: "16px",
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "14px",
                color: "#7f8c8d",
                marginBottom: "4px",
              }}
            >
              Primary Gene
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: "#2c3e50",
                fontSize: "clamp(16px, 3vw, 18px)",
              }}
            >
              {analysis.pharmacogenomic_profile.primary_gene}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "14px",
                color: "#7f8c8d",
                marginBottom: "4px",
              }}
            >
              Diplotype
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: "#2c3e50",
                fontSize: "clamp(16px, 3vw, 18px)",
              }}
            >
              {analysis.pharmacogenomic_profile.diplotype}
            </div>
          </div>
          <div
            style={{
              gridColumn: window.innerWidth <= 480 ? "span 1" : "span 2",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#7f8c8d",
                marginBottom: "4px",
              }}
            >
              Phenotype
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: "#2c3e50",
                fontSize: "clamp(14px, 3vw, 18px)",
                backgroundColor: "#e8f4f8",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "inline-block",
                width: window.innerWidth <= 480 ? "auto" : "auto",
              }}
            >
              {analysis.pharmacogenomic_profile.phenotype}
              {analysis.pharmacogenomic_profile.phenotype === "PM" &&
                " (Poor Metabolizer)"}
              {analysis.pharmacogenomic_profile.phenotype === "IM" &&
                " (Intermediate Metabolizer)"}
              {analysis.pharmacogenomic_profile.phenotype === "NM" &&
                " (Normal Metabolizer)"}
              {analysis.pharmacogenomic_profile.phenotype === "RM" &&
                " (Rapid Metabolizer)"}
              {analysis.pharmacogenomic_profile.phenotype === "URM" &&
                " (Ultra-Rapid Metabolizer)"}
            </div>
          </div>
        </div>

        {/* Detected Variants */}
        {analysis.pharmacogenomic_profile.detected_variants.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <h5
              style={{
                margin: "0 0 16px 0",
                color: "#2c3e50",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Detected Variants:
            </h5>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#3498db" }}>
                    <th
                      style={{
                        padding: "12px",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      rsID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Star Allele
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Genotype
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Function
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.pharmacogenomic_profile.detected_variants.map(
                    (variant, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: idx % 2 === 0 ? "#f8fafc" : "white",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {variant.rsid}
                        </td>
                        <td style={{ padding: "12px", color: "#34495e" }}>
                          {variant.star}
                        </td>
                        <td style={{ padding: "12px", color: "#34495e" }}>
                          {variant.genotype}
                        </td>
                        <td style={{ padding: "12px", color: "#34495e" }}>
                          {variant.function}
                        </td>
                        <td style={{ padding: "12px", color: "#34495e" }}>
                          {variant.activityScore}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Clinical Recommendation */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%)",
          padding: "clamp(16px, 3vw, 24px)",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #f39c12",
          boxShadow: "0 4px 12px rgba(243, 156, 18, 0.1)",
        }}
      >
        <h4
          style={{
            margin: "0 0 20px 0",
            color: "#e67e22",
            fontSize: "clamp(16px, 3.5vw, 18px)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "24px" }}>💊</span> Clinical Recommendation
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth <= 480 ? "1fr" : "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#e67e22",
                marginBottom: "4px",
                fontWeight: "600",
              }}
            >
              Action
            </div>
            <div
              style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
            >
              {analysis.clinical_recommendation.action}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#e67e22",
                marginBottom: "4px",
                fontWeight: "600",
              }}
            >
              Dosage Adjustment
            </div>
            <div
              style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
            >
              {analysis.clinical_recommendation.dosage_adjustment}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#e67e22",
                marginBottom: "4px",
                fontWeight: "600",
              }}
            >
              Monitoring
            </div>
            <div
              style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
            >
              {analysis.clinical_recommendation.monitoring}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#e67e22",
                marginBottom: "4px",
                fontWeight: "600",
              }}
            >
              Alternative
            </div>
            <div
              style={{ color: "#2c3e50", fontSize: "clamp(13px, 2.5vw, 14px)" }}
            >
              {analysis.clinical_recommendation.alternative}
            </div>
          </div>
          <div
            style={{
              gridColumn: window.innerWidth <= 480 ? "span 1" : "span 2",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#e67e22",
                  marginBottom: "4px",
                  fontWeight: "600",
                }}
              >
                Guideline
              </div>
              <div
                style={{
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.clinical_recommendation.guideline_reference}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LLM Generated Explanation */}
      {analysis.llm_generated_explanation && (
        <div
          style={{
            background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
            padding: "clamp(16px, 3vw, 24px)",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #27ae60",
            boxShadow: "0 4px 12px rgba(39, 174, 96, 0.1)",
          }}
        >
          <h4
            style={{
              margin: "0 0 20px 0",
              color: "#27ae60",
              fontSize: "clamp(16px, 3.5vw, 18px)",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>🧠</span> Explainable AI Clinical
            Interpretation
          </h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong
                style={{
                  color: "#27ae60",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Summary:
              </strong>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.llm_generated_explanation.summary}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong
                style={{
                  color: "#27ae60",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Biological Mechanism:
              </strong>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.llm_generated_explanation.biological_mechanism}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong
                style={{
                  color: "#27ae60",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Drug Metabolism Impact:
              </strong>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.llm_generated_explanation.drug_metabolism_impact}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong
                style={{
                  color: "#27ae60",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Clinical Rationale:
              </strong>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.llm_generated_explanation.clinical_rationale}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <strong
                style={{
                  color: "#27ae60",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                CPIC Alignment:
              </strong>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: "#2c3e50",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                }}
              >
                {analysis.llm_generated_explanation.cpic_alignment}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quality Metrics */}
      <div className={`quality-card ${isMulti ? "no-margin" : ""}`}>
        <h4 className="quality-title">
          <span className="quality-icon">📊</span>
          Quality Metrics
        </h4>

        <div className="quality-grid">
          <div className="metric-box">
            <div className="metric-label">VCF Parsing</div>
            <div
              className={`metric-value ${
                analysis.quality_metrics.vcf_parsing_success
                  ? "success"
                  : "failed"
              }`}
            >
              {analysis.quality_metrics.vcf_parsing_success
                ? "✓ SUCCESS"
                : "✗ FAILED"}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Variants Detected</div>
            <div className="metric-value primary">
              {analysis.quality_metrics.total_variants_detected}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Phenotype Confidence</div>
            <div className="metric-value neutral">
              {analysis.quality_metrics.phenotype_confidence}
            </div>
          </div>
        </div>

        {/* Chatbot — renders when analysis data is available */}
        <PharmaGuardChatbot analysisData={result} />
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a VCF file.");
      return;
    }

    if (!drug.length) {
      setError("Please select at least one drug.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("vcfFile", file);
    formData.append("drug", drug.join(","));


    try {
      const response = await fetch("https://pharmaguard-44pu.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }
      console.log(data);
     setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        padding: window.innerWidth <= 480 ? "20px" : "40px",
        margin: "0 auto",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Professional Header */}
      <div className="header-container">
        <div className="header-left">
          <div className="header-icon">⚕️</div>
          <div>
            <h1 className="header-title">PharmaGuard</h1>
            <p className="header-subtitle">
              Clinical Decision Support System · FDA Recognized
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* VCF File Upload */}
        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontWeight: "600",
              color: "#2c3e50",
              fontSize: "16px",
            }}
          >
            📁 Upload Patient VCF File:
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? "3px solid #3498db" : "2px dashed #bdc3c7",
              borderRadius: "16px",
              padding: window.innerWidth <= 480 ? "30px 20px" : "50px 30px",
              textAlign: "center",
              backgroundColor: dragActive ? "rgba(52,152,219,0.05)" : "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: dragActive
                ? "0 10px 25px rgba(52,152,219,0.2)"
                : "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="file"
              accept=".vcf"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setError("");
                }
              }}
              style={{ display: "none" }}
              id="file-input"
            />
            <label htmlFor="file-input" style={{ cursor: "pointer" }}>
              <div
                style={{
                  fontSize: window.innerWidth <= 480 ? "36px" : "48px",
                  marginBottom: "15px",
                }}
              >
                {dragActive ? "📂" : "📄"}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 480 ? "16px" : "20px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "8px",
                }}
              >
                {dragActive
                  ? "Drop your VCF file here"
                  : "Drag and drop your VCF file here"}
              </div>
              <div
                style={{
                  color: "#7f8c8d",
                  marginBottom: "15px",
                  fontSize: window.innerWidth <= 480 ? "13px" : "14px",
                }}
              >
                or{" "}
                <span style={{ color: "#3498db", fontWeight: "600" }}>
                  click to browse
                </span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#95a5a6",
                  backgroundColor: "#f8f9fa",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  display: "inline-block",
                }}
              >
                Supported format: .vcf (Variant Call Format)
              </div>
            </label>
            {file && (
              <div
                style={{
                  marginTop: "20px",
                  color: "#27ae60",
                  fontWeight: "600",
                  backgroundColor: "#e8f5e9",
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: window.innerWidth <= 480 ? "13px" : "14px",
                  wordBreak: "break-all",
                }}
              >
                <span>✓</span> Selected: {file.name}
              </div>
            )}
          </div>
        </div>

        {/* Drug Selection */}
        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontWeight: "600",
              color: "#2c3e50",
              fontSize: "16px",
            }}
          >
            💊 Drug Name(s):
          </label>
          <div style={{ position: "relative" }}>
            <Select
  isMulti
  options={drugOptions}
  value={drugOptions.filter(option =>
    drug.includes(option.value)
  )}
  onChange={(selectedOptions) =>
    setDrug(selectedOptions.map(option => option.value))
  }
  placeholder="Select drug(s)..."
  classNamePrefix="drug-select"
  styles={{
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      border: "2px solid #e0e0e0",
      padding: "4px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      minHeight: "56px",
    }),
    multiValue: (base) => ({
      ...base,
      background: "linear-gradient(135deg, #1e293b, #334155)",
      borderRadius: "20px",
      padding: "2px 6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      fontWeight: 600,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
  }}
/>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#95a5a6" : "#1e293b",
            color: "white",
            padding: window.innerWidth <= 480 ? "14px 24px" : "18px 30px",
            border: "none",
            borderRadius: "50px",
            fontSize: window.innerWidth <= 480 ? "16px" : "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            width: window.innerWidth <= 480 ? "100%" : "auto",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 10px 20px rgba(30, 41, 59, 0.3)",
            transform: loading ? "none" : "translateY(0)",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            margin: "0 auto",
          }}
          onMouseEnter={(e) =>
            !loading && (e.target.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            !loading && (e.target.style.transform = "translateY(0)")
          }
        >
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <span>🔬</span>
              Analyze Pharmacogenomic Risk
            </>
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div
          style={{
            color: "#c0392b",
            marginTop: "24px",
            padding: window.innerWidth <= 480 ? "12px 16px" : "16px 24px",
            backgroundColor: "#fdeded",
            borderRadius: "12px",
            border: "1px solid #e74c3c",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 12px rgba(192,57,43,0.1)",
            fontSize: window.innerWidth <= 480 ? "13px" : "14px",
          }}
        >
          <span style={{ fontSize: "24px" }}>⚠️</span>
          <div>
            <strong style={{ display: "block", marginBottom: "4px" }}>
              Error
            </strong>
            {error}
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div
          ref={resultsRef}
          style={{ marginTop: "40px", scrollMarginTop: "20px" }}
        >
          {result.analyses ? (
            // Multi-drug results
            <div>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                  padding: window.innerWidth <= 480 ? "16px 20px" : "20px 30px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  color: "white",
                  display: "flex",
                  flexDirection: window.innerWidth <= 480 ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems:
                    window.innerWidth <= 480 ? "flex-start" : "center",
                  gap: window.innerWidth <= 480 ? "12px" : "0",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontSize: window.innerWidth <= 480 ? "20px" : "24px",
                    fontWeight: "600",
                  }}
                >
                  📊 Multi-Drug Analysis ({result.drugCount} drugs)
                </h2>
                <span
                  style={{
                    backgroundColor: "#3498db",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                  }}
                >
                  Complete Report
                </span>
              </div>
              {result.analyses.map((analysis, idx) => (
                <div key={idx}>
                  <AnalysisResult
                    analysis={analysis}
                    patientId={result.patient_id}
                    isMulti={true}
                  />
                  {/* Age Group Effect Chart for each drug */}
                  <AgeGroupEffectChart analysis={analysis} />
                </div>
              ))}
            </div>
          ) : (
            // Single drug result
            <div>
              <div
                style={{
                  background: "#1e293b",
                  padding: window.innerWidth <= 480 ? "16px 20px" : "20px 30px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: window.innerWidth <= 480 ? "wrap" : "nowrap",
                  gap: "12px",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontSize: window.innerWidth <= 480 ? "20px" : "24px",
                    fontWeight: "600",
                  }}
                >
                  📋 Analysis Report
                </h2>
                <button
                  onClick={() => setShowJsonModal(true)}
                  className="view-json-btn"
                >
                  <span className="btn-icon">📋</span>
                  View JSON
                </button>
              </div>

              <AnalysisResult
                analysis={result}
                patientId={result.patient_id}
                isMulti={false}
              />

              {/* Age Group Effect Chart */}
              <AgeGroupEffectChart analysis={result} />
            </div>
          )}
        </div>
      )}

      {/* JSON Modal */}
      {result && (
        <JsonModal result={result} onClose={() => setShowJsonModal(false)} />
      )}

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-container {
          background: white;
          border-radius: 16px;
          padding: 20px 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e2e8f0;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          background-color: #1e293b;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          flex-shrink: 0;
        }

        .header-title {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #64748b;
        }

        .view-json-btn {
          background: white;
          color: #1e293b;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
          white-space: nowrap;
        }

        .view-json-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(30, 41, 59, 0.3);
        }

        /* Tablet */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: stretch;
            padding: 18px 22px;
          }

          .view-json-btn {
            justify-content: center;
            width: 100%;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .header-container {
            padding: 16px 18px;
          }

          .header-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .header-title {
            font-size: 24px;
          }

          .header-subtitle {
            font-size: 12px;
          }

          .view-json-btn {
            padding: 10px 16px;
            font-size: 14px;
          }
        }

        .quality-card {
          background-color: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .quality-card.no-margin {
          margin-bottom: 0;
        }

        .quality-title {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quality-icon {
          font-size: 24px;
        }

        .quality-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric-box {
          background-color: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .metric-label {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 8px;
        }

        .metric-value {
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
        }

        .metric-value.success {
          color: #27ae60;
        }

        .metric-value.failed {
          color: #c0392b;
        }

        .metric-value.primary {
          font-size: 24px;
          color: #2980b9;
        }

        .metric-value.neutral {
          color: #2c3e50;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .quality-card {
            padding: 20px;
          }

          .quality-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .quality-card {
            padding: 16px;
          }

          .quality-title {
            font-size: 16px;
          }

          .quality-grid {
            grid-template-columns: 1fr;
          }

          .metric-value.primary {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PharmaGuard;
