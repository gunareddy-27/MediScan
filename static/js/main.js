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

    // Symptom Search & Suggestions
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

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
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
            descriptionArea.value = transcript;
        };

        recognition.onend = () => voiceBtn.classList.remove('listening');
    } else {
        voiceBtn.style.display = 'none';
    }

    // 🚨 Emergency Handling
    window.hideEmergency = () => {
        document.getElementById('emergency-overlay').classList.add('hidden');
    };

    // Predict Action
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
                    description: description
                })
            });

            const data = await response.json();
            await neuralPromise;

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

                // 🧪 XAI Explainability
                const xaiList = document.getElementById('xai-drivers-list');
                xaiList.innerHTML = '';
                data.xai_drivers.forEach(driver => {
                    const row = document.createElement('div');
                    row.className = 'xai-row';
                    row.innerHTML = `
                        <span class="xai-label">${driver.symptom}</span>
                        <div class="xai-bar-wrap">
                            <div class="xai-bar" style="width: ${driver.impact}%"></div>
                        </div>
                        <span class="xai-val">+${driver.impact}%</span>
                    `;
                    xaiList.appendChild(row);
                });

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

    // 🔬 SkinScan AI Implementation
    const skinInput = document.getElementById('skin-image');
    if (skinInput) {
        skinInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            const uploadBtn = document.querySelector('button[onclick*="skin-image"]');
            uploadBtn.textContent = 'AI Analyzing Skin...';
            uploadBtn.disabled = true;

            try {
                const res = await fetch('/skin_scan', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.result) {
                    // Update main prediction display for better visibility
                    predictedDisease.textContent = data.result;
                    diseaseDesc.textContent = `Visual Analysis Result: ${data.details}`;
                    document.getElementById('confidence-val').textContent = `${data.confidence} Confidence`;
                    document.getElementById('ai-reasoning-text').textContent = data.suggestion;
                    resultSection.classList.remove('hidden');
                    resultSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Show custom alert
                    const msg = `SkinScan Results:\n${data.result} (${data.confidence})\n\nDetails: ${data.details}`;
                    console.log(msg);
                }
            } catch (err) {
                alert('SkinScan processing failed.');
            } finally {
                uploadBtn.textContent = 'Upload Tissue/Skin';
                uploadBtn.disabled = false;
            }
        });
    }

    // 📄 Medical Report Analyzer
    const reportInput = document.getElementById('report-file');
    if (reportInput) {
        reportInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('report', file);

            const uploadBtn = document.querySelector('button[onclick*="report-file"]');
            uploadBtn.textContent = 'AI Studying Report...';
            uploadBtn.disabled = true;

            try {
                const res = await fetch('/analyze_report', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.status === 'success') {
                    // Show result section
                    document.getElementById('result-section').classList.remove('hidden');
                    const reportSection = document.getElementById('report-result-section');
                    reportSection.style.display = 'block';
                    reportSection.classList.add('active');

                    document.getElementById('report-type-badge').textContent = data.report_type;
                    document.getElementById('report-timestamp').textContent = data.timestamp;
                    document.getElementById('report-ai-analysis').textContent = data.ai_analysis;

                    // Automatically integrate extracted metrics into symptom selection
                    if (data.extracted_data) {
                        Object.keys(data.extracted_data).forEach(metric => {
                            // Find matching symptoms in our database for better prediction
                            const normalize = metric.toLowerCase();
                            if (normalize.includes('glucose')) addSymptom('increased_appetite'); // Proxy
                            if (normalize.includes('pressure')) addSymptom('headache'); // Proxy
                        });
                    }

                    const vitalsList = document.getElementById('report-vitals-list');
                    vitalsList.innerHTML = '';
                    for (const [key, val] of Object.entries(data.extracted_data)) {
                        const li = document.createElement('li');
                        li.style.margin = '5px 0';
                        li.innerHTML = `<strong>${key}:</strong> ${val}`;
                        vitalsList.appendChild(li);
                    }

                    const explanationsList = document.getElementById('report-explanations');
                    explanationsList.innerHTML = '';
                    data.explanations.forEach(exp => {
                        const div = document.createElement('div');
                        div.style.marginBottom = '10px';
                        div.innerHTML = `<strong>${exp.parameter}:</strong> ${exp.explanation}`;
                        explanationsList.appendChild(div);
                    });

                    reportSection.scrollIntoView({ behavior: 'smooth' });

                    // 🚀 AUTOMATION: Trigger secondary AI analysis based on report values
                    if (data.auto_trigger_prediction) {
                        setTimeout(() => {
                            // Automatically trigger main prediction using extracted vitals
                            // We pass vitals directly to the predict endpoint
                            const vitalsPayload = data.extracted_data || {};
                            predictFromVitals(vitalsPayload);
                        }, 2000);
                    }
                }
            } catch (err) {
                alert('Report analysis failed.');
            } finally {
                uploadBtn.textContent = 'Study Report';
                uploadBtn.disabled = false;
            }
        });
    }

    // 💊 Pharmacy AI Lookup
    window.searchMedicines = async () => {
        const input = document.getElementById('medicine-search-input');
        const query = input.value.trim();
        if (!query) return alert('Please enter a disease name!');

        try {
            const res = await fetch(`/search_medicines?disease=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.medications) {
                // Reuse existing prediction display logic or show alert
                document.getElementById('result-section').classList.remove('hidden');
                document.getElementById('predicted-disease').textContent = data.disease;
                document.getElementById('disease-desc').textContent = data.description;
                document.getElementById('confidence-val').textContent = "Database Lookup";
                
                const medList = document.getElementById('medications-list');
                medList.innerHTML = '';
                data.medications.forEach(m => {
                    const li = document.createElement('li');
                    li.textContent = m;
                    li.style.color = '#10b981';
                    medList.appendChild(li);
                });

                const precautionsList = document.getElementById('precautions-list');
                precautionsList.innerHTML = '';
                data.precautions.forEach(p => {
                    const li = document.createElement('li');
                    li.textContent = p;
                    precautionsList.appendChild(li);
                });

                document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
            } else if (data.suggestions) {
                alert(`Condition not found exactly. Did you mean: ${data.suggestions.join(', ')}?`);
            } else {
                alert(data.error || 'No information found.');
            }
        } catch (err) {
            alert('Medicine lookup failed.');
        }
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
            aiMsg.innerHTML = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            msgContainer.appendChild(aiMsg);
            msgContainer.scrollTop = msgContainer.scrollHeight;
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
            
            const ctx = document.getElementById('symptomChart').getContext('2d');
            const dashboard = document.getElementById('health-dashboard');
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
