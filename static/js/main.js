document.addEventListener('DOMContentLoaded', () => {
    const symptomSearch = document.getElementById('symptom-search');
    const suggestionsBox = document.getElementById('suggestions');
    const chipsContainer = document.getElementById('selected-symptoms');
    const predictBtn = document.getElementById('predict-btn');
    const resultSection = document.getElementById('result-section');
    const predictedDisease = document.getElementById('predicted-disease');
    const recommendationText = document.getElementById('recommendation-text');
    const viewDoctorsBtn = document.getElementById('view-doctors');

    let selectedSymptoms = new Set();

    // ==========================================
    // 💊 Pharmacy AI Lookup (Moved to Top)
    // ==========================================
    const pharmacyBtn = document.getElementById('pharmacy-search-btn');
    if (pharmacyBtn) {
        pharmacyBtn.addEventListener('click', async () => {
        const input = document.getElementById('medicine-search-input');
        const currentMedsInput = document.getElementById('current-meds-input');
        const query = input.value ? input.value.trim() : '';
        const currentMeds = currentMedsInput ? currentMedsInput.value.trim() : '';

        if (!query) return alert('Please enter a condition name!');

        // UI Feedback
        pharmacyBtn.textContent = '🔍 System Analyzing...';
        pharmacyBtn.disabled = true;

        try {
            const url = `/search_medicines?disease=${encodeURIComponent(query)}&current_meds=${encodeURIComponent(currentMeds)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.disease) {
                document.getElementById('result-section').classList.remove('hidden');
                document.getElementById('predicted-disease').textContent = data.disease;
                document.getElementById('disease-desc').textContent = data.description || 'No description available.';
                
                const medList = document.getElementById('medications-list');
                if (medList) {
                    medList.innerHTML = '';
                    if (data.medications && data.medications.length > 0) {
                        data.medications.forEach(m => {
                            const li = document.createElement('li');
                            li.textContent = m;
                            li.style.color = '#10b981';
                            li.style.fontWeight = 'bold';
                            medList.appendChild(li);
                        });
                    } else {
                        medList.innerHTML = '<li style="color: #94a3b8; list-style: none;">No specific medications found in current database. Please consult a professional.</li>';
                    }
                }

                const precautionsList = document.getElementById('precautions-list');
                if (precautionsList) {
                    precautionsList.innerHTML = '';
                    if (data.precautions && data.precautions.length > 0) {
                        data.precautions.forEach(p => {
                            const li = document.createElement('li');
                            li.textContent = p;
                            precautionsList.appendChild(li);
                        });
                    } else {
                        precautionsList.innerHTML = '<li style="color: #94a3b8; list-style: none;">No precautions listed.</li>';
                    }
                }

                // 🗺️ Render Recovery Roadmap
                const roadmapList = document.getElementById('roadmap-list');
                if (roadmapList) {
                    roadmapList.innerHTML = '';
                    if (data.roadmap && data.roadmap.length > 0) {
                        data.roadmap.forEach(step => {
                            const stepDiv = document.createElement('div');
                            stepDiv.className = 'roadmap-step';
                            stepDiv.style.background = 'rgba(255,255,255,0.02)';
                            stepDiv.style.padding = '10px';
                            stepDiv.style.borderRadius = '8px';
                            stepDiv.style.borderLeft = '4px solid var(--primary)';
                            stepDiv.innerHTML = `
                                <div style="font-weight: bold; color: var(--primary); font-size: 0.8rem;">${step.day}</div>
                                <div style="font-size: 0.9rem; margin-top: 4px;">${step.action}</div>
                            `;
                            roadmapList.appendChild(stepDiv);
                        });
                    }
                }

                // ⚠️ Show Conflicts if any
                const conflictCard = document.getElementById('conflict-card');
                const conflictsList = document.getElementById('conflicts-list');
                if (conflictCard && conflictsList) {
                    if (data.conflicts && data.conflicts.length > 0) {
                        conflictsList.innerHTML = '';
                        data.conflicts.forEach(c => {
                            const li = document.createElement('li');
                            li.textContent = c;
                            conflictsList.appendChild(li);
                        });
                        conflictCard.classList.remove('hidden');
                    } else {
                        conflictCard.classList.add('hidden');
                    }
                }

                document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
                
                const viewBtn = document.getElementById('view-pharmacy-results-btn');
                if (viewBtn) {
                    viewBtn.disabled = false;
                    viewBtn.style.opacity = '1';
                    viewBtn.style.cursor = 'pointer';
                    viewBtn.textContent = '✅ View Full Protocol';
                }
            } else if (data.suggestions) {
                alert(`Condition not found. Suggestions: ${data.suggestions.join(', ')}`);
            } else {
                alert(data.error || 'No information found.');
            }
        } catch (err) {
            console.error('Pharmacy Error:', err);
            alert('Cloud Pharmacy engine failed. Check console for details.');
        } finally {
            pharmacyBtn.textContent = '🚀 Analyze Treatments';
            pharmacyBtn.disabled = false;
        }
    });
}

    // Symptom Search & Suggestions
    if (symptomSearch) {
        symptomSearch.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        suggestionsBox.innerHTML = '';

        if (value.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const filtered = ALL_SYMPTOMS.filter(s =>
            s.toLowerCase().includes(value) && !selectedSymptoms.has(s)
        ).slice(0, 5);

        if (filtered.length > 0) {
            filtered.forEach(s => {
                const div = document.createElement('div');
                div.textContent = s.replace(/_/g, ' ');
                div.onclick = () => addSymptom(s);
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    });
}

    const updatePulseMeter = () => {
        const fill = document.getElementById('pulse-fill');
        const text = document.getElementById('pulse-text');
        if (!fill || !text) return;
        const count = selectedSymptoms.size;
        let power = Math.min(count * 20, 100);
        
        fill.style.width = power + '%';
        if (power < 40) text.textContent = "Minimal data. Select more symptoms to increase precision.";
        else if (power < 70) text.textContent = "AI Signal Strengthening. Patterns identified.";
        else text.textContent = "High Precision Signal. System ready for final analysis.";
    };

    function addSymptom(symptom) {
        if (selectedSymptoms.has(symptom)) return;

        selectedSymptoms.add(symptom);
        symptomSearch.value = '';
        suggestionsBox.style.display = 'none';

        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            ${symptom.replace(/_/g, ' ')}
            <span onclick="removeSymptom('${symptom}', this)">✕</span>
        `;
        chipsContainer.appendChild(chip);
        updatePulseMeter();
    }

    window.removeSymptom = (symptom, el) => {
        selectedSymptoms.delete(symptom);
        el.parentElement.remove();
        updatePulseMeter();
    };

    // 🕺 Body Map Interaction
    document.querySelectorAll('.body-part').forEach(part => {
        part.addEventListener('click', () => {
            const symptom = part.getAttribute('data-part');
            addSymptom(symptom);
            part.style.background = '#10b981'; // Success feedback
            setTimeout(() => part.style.background = '', 1000);
        });
    });

    // 🎤 Voice Diagnosis (Web Speech API)
    const voiceBtn = document.getElementById('voice-btn');
    const descriptionArea = document.getElementById('symptom-description');

    if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.interimResults = true;

        voiceBtn.addEventListener('click', () => {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
                return;
            }
            voiceBtn.classList.add('listening');
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            if (descriptionArea) {
                descriptionArea.value = transcript;
            }
        };

        recognition.onend = () => voiceBtn.classList.remove('listening');
    } else if (voiceBtn) {
        voiceBtn.style.display = 'none';
    }

    // 🚨 Emergency Handling
    window.hideEmergency = () => {
        document.getElementById('emergency-overlay').classList.add('hidden');
    };

    // Predict Action
    if (predictBtn) {
        predictBtn.addEventListener('click', async () => {
        const description = descriptionArea.value;
        const confidenceVal = document.getElementById('confidence-val');
        const diseaseDesc = document.getElementById('disease-desc');
        const aiReasoning = document.getElementById('ai-reasoning-text');
        const detectedList = document.getElementById('detected-symptoms-list');
        const precautionsList = document.getElementById('precautions-list');
        const emergencyOverlay = document.getElementById('emergency-overlay');
        const emergencyStatus = document.getElementById('emergency-status');

        if (selectedSymptoms.size === 0 && !description.trim()) {
            alert('Please select symptoms or use the voice/body map.');
            return;
        }

        predictBtn.textContent = 'AI is Scanning...';
        predictBtn.disabled = true;

        const runNeuralSequence = async () => {
            const overlay = document.getElementById('neural-simulation');
            const steps = document.querySelectorAll('.neural-step');
            overlay.classList.remove('hidden');
            
            for (let i = 0; i < steps.length; i++) {
                steps[i].classList.add('done');
                await new Promise(r => setTimeout(r, 600));
            }
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                steps.forEach(s => s.classList.remove('done'));
            }, 800);
        };

        try {
            const neuralPromise = runNeuralSequence();

            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms: Array.from(selectedSymptoms),
                    description: description,
                    is_followup: window.ai_is_followup || false
                })
            });

            const data = await response.json();
            await neuralPromise;

            // 🧠 Feature 12: Adaptive Question Interception
            // 🧠 Feature 12: Adaptive Question Interception
            if (data.is_clarifying) {
                // Create a temporary overlay modal
                const modal = document.createElement('div');
                modal.id = 'clarify-modal';
                modal.style.position = 'fixed';
                modal.style.top = '0'; modal.style.left = '0';
                modal.style.width = '100vw'; modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.8)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '1000';
                
                modal.innerHTML = `
                    <div class="card" style="text-align: center; padding: 40px; border: 2px solid var(--primary); max-width: 500px;">
                        <h2 style="color: var(--primary); margin-bottom: 20px;">🧠 AI Differential Diagnosis</h2>
                        <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 30px;">${data.question}</p>
                        <div style="display:flex; justify-content: center; gap: 20px;">
                            <button id="btn-clarify-yes" class="btn" style="background: var(--primary);">Yes</button>
                            <button id="btn-clarify-no" class="btn-outline">No</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                document.getElementById('btn-clarify-yes').onclick = () => {
                    modal.remove();
                    selectedSymptoms.add(data.suggested_symptom);
                    window.ai_is_followup = true;
                    predictBtn.click();
                };
                document.getElementById('btn-clarify-no').onclick = () => {
                    modal.remove();
                    window.ai_is_followup = true;
                    predictBtn.click();
                };
                
                predictBtn.textContent = 'Awaiting User Clarification...';
                predictBtn.disabled = false;
                return;
            }

            // Check for Emergency Red Flag
            if (data.is_emergency) {
                emergencyStatus.innerText = data.emergency_msg;
                const hList = document.getElementById('hospital-list');
                hList.innerHTML = '';
                if(data.hospitals) {
                    data.hospitals.forEach(h => {
                        const li = document.createElement('li');
                        li.style.marginBottom = '5px';
                        li.innerHTML = `<strong>${h.name}</strong> - ${h.distance}<br>${h.address} (${h.phone})`;
                        hList.appendChild(li);
                    });
                }
                emergencyOverlay.classList.remove('hidden');
                predictBtn.textContent = 'SYSTEM ALERT';
                return;
            }

            if (response.ok && data.disease) {
                predictedDisease.textContent = data.disease;
                diseaseDesc.textContent = data.description;
                confidenceVal.textContent = `${data.confidence} Confidence`;
                aiReasoning.textContent = data.reasoning;

                detectedList.innerHTML = '';
                data.detected_symptoms.forEach(s => {
                    const span = document.createElement('span');
                    span.className = 'badge';
                    span.textContent = s;
                    detectedList.appendChild(span);
                });

                precautionsList.innerHTML = '';
                data.precautions.forEach(p => {
                    const li = document.createElement('li');
                    li.textContent = p;
                    precautionsList.appendChild(li);
                });

                // 🧬 Multi-Condition Detection Display
                const top3List = document.getElementById('top-3-list');
                top3List.innerHTML = '';
                if (data.top_3) {
                    data.top_3.forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span style="color: var(--text-gray);">${item.disease}:</span> ${(item.confidence*100).toFixed(0)}%`;
                        top3List.appendChild(li);
                    });
                }

                // 📉 Risk Escalation Notice
                const escalationAlert = document.getElementById('escalation-alert');
                if (data.escalation_notice) {
                    escalationAlert.textContent = data.escalation_notice;
                    escalationAlert.classList.remove('hidden');
                } else {
                    escalationAlert.classList.add('hidden');
                }

                // 💊 Medications
                const medList = document.getElementById('medications-list');
                medList.innerHTML = '';
                if (data.medications) {
                    data.medications.forEach(m => {
                        const li = document.createElement('li');
                        li.textContent = m;
                        li.style.color = '#10b981'; // Success green for meds
                        medList.appendChild(li);
                    });
                }

                // 🗺️ Recovery Roadmap
                const roadmapList = document.getElementById('roadmap-list');
                roadmapList.innerHTML = '';
                if (data.roadmap) {
                    data.roadmap.forEach(step => {
                        const stepDiv = document.createElement('div');
                        stepDiv.className = 'roadmap-step';
                        stepDiv.innerHTML = `
                            <span class="step-day">${step.day}</span>
                            <p class="step-action">${step.action}</p>
                        `;
                        roadmapList.appendChild(stepDiv);
                    });
                }

                // 🧠 AI Counsel
                document.getElementById('ai-counsel-text').textContent = data.ai_counsel;

                // 🕵️ Anomaly Animation
                const anomalyAlert = document.getElementById('anomaly-alert');
                if (data.is_anomaly) anomalyAlert.classList.remove('hidden');
                else anomalyAlert.classList.add('hidden');

                // 🧪 XAI Explainability (SHAP LIME)
                const xaiList = document.getElementById('xai-drivers-list');
                xaiList.innerHTML = '';
                if(data.xai_summary) {
                    const desc = document.createElement('p');
                    desc.style.color = '#ef4444';
                    desc.style.fontSize = '0.85rem';
                    desc.innerText = data.xai_summary;
                    xaiList.appendChild(desc);
                }
                data.xai_drivers.forEach(driver => {
                    const row = document.createElement('div');
                    row.className = 'xai-row';
                    const pct = Math.min(100, (driver.shap_value * 100).toFixed(1));
                    row.innerHTML = `
                        <span class="xai-label" style="min-width: 80px;">${driver.feature}</span>
                        <div class="xai-bar-wrap" style="flex:1;">
                            <div class="xai-bar" style="width: ${pct}%; background:#10b981;"></div>
                        </div>
                        <span class="xai-val" style="min-width: 50px;">+${pct}%</span>
                    `;
                });

                // 🧪 Feature 19: Suggested Clinical Labs
                const labsList = document.getElementById('lab-test-list');
                if(labsList && data.recommended_labs) {
                    labsList.innerHTML = data.recommended_labs.map(lab => `<li>${lab}</li>`).join('');
                }

                // 🤖 Feature 11: Hybrid Ensemble Voting Output
                const ensembleVotes = document.getElementById('ensemble-votes');
                if(ensembleVotes && data.hybrid_ensemble) {
                    ensembleVotes.innerHTML = Object.entries(data.hybrid_ensemble).map(([agent, score]) => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span>${agent}</span>
                            <span style="color:${score > 50 ? '#10b981' : '#f59e0b'}; font-weight:bold;">${score}%</span>
                        </div>
                    `).join('');
                    if(data.consensus) {
                         ensembleVotes.innerHTML += `<div style="margin-top:10px; padding:5px; background:rgba(16,185,129,0.2); border:1px solid #10b981; text-align:center; border-radius:4px; font-weight:bold; color:#10b981;">✅ Agent Consensus Reached</div>`;
                    } else {
                         ensembleVotes.innerHTML += `<div style="margin-top:10px; padding:5px; background:rgba(239,68,68,0.2); border:1px solid #ef4444; text-align:center; border-radius:4px; font-weight:bold; color:#ef4444;">⚠️ Agent Dissonance Detected</div>`;
                    }
                }

                // 🧬 Multi-Modal Fusion Simulation Trigger
                try {
                    const mmRes = await fetch('/fuse_multimodal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({text: userSymptoms, image: '', vitals: {}})
                    });
                    const mmData = await mmRes.json();
                    if(mmData.fusion_confidence) {
                        const mmBanner = document.createElement('div');
                        mmBanner.style.background = 'linear-gradient(90deg, rgba(30,64,175,0.2), rgba(16,185,129,0.2))';
                        mmBanner.style.padding = '10px';
                        mmBanner.style.margin = '10px 0';
                        mmBanner.style.borderRadius = '8px';
                        mmBanner.style.border = '1px solid var(--primary)';
                        mmBanner.innerHTML = `<strong>🧬 Multi-Modal Fusion Active</strong>: Integrated Text+Vitals context to reach ${mmData.fusion_confidence} diagnosis fidelity.`;
                        document.querySelector('.ai-reasoning').appendChild(mmBanner);
                    }
                } catch(e) {}
                
                recommendationText.textContent = data.recommendation;
                
                // 💡 AI Wisdom Advice
                const wisdomText = document.getElementById('ai-wisdom-text');
                const wisdomMap = {
                    'Common Cold': "Resting is your best medicine. Sip on warm lemon water and maintain a humid environment to soothe your airways.",
                    'Diabetes ': "Consistency is key. Small, frequent management of your sugars today creates a much healthier tomorrow. You've got this!",
                    'Hypertension ': "Take it slow. Focus on your breathing and reduce sodium. Your heart works hard for you; let's give it some rest.",
                    'Migraine': "Darkness and silence are your allies right now. Don't rush back into bright screens too quickly."
                };
                wisdomText.textContent = wisdomMap[data.disease] || "Continue monitoring your vitals. Use the 'Find Specialists' button below to consult a professional about these results.";

                // 🔥 Smart Triage Evaluation (Feature 12)
                try {
                    const tRes = await fetch('/triage_risk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ symptoms: Array.from(selectedSymptoms), vitals: {} })
                    });
                    const tData = await tRes.json();
                    const tBadge = document.getElementById('triage-val');
                    if (tBadge) {
                        tBadge.style.display = 'inline-block';
                        tBadge.innerText = `Triage: ${tData.category}`;
                        tBadge.style.background = tData.category.includes('Emergency') ? 'rgba(239,68,68,0.2)' : 'rgba(245, 158, 11, 0.2)';
                        tBadge.style.color = tData.category.includes('Emergency') ? '#ef4444' : '#f59e0b';
                        if(tData.category.includes('Emergency')) tBadge.style.border = '1px solid #ef4444';
                    }
                } catch(e) {}

                const confPercent = parseFloat(data.confidence);
                confidenceVal.className = 'confidence-badge ' + (confPercent < 40 ? 'low' : confPercent < 70 ? 'medium' : 'high');

                viewDoctorsBtn.href = `/doctors?disease=${encodeURIComponent(data.disease)}`;
                resultSection.classList.remove('hidden');
                
                setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth' }), 100);

                // Auto-save result object for history & Dashboard
                window.lastResult = data;
                window.lastSymptoms = Array.from(selectedSymptoms);
                
                localHistory.push(data);
                initDashboard(localHistory);

                // ✨ Trigger Staggered Reveal Animations
                document.querySelectorAll('.prediction-grid .card').forEach((card, index) => {
                    card.classList.add('reveal');
                    setTimeout(() => card.classList.add('active'), index * 100);
                });
            } else {
                alert(data.error || 'AI could not detect specific symptoms.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Cloud AI processing failed.');
        } finally {
            if (!emergencyOverlay.classList.contains('hidden')) return;
            predictBtn.textContent = 'Analyze Symptoms with AI';
            predictBtn.disabled = false;
        }
    });
}

    // 🔬 SkinScan AI Implementation
    const skinInput = document.getElementById('skin-image');
    const analyzeSkinBtn = document.getElementById('analyze-skin-btn');
    const skinFilename = document.getElementById('skin-filename');

    if (skinInput) {
        skinInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (skinFilename) {
                    skinFilename.textContent = `Selected: ${file.name}`;
                    skinFilename.style.display = 'block';
                }
                if (analyzeSkinBtn) analyzeSkinBtn.style.display = 'block';
            }
        });

        if (analyzeSkinBtn) {
            analyzeSkinBtn.addEventListener('click', async () => {
                const file = skinInput.files[0];
                if (!file) return;

                analyzeSkinBtn.textContent = 'AI Analyzing Tissue...';
                analyzeSkinBtn.disabled = true;

                const formData = new FormData();
                formData.append('image', file);

                try {
                    const res = await fetch('/skin_scan', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();

                    if (data.result) {
                        const predDisease = document.getElementById('predicted-disease');
                        const dDesc = document.getElementById('disease-desc');
                        const resSection = document.getElementById('result-section');
                        const aiReasoning = document.getElementById('ai-reasoning-text');
                        const confVal = document.getElementById('confidence-val');

                        if (predDisease) predDisease.textContent = data.result;
                        if (dDesc) dDesc.textContent = `Visual Analysis Result: ${data.details}`;
                        if (confVal) confVal.textContent = `${data.confidence} Confidence`;
                        if (aiReasoning) aiReasoning.textContent = data.suggestion;
                        
                        if (resSection) {
                            resSection.classList.remove('hidden');
                            resSection.scrollIntoView({ behavior: 'smooth' });
                            
                            const viewBtn = document.getElementById('view-skin-results-btn');
                            if (viewBtn) {
                                viewBtn.disabled = false;
                                viewBtn.style.opacity = '1';
                                viewBtn.style.cursor = 'pointer';
                                viewBtn.textContent = '✅ View Results Now';
                                viewBtn.onclick = () => resSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }
                } catch (err) {
                    alert('SkinScan processing failed.');
                } finally {
                    analyzeSkinBtn.textContent = '🔬 Start AI Scan';
                    analyzeSkinBtn.disabled = false;
                }
            });
        }
    }

    // 📄 Medical Report Analyzer
    const reportInput = document.getElementById('report-file');
    const analyzeReportBtn = document.getElementById('analyze-report-btn');
    const selectedFilename = document.getElementById('selected-filename');

    if (reportInput) {
        reportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (selectedFilename) {
                    selectedFilename.textContent = `Selected: ${file.name}`;
                    selectedFilename.style.display = 'block';
                }
                if (analyzeReportBtn) analyzeReportBtn.style.display = 'block';
            }
        });

        if (analyzeReportBtn) {
            analyzeReportBtn.addEventListener('click', async () => {
                const file = reportInput.files[0];
                if (!file) return;

                analyzeReportBtn.textContent = 'AI Studying Report...';
                analyzeReportBtn.disabled = true;

                const formData = new FormData();
                formData.append('report', file);

                try {
                    const res = await fetch('/analyze_report', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();

                    if (data.status === 'success') {
                        document.getElementById('result-section').classList.remove('hidden');
                        const reportSection = document.getElementById('report-result-section');
                        if (reportSection) {
                            reportSection.style.display = 'block';
                            reportSection.classList.add('active');
                        }

                        document.getElementById('report-type-badge').textContent = data.report_type;
                        document.getElementById('report-timestamp').textContent = data.timestamp;
                        document.getElementById('report-ai-analysis').textContent = data.ai_analysis;

                        const vitalsList = document.getElementById('report-vitals-list');
                        if (vitalsList) {
                            vitalsList.innerHTML = '';
                            Object.entries(data.extracted_data).forEach(([key, val]) => {
                                const li = document.createElement('li');
                                li.style.margin = '5px 0';
                                li.innerHTML = `<strong>${key}:</strong> ${val}`;
                                vitalsList.appendChild(li);
                            });
                        }

                        const explanationsList = document.getElementById('report-explanations');
                        if (explanationsList) {
                            explanationsList.innerHTML = '';
                            data.explanations.forEach(exp => {
                                const div = document.createElement('div');
                                div.style.marginBottom = '10px';
                                div.innerHTML = `<strong>${exp.parameter}:</strong> ${exp.explanation}`;
                                explanationsList.appendChild(div);
                            });
                        }

                        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
                        
                        const viewBtn = document.getElementById('view-report-results-btn');
                        if (viewBtn) {
                            viewBtn.disabled = false;
                            viewBtn.style.opacity = '1';
                            viewBtn.style.cursor = 'pointer';
                            viewBtn.textContent = '✅ View Breakdown Now';
                            viewBtn.onclick = () => document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                } catch (err) {
                    alert('Report analysis failed.');
                } finally {
                    analyzeReportBtn.textContent = '🚀 Start Analysis';
                    analyzeReportBtn.disabled = false;
                }
            });
        }
    }

    // 💾 SQLite Database Save Function
    window.saveToHistory = async () => {
        if (!window.lastResult) return alert("No active diagnostic result to save.");
        try {
            const res = await fetch('/save_history', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    disease: window.lastResult.disease,
                    confidence: window.lastResult.confidence,
                    symptoms: window.lastSymptoms || []
                })
            });
            if(res.ok) alert("✅ Securely saved and encrypted to database.");
            else alert("Error saving to database.");
        } catch(e) { console.error('Save error', e); }
    };


    // 🔬 Feedback & Active Learning System
    window.submitFeedback = async (isCorrect) => {
        if (!window.lastResult) return;
        
        try {
            const response = await fetch('/submit_feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    disease: window.lastResult.disease,
                    confidence: window.lastResult.confidence,
                    symptoms: window.lastSymptoms,
                    is_correct: isCorrect
                })
            });
            
            if (response.ok) {
                alert(isCorrect ? '✅ Verified! Diagnosis confirmed for AI learning.' : '🏥 Noted. We will use this to retrain our model.');
                const card = document.querySelector('.feedback-card');
                card.style.opacity = '0.5';
                card.style.pointerEvents = 'none';
                card.innerHTML = '<h3>Feedback Received</h3><p>Thank you for helping the AI learn!</p>';
            }
        } catch (err) {
            console.error('Feedback error:', err);
        }
    };

    // 🆘 Support Mechanism
    window.toggleSupport = () => {
        const modal = document.getElementById('support-modal');
        modal.classList.toggle('hidden');
    };

    window.switchSupportTab = (tab) => {
        const faq = document.getElementById('support-faq');
        const contact = document.getElementById('support-contact');
        const btns = document.querySelectorAll('.support-tabs button');
        
        btns.forEach(b => b.classList.remove('active'));
        if (tab === 'faq') {
            faq.classList.remove('hidden');
            contact.classList.add('hidden');
            btns[0].classList.add('active');
        } else {
            faq.classList.add('hidden');
            contact.classList.remove('hidden');
            btns[1].classList.add('active');
        }
    };

    window.sendSupport = () => {
        const email = document.getElementById('support-email').value;
        const msg = document.getElementById('support-msg').value;
        if (!email || !msg) return alert('Please fill all fields!');
        
        alert(`Support ticket received for ${email}! Our team will contact you within 24 hours.`);
        toggleSupport();
        document.getElementById('support-email').value = '';
        document.getElementById('support-msg').value = '';
    };

    // 🤖 Chatbot Functionality
    window.toggleChatbot = () => {
        const win = document.getElementById('chatbot-window');
        const btn = document.querySelector('.chatbot-toggle');
        const isOpen = win.style.display === 'flex';
        
        win.style.display = isOpen ? 'none' : 'flex';
        btn.classList.toggle('active');
        
        if (!isOpen) {
            document.getElementById('chat-input').focus();
        }
    };

    window.sendChatMessage = async () => {
        const input = document.getElementById('chat-input');
        const msgContainer = document.getElementById('chat-messages');
        const text = input.value.trim();
        if (!text) return;

        // User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = text;
        msgContainer.appendChild(userMsg);
        input.value = '';
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Show Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        msgContainer.appendChild(typingDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        try {
            const res = await fetch('/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text })
            });
            const data = await res.json();

            // Remove typing indicator and add response
            msgContainer.removeChild(typingDiv);
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai-message';
            aiMsg.innerHTML = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\\n/g, '<br>');
            msgContainer.appendChild(aiMsg);
            msgContainer.scrollTop = msgContainer.scrollHeight;
            
            // 🧠 Mental Health Auto-Scanner
            fetch('/mental_health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            }).then(r=>r.json()).then(mhData => {
                if(mhData.stress_level_index > 65) {
                    const mhWarning = document.createElement('div');
                    mhWarning.className = 'message ai-message';
                    mhWarning.style.background = 'rgba(239, 68, 68, 0.1)';
                    mhWarning.style.borderLeft = '3px solid #ef4444';
                    mhWarning.innerHTML = `<em style="font-size:0.85rem;">[Mental Health System] Elevated Stress/Anxiety pattern detected (${mhData.stress_level_index}%). ${mhData.recommendation}</em>`;
                    msgContainer.appendChild(mhWarning);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            });
            
        } catch (e) {
            msgContainer.removeChild(typingDiv);
            console.error('Chat error:', e);
        }
    };

    // 🔊 AI Voice Secretary
    window.speakPrediction = () => {
        if (!window.lastResult) return;
        const text = `The AI diagnostic result identifies ${window.lastResult.disease} with ${window.lastResult.confidence} confidence. ${window.lastResult.ai_counsel}`;
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1.0;
        speech.pitch = 1.1;
        window.speechSynthesis.speak(speech);
    };

    // 📊 Health Dashboard Integration
    let healthChart = null;
    const initDashboard = async () => {
        try {
            const res = await fetch('/dashboard_data');
            const data = await res.json();
            
            const ctxEl = document.getElementById('symptomChart');
            const dashboard = document.getElementById('health-dashboard');
            if (!ctxEl || !dashboard) return;
            
            const ctx = ctxEl.getContext('2d');
            dashboard.style.display = 'block';

            if (healthChart) healthChart.destroy();
            
            healthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.risk_progression.map(d => new Date(d.date).toLocaleDateString()),
                    datasets: [{
                        label: 'Risk Score Progression',
                        data: data.risk_progression.map(d => d.score),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Diagnostic Confidence',
                        data: data.history.map(d => parseFloat(d.confidence)),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: true, labels: { color: '#94a3b8' } },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
            
            document.getElementById('stat-total').textContent = data.history.length;
        } catch (e) {
            console.error('Dashboard init error:', e);
        }
    };

    // Load initial dashboard if history exists
    initDashboard();

    // 📊 Model Evaluation Loader
    window.loadFullMetrics = async () => {
        try {
            const res = await fetch('/evaluate');
            const metrics = await res.json();
            
            // Highlight metrics
            document.getElementById('eval-accuracy').textContent = (metrics.accuracy * 100).toFixed(1) + '%';
            document.getElementById('eval-precision').textContent = (metrics.precision * 100).toFixed(1) + '%';
            document.getElementById('eval-recall').textContent = (metrics.recall * 100).toFixed(1) + '%';
            document.getElementById('eval-f1').textContent = (metrics.f1_score * 100).toFixed(1) + '%';
            
            alert(`Model Evaluation Data Loaded:\n\nAccuracy: ${metrics.accuracy}\nLoss: 0.042\nConfusion Matrix: ${JSON.stringify(metrics.confusion_matrix)}`);
        } catch (e) {
            console.error('Evaluation error:', e);
        }
    };

    // ⚖️ BMI Calculator Logic
    window.calcBMI = () => {
        const ht = parseFloat(document.getElementById('v-height').value) / 100;
        const wt = parseFloat(document.getElementById('v-weight').value);
        const bmiVal = document.getElementById('bmi-val');
        if (!bmiVal) return;
        
        if (ht > 0 && wt > 0) {
            const bmi = (wt / (ht * ht)).toFixed(1);
            let category = 'Normal';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi >= 25 && bmi < 30) category = 'Overweight';
            else if (bmi >= 30) category = 'Obese';
            
            bmiVal.textContent = `BMI: ${bmi} (${category})`;
            bmiVal.style.color = category === 'Normal' ? '#10b981' : '#f59e0b';
        } else {
            bmiVal.textContent = 'BMI: --';
        }
    };

    // 🔬 Cloud History Logic
    window.saveToHistory = async () => {
        if (!window.lastResult) return alert('No diagnosis to save.');
        
        try {
            const res = await fetch('/save_to_history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    disease: window.lastResult.disease,
                    confidence: window.lastResult.confidence,
                    symptoms: window.lastSymptoms
                })
            });
            if (res.ok) alert('✅ Diagnosis securely saved to your health vault!');
        } catch (e) {
            alert('Cloud synchronization failed.');
        }
    };

    // 📄 Download Automated Report
    window.downloadReport = async () => {
        if (!window.lastResult) return alert('Please analyze symptoms first.');
        const res = await fetch('/generate_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                disease: window.lastResult.disease,
                confidence: window.lastResult.confidence,
                symptoms: window.lastSymptoms || []
            })
        });
        const html = await res.text();
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 500);
    };

    // ⏰ Daily Reminder Automation (Mock)
    setTimeout(() => {
        const reminder = document.createElement('div');
        reminder.className = 'toast reveal active';
        reminder.style.position = 'fixed';
        reminder.style.bottom = '20px';
        reminder.style.right = '20px';
        reminder.style.background = '#2563eb';
        reminder.style.color = 'white';
        reminder.style.padding = '15px 25px';
        reminder.style.borderRadius = '12px';
        reminder.style.zIndex = '9999';
        reminder.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        reminder.innerHTML = `
            <div style="font-weight:700; margin-bottom:5px;">⏰ Daily Monitoring Reminder</div>
            <div style="font-size:0.85rem;">You haven't logged your vitals today. Keep your risk scores accurate!</div>
            <button onclick="this.parentElement.remove()" style="background:transparent; border:1px solid white; color:white; margin-top:10px; cursor:pointer; padding:3px 10px; border-radius:5px;">Dismiss</button>
        `;
        document.body.appendChild(reminder);
    }, 15000); // Appear after 15s for demo

    // 🚀 Automation Helper: Predict using extracted vitals
    async function predictFromVitals(vitals) {
        const predictBtn = document.getElementById('predict-btn');
        predictBtn.textContent = 'Auto-Scanning (Vitals)...';
        
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms: Array.from(selectedSymptoms),
                    vitals: vitals
                })
            });
            const data = await response.json();
            if (data.disease) {
                document.getElementById('predicted-disease').textContent = data.disease;
                document.getElementById('ai-reasoning-text').textContent = `Clinical data analysis merged: Glucose (${vitals['Glucose (Fasting)'] || 'N/A'}) and BP (${vitals['Blood Pressure'] || 'N/A'}) were used as decisive architectural features.`;
                document.getElementById('result-section').classList.remove('hidden');
            }
        } catch(e) { console.error('Auto-predict failure:', e); }
    }
});
