// DOM Elements
const apiToggle = document.getElementById('apiToggle');
const apiContent = document.getElementById('apiContent');
const apiProvider = document.getElementById('apiProvider');
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const originalPrompt = document.getElementById('originalPrompt');
const optimizeBtn = document.getElementById('optimizeBtn');
const getFromPageBtn = document.getElementById('getFromPage');
const loading = document.getElementById('loading');
const outputGroup = document.getElementById('outputGroup');
const optimizedPrompt = document.getElementById('optimizedPrompt');
const copyBtn = document.getElementById('copyBtn');
const sendToPageBtn = document.getElementById('sendToPage');
const status = document.getElementById('status');
const personaGrid = document.getElementById('personaGrid');
const personaCategories = document.getElementById('personaCategories');

// Persona Library Data
const PERSONA_LIBRARY = [
  {
    id: 'developer',
    name: { en: 'Software Developer', tr: 'Yazılım Geliştirici' },
    icon: '💻',
    category: 'tech',
    role: {
      en: 'You are an elite Senior Software Engineer with 20+ years of experience in clean code, design patterns, and system architecture. You write production-grade, secure, and highly optimized code.',
      tr: 'Sen temiz kod, tasarım desenleri ve sistem mimarisi konularında 20+ yıllık deneyime sahip seçkin bir Kıdemli Yazılım Mühendisisin. Üretim kalitesinde, güvenli ve son derece optimize edilmiş kodlar yazarsın.'
    }
  },
  {
    id: 'security',
    name: { en: 'Cybersecurity Expert', tr: 'Siber Güvenlik Uzmanı' },
    icon: '🛡️',
    category: 'tech',
    role: {
      en: 'You are a world-class Cybersecurity Researcher and Ethical Hacker. You specialize in vulnerability analysis, secure coding practices, and threat modeling.',
      tr: 'Sen dünya çapında bir Siber Güvenlik Araştırmacısı ve Etik Hacker’sın. Güvenlik açığı analizi, güvenli kodlama uygulamaları ve tehdit modelleme konularında uzmanlaşmışsın.'
    }
  },
  {
    id: 'data',
    name: { en: 'Data Scientist', tr: 'Veri Bilimci' },
    icon: '📊',
    category: 'tech',
    role: {
      en: 'You are an expert Data Scientist and Machine Learning Engineer. You excel at data analysis, statistical modeling, and providing actionable insights from complex datasets.',
      tr: 'Sen uzman bir Veri Bilimci ve Makine Öğrenmesi Mühendisisin. Veri analizi, istatistiksel modelleme ve karmaşık veri kümelerinden eyleme dönüştürülebilir içgörüler sağlama konusunda mükemmelsin.'
    }
  },
  {
    id: 'seo',
    name: { en: 'SEO Specialist', tr: 'SEO Uzmanı' },
    icon: '🔍',
    category: 'business',
    role: {
      en: 'You are a top-tier SEO Strategist with a deep understanding of search engine algorithms, keyword research, and content optimization to drive organic growth.',
      tr: 'Sen arama motoru algoritmaları, anahtar kelime araştırması ve organik büyümeyi teşvik etmek için içerik optimizasyonu konusunda derin bir anlayışa sahip üst düzey bir SEO Stratejistisin.'
    }
  },
  {
    id: 'startup',
    name: { en: 'Startup Mentor', tr: 'Startup Mentoru' },
    icon: '🚀',
    category: 'business',
    role: {
      en: 'You are a successful serial entrepreneur and Startup Mentor. You specialize in business models, go-to-market strategies, and scaling tech companies.',
      tr: 'Sen başarılı bir seri girişimci ve Startup Mentorusun. İş modelleri, pazara giriş stratejileri ve teknoloji şirketlerini ölçeklendirme konularında uzmanlaşmışsın.'
    }
  },
  {
    id: 'marketing',
    name: { en: 'Marketing Strategist', tr: 'Pazarlama Stratejisti' },
    icon: '📈',
    category: 'business',
    role: {
      en: 'You are a creative Marketing Director. You specialize in brand positioning, consumer psychology, and multi-channel campaign strategy.',
      tr: 'Sen yaratıcı bir Pazarlama Direktörüsün. Marka konumlandırma, tüketici psikolojisi ve çok kanallı kampanya stratejisi konularında uzmanlaşmışsın.'
    }
  },
  {
    id: 'legal',
    name: { en: 'Legal Advisor', tr: 'Hukuk Danışmanı' },
    icon: '⚖️',
    category: 'academic',
    role: {
      en: 'You are a senior Legal Consultant with expertise in corporate law, licensing, and compliance. You provide precise, formal, and legally sound advice.',
      tr: 'Sen kurumsal hukuk, lisanslama ve uyum konularında uzmanlığa sahip kıdemli bir Hukuk Danışmanısın. Hassas, resmi ve hukuki açıdan sağlam tavsiyeler verirsin.'
    }
  },
  {
    id: 'academic',
    name: { en: 'Academic Researcher', tr: 'Akademik Araştırmacı' },
    icon: '🎓',
    category: 'academic',
    role: {
      en: 'You are a distinguished Professor and Researcher. You specialize in critical analysis, academic writing, and methodology.',
      tr: 'Sen seçkin bir Profesör ve Araştırmacısın. Kritik analiz, akademik yazım ve metodoloji konularında uzmanlaşmışsın.'
    }
  },
  {
    id: 'writer',
    name: { en: 'Storyteller', tr: 'Hikaye Anlatıcısı' },
    icon: '📖',
    category: 'creative',
    role: {
      en: 'You are an award-winning Author and Storyteller. You excel at narrative structure, character development, and evocative descriptions.',
      tr: 'Sen ödüllü bir Yazar ve Hikaye Anlatıcısısın. Hikaye yapısı, karakter geliştirme ve çağrışım yapan betimlemeler konusunda mükemmelsin.'
    }
  },
  {
    id: 'ux',
    name: { en: 'UX Designer', tr: 'UX Tasarımcısı' },
    icon: '🎨',
    category: 'creative',
    role: {
      en: 'You are a Senior Product Designer focused on user experience. You specialize in user-centric design, accessibility, and intuitive interfaces.',
      tr: 'Sen kullanıcı deneyimine odaklanmış bir Kıdemli Ürün Tasarımcısısın. Kullanıcı merkezli tasarım, erişilebilirlik ve sezgisel arayüzler konularında uzmanlaşmışsın.'
    }
  },
  {
    id: 'dietitian',
    name: { en: 'Dietitian', tr: 'Diyetisyen' },
    icon: '🥗',
    category: 'health',
    role: {
      en: 'You are a certified Clinical Dietitian and Nutritionist. You provide evidence-based nutritional advice and personalized meal planning.',
      tr: 'Sen sertifikalı bir Klinik Diyetisyen ve Beslenme Uzmanısın. Kanıta dayalı beslenme tavsiyeleri ve kişiselleştirilmiş öğün planlaması sağlarsın.'
    }
  },
  {
    id: 'fitness',
    name: { en: 'Fitness Coach', tr: 'Fitness Koçu' },
    icon: '💪',
    category: 'health',
    role: {
      en: 'You are an elite Performance Coach. You specialize in exercise physiology, Strength & Conditioning, and holistic wellness.',
      tr: 'Sen seçkin bir Performans Koçusun. Egzersiz fizyolojisi, Güç ve Kondisyon ve bütünsel sağlık konularında uzmanlaşmışsın.'
    }
  }
];

let selectedPersonaId = null;

// API Endpoints
const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  claude: 'https://api.anthropic.com/v1/messages'
};

// System Prompt for Optimization - Enhanced Framework
const OPTIMIZER_SYSTEM_PROMPT = `You are a world-class expert Prompt Engineer. Transform the raw prompt provided by the user into a professional prompt that AI models will understand best.

## TASK
Optimize the given prompt using the following framework:

### 1. ANALYSIS (Internal)
- Identify the user's primary goal
- Detect missing information
- Clarify ambiguous points

### 2. OPTIMIZATION RULES
✅ **Define Role**: Give the AI a clear role (e.g., "You are an experienced Python developer" or "You are an AI Image Prompt Engineer")
✅ **Add Context**: Explain the situation and background
✅ **Image Specifics**: If it's an image prompt, include Style, Lighting, Composition, and Negative prompts
✅ **Clarify Task**: State exactly what needs to be done step-by-step
✅ **Specify Format**: Define the expected output format (list, code, paragraph, etc.)
✅ **Constraints**: Add limits and rules
✅ **Quality Criteria**: Specify success metrics

### 3. PROMPT STRUCTURE (Output in this format)
The optimized prompt should include these sections:

**ROLE**: [AI's role]
**CONTEXT**: [Situation and background]  
**TASK**: [Main task clear and concise]
**REQUIREMENTS**: [Bullet point expectations]
**FORMAT**: [Output format]
**CONSTRAINTS**: [Limits if any]

### 4. EXAMPLES

❌ BAD PROMPT:
"make a calculator with python"

✅ GOOD PROMPT:
"**ROLE**: You are an experienced Python developer.

**CONTEXT**: I am developing a simple console calculator for educational purposes for beginner students.

**TASK**: write a console calculator that can perform four operations (addition, subtraction, multiplication, division).

**REQUIREMENTS**:
- Take two numbers and operation type from the user
- Check for division by zero error
- Show results in formatted way
- Code should be explained with comments

**FORMAT**: Python code + explanation of each section

**CONSTRAINTS**: Use only standard libraries, no external packages."

---

## INSTRUCTIONS
1. Maintain the language of the prompt (Turkish if Turkish, English if English)
2. Do not over-extend, be concise and effective
3. Return ONLY the optimized prompt
4. DO NOT add explanations, comments, or introductions like "Here is the optimized prompt:"
5. Start directly with the optimized prompt`;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const settings = await chrome.storage.local.get(['apiKey', 'apiProvider', 'selectedPersonaId']);
  if (settings.apiKey) {
    apiKeyInput.value = settings.apiKey;
  }
  if (settings.apiProvider) {
    apiProvider.value = settings.apiProvider;
  }
  if (settings.selectedPersonaId) {
    selectedPersonaId = settings.selectedPersonaId;
  }

  // Render Personas
  renderPersonas('all');
});

// Render Persona Cards
function renderPersonas(category) {
  personaGrid.innerHTML = '';
  const lang = detectLanguage(originalPrompt.value || '');

  const filtered = category === 'all'
    ? PERSONA_LIBRARY
    : PERSONA_LIBRARY.filter(p => p.category === category);

  filtered.forEach(persona => {
    const card = document.createElement('div');
    card.className = `persona-card ${selectedPersonaId === persona.id ? 'active' : ''}`;
    card.dataset.id = persona.id;
    card.innerHTML = `
      <span class="persona-icon">${persona.icon}</span>
      <span class="persona-name">${persona.name[lang] || persona.name['en']}</span>
    `;

    card.addEventListener('click', () => {
      // Toggle selection
      if (selectedPersonaId === persona.id) {
        selectedPersonaId = null;
        card.classList.remove('active');
      } else {
        const prevActive = personaGrid.querySelectorAll('.persona-card.active');
        prevActive.forEach(a => a.classList.remove('active'));

        selectedPersonaId = persona.id;
        card.classList.add('active');

        // Save both ID and Role (for content.js access)
        chrome.storage.local.set({
          selectedPersonaId: persona.id,
          selectedPersonaRole: persona.role[lang] || persona.role['en']
        });

        const msg = lang === 'tr' ? `${persona.name.tr} personası seçildi!` : `${persona.name.en} persona selected!`;
        showStatus(msg, 'success');
      }
    });

    personaGrid.appendChild(card);
  });
}

// Simple language detection for popup
function detectLanguage(text) {
  const trLetters = /[çğıöşüÇĞİÖŞÜ]/;
  return trLetters.test(text) ? 'tr' : 'en';
}

// Category Filter Logic
personaCategories.addEventListener('click', (e) => {
  if (e.target.classList.contains('cat-btn')) {
    personaCategories.querySelector('.cat-btn.active').classList.remove('active');
    e.target.classList.add('active');
    renderPersonas(e.target.dataset.category);
  }
});

// Toggle API Section
apiToggle.addEventListener('click', () => {
  apiToggle.classList.toggle('active');
  apiContent.classList.toggle('show');
});

// Save API Key
saveApiKeyBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  const provider = apiProvider.value;

  if (!key) {
    showStatus('API key cannot be empty!', 'error');
    return;
  }

  await chrome.storage.local.set({
    apiKey: key,
    apiProvider: provider
  });

  showStatus('API key saved! ✓', 'success');
});

// Get Prompt from Page
getFromPageBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPrompt' });

    if (response && response.text) {
      originalPrompt.value = response.text;
      showStatus('Prompt received from page! ✓', 'success');
    } else {
      showStatus('No active textbox found', 'error');
    }
  } catch (error) {
    showStatus('Could not connect to the page', 'error');
  }
});

// Optimize Prompt
optimizeBtn.addEventListener('click', async () => {
  const prompt = originalPrompt.value.trim();

  if (!prompt) {
    showStatus('Please enter a prompt!', 'error');
    return;
  }

  const settings = await chrome.storage.local.get(['apiKey', 'apiProvider']);

  if (!settings.apiKey) {
    showStatus('API key required! Add it from settings.', 'error');
    apiToggle.classList.add('active');
    apiContent.classList.add('show');
    return;
  }

  // Show loading
  loading.classList.add('show');
  outputGroup.classList.remove('show');
  optimizeBtn.disabled = true;

  try {
    const optimized = await callAPI(prompt, settings.apiKey, settings.apiProvider || 'openai');

    optimizedPrompt.value = optimized;
    outputGroup.classList.add('show');
    showStatus('Prompt optimized successfully! ✨', 'success');

  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    loading.classList.remove('show');
    optimizeBtn.disabled = false;
  }
});

// Copy to Clipboard
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(optimizedPrompt.value);
    showStatus('Copied to clipboard! ✓', 'success');
  } catch (error) {
    showStatus('Copying failed', 'error');
  }
});

// Send to Page
sendToPageBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.tabs.sendMessage(tab.id, {
      action: 'setPrompt',
      text: optimizedPrompt.value
    });

    showStatus('Prompt sent to page! ✓', 'success');
  } catch (error) {
    showStatus('Could not connect to page', 'error');
  }
});

// API Call Function
async function callAPI(prompt, apiKey, provider) {
  const endpoint = API_ENDPOINTS[provider];

  let body, headers;

  switch (provider) {
    case 'openai':
      const openAiLang = detectLanguage(prompt);
      const openAiRole = selectedPersonaId
        ? PERSONA_LIBRARY.find(p => p.id === selectedPersonaId).role[openAiLang]
        : 'You are a world-class expert Prompt Engineer.';

      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };
      body = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', openAiRole)
          },
          { role: 'user', content: `Optimize this prompt: \n\n${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      break;

    case 'gemini':
      const geminiLang = detectLanguage(prompt);
      const geminiRole = selectedPersonaId
        ? PERSONA_LIBRARY.find(p => p.id === selectedPersonaId).role[geminiLang]
        : 'You are a world-class expert Prompt Engineer.';

      headers = {
        'Content-Type': 'application/json'
      };
      body = JSON.stringify({
        contents: [{
          parts: [{
            text: `${OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', geminiRole)}\n\nOptimize this prompt: \n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      });
      break;

    case 'claude':
      const claudeLang = detectLanguage(prompt);
      const claudeRole = selectedPersonaId
        ? PERSONA_LIBRARY.find(p => p.id === selectedPersonaId).role[claudeLang]
        : 'You are a world-class expert Prompt Engineer.';

      headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      };
      body = JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', claudeRole),
        messages: [
          { role: 'user', content: `Optimize this prompt: \n\n${prompt}` }
        ]
      });
      break;
  }

  const url = provider === 'gemini' ? `${endpoint}?key=${apiKey}` : endpoint;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API hatası');
  }

  const data = await response.json();

  // Parse response based on provider
  switch (provider) {
    case 'openai':
      return data.choices[0].message.content;
    case 'gemini':
      return data.candidates[0].content.parts[0].text;
    case 'claude':
      return data.content[0].text;
    default:
      throw new Error('Bilinmeyen provider');
  }
}

// Show Status
function showStatus(message, type = '') {
  status.textContent = message;
  status.className = 'status ' + type;

  setTimeout(() => {
    status.textContent = '';
    status.className = 'status';
  }, 3000);
}
