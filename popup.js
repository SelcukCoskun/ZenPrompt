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
  gemini: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
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

  // Show loading
  loading.classList.add('show');
  outputGroup.classList.remove('show');
  optimizeBtn.disabled = true;

  try {
    if (!settings.apiKey) {
      throw new Error('No API Key');
    }

    const optimized = await callAPI(prompt, settings.apiKey, settings.apiProvider || 'openai');

    optimizedPrompt.value = optimized;
    outputGroup.classList.add('show');
    showStatus('Prompt optimized successfully! ✨', 'success');

  } catch (error) {
    console.error('API Error:', error);

    // Silent Fallback to Local Mode
    try {
      const result = enhancePromptLocally(prompt);
      optimizedPrompt.value = result.enhanced;
      outputGroup.classList.add('show');

      if (result.missing.length > 0) {
        showStatus(`${result.typeName} template applied | Missing: ${result.missing.join(', ')}`, 'info');
      } else {
        showStatus(`${result.typeName} template applied! ✨`, 'success');
      }

    } catch (localError) {
      showStatus(`Error: ${error.message}`, 'error');
    }
  } finally {
    loading.classList.remove('show');
    optimizeBtn.disabled = false;
  }
});

// ========== LOCAL PROMPT ENHANCEMENT (API-LESS) ==========

const PROMPT_TYPES = {
  code: {
    keywords: ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'sql', 'html', 'css', 'react', 'vue', 'angular', 'node', 'django', 'flask', 'code', 'script', 'program', 'function', 'class', 'api', 'database', 'backend', 'frontend', 'algorithm', 'debug', 'error', 'app', 'web', 'mobile', 'bot', 'automation'],
    role: { en: 'You are an experienced software developer.', tr: 'Sen deneyimli bir yazılım geliştiricisisin.' },
    format: { en: 'Clean, commented code + explanation', tr: 'Temiz, yorumlanmış kod + açıklama' },
    template: 'code'
  },
  writing: {
    keywords: ['write', 'article', 'blog', 'content', 'text', 'story', 'script', 'poem', 'slogan', 'title', 'summary', 'translate', 'edit', 'email', 'letter', 'report', 'presentation', 'cv', 'biography', 'advertising', 'marketing', 'social media', 'tweet', 'post', 'caption'],
    role: { en: 'You are a creative and experienced content writer.', tr: 'Sen yaratıcı ve deneyimli bir içerik yazarısın.' },
    format: { en: 'Organized paragraphs, headings, and subheadings', tr: 'Düzenli paragraflar, başlıklar ve alt başlıklar' },
    template: 'writing'
  },
  analysis: {
    keywords: ['analysis', 'compare', 'evaluate', 'examine', 'research', 'statistics', 'data', 'trend', 'predict', 'forecast', 'swot', 'market', 'competitor', 'price', 'cost', 'risk', 'opportunity', 'pros', 'cons'],
    role: { en: 'You are an expert analyst capable of detailed analysis.', tr: 'Sen detaylı analizler yapabilen uzman bir analistsin.' },
    format: { en: 'Headings, tables, bullet points, and conclusion section', tr: 'Başlıklar, tablolar, madde işaretleri ve sonuç bölümü' },
    template: 'analysis'
  },
  education: {
    keywords: ['explain', 'teach', 'what is', 'how', 'why', 'when', 'who', 'example', 'show', 'step', 'guide', 'tutorial', 'lesson', 'course', 'training', 'learn', 'beginner', 'basic', 'advanced', 'tip', 'trick'],
    role: { en: 'You are a patient and explanatory educator.', tr: 'Sen sabırlı ve açıklayıcı bir eğitmensin.' },
    format: { en: 'Step-by-step explanations, examples, and summary', tr: 'Adım adım açıklamalar, örnekler ve özet' },
    template: 'education'
  },
  image: {
    keywords: ['draw', 'generate', 'image', 'photo', 'picture', 'painting', 'sketch', 'illustration', 'render', 'resmet', 'çiz', 'görüntü', 'resim', 'fotoğraf', 'tasarla', 'oluştur'],
    role: { en: 'You are an expert AI Image Prompt Engineer.', tr: 'Sen uzman bir Yapay Zeka Görsel Prompt Mühendisisin.' },
    format: { en: 'Detailed descriptive prompt including style, composition, and lighting', tr: 'Stil, kompozisyon ve ışıklandırma içeren detaylı açıklayıcı prompt' },
    template: 'image'
  },
  general: {
    keywords: [],
    role: { en: 'You are a helpful and knowledgeable assistant.', tr: 'Sen yardımcı ve bilgili bir asistansın.' },
    format: { en: 'Organized and clear text', tr: 'Düzenli ve açık metin' },
    template: 'general'
  }
};

function detectPromptType(text) {
  const lowerText = text.toLowerCase();
  let bestMatch = { type: 'general', score: 0 };

  for (const [type, config] of Object.entries(PROMPT_TYPES)) {
    if (type === 'general') continue;
    let score = 0;
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) score++;
    }
    if (score > bestMatch.score) bestMatch = { type, score };
  }
  return bestMatch.type;
}

function checkMissingComponents(text) {
  const missing = [];
  const lowerText = text.toLowerCase();
  const rolKeywords = ['you ', 'as a', 'act as', 'role of', 'expert', 'professional'];
  if (!rolKeywords.some(k => lowerText.includes(k))) missing.push('Role');

  const formatKeywords = ['format', 'list', 'table', 'bullet', 'paragraph', 'code', 'json', 'markdown'];
  if (!formatKeywords.some(k => lowerText.includes(k))) missing.push('Format');

  if (text.length < 50) missing.push('Detail');

  const limitKeywords = ['only', 'maximum', 'minimum', 'at most', 'at least', 'short', 'long', 'limit'];
  if (!limitKeywords.some(k => lowerText.includes(k))) missing.push('Constraint');

  return missing;
}

function enhancePromptLocally(text) {
  const lang = detectLanguage(text);
  const promptType = detectPromptType(text);
  const config = PROMPT_TYPES[promptType];
  const missing = checkMissingComponents(text);

  const labels = {
    en: { role: '**ROLE**', context: '**CONTEXT**', task: '**TASK**', reqs: '**REQUIREMENTS**', format: '**FORMAT**', constraints: '**CONSTRAINTS**', contextMsg: 'User is asking for help on the following topic.', limitMsg: 'Do not over-extend, focus on the topic.', imgStyle: '**STYLE**', imgComp: '**COMPOSITION**', imgLight: '**LIGHTING**', imgCamera: '**CAMERA/LENS**', imgNegative: '**NEGATIVE PROMPT**' },
    tr: { role: '**ROL**', context: '**BAĞLAM**', task: '**GÖREV**', reqs: '**GEREKSİNİMLER**', format: '**FORMAT**', constraints: '**KISITLAMALAR**', contextMsg: 'Kullanıcı aşağıdaki konu hakkında yardım istiyor.', limitMsg: 'Gereksiz uzatmayın, konuya odaklanın.', imgStyle: '**STİL**', imgComp: '**KOMPOZİSYON**', imgLight: '**IŞIKLANDIRMA**', imgCamera: '**KAMERA/LENS**', imgNegative: '**NEGATİF PROMPT**' }
  }[lang];

  const requirements = {
    en: {
      code: ['- Write clean, readable, and well-structured code', '- Explain each part of the code with comments', '- Consider error handling and edge cases', '- Show example usage'],
      writing: ['- Use fluent and engaging language', '- Choose a tone appropriate for the target audience', '- Organize with headings and subheadings', '- Add a concluding paragraph'],
      analysis: ['- Be objective and data-driven', '- List pros and cons', '- Use a comparative table', '- Present results and recommendations'],
      education: ['- Use simple and clear language', '- Explain step-by-step', '- Provide concrete examples', '- Add summary and practical tips'],
      image: ['- Describe the subject in vivid detail', '- Specify artistic style and medium', '- Define camera angle and depth of field', '- Add atmospheric effects and lighting details'],
      general: ['- Be clear and concise', '- Add necessary details', '- Use an organized structure']
    },
    tr: {
      code: ['- Temiz, okunabilir ve iyi yapılandırılmış kod yazın', '- Kodun her bölümünü yorumlarla açıklayın', '- Hata ayıklama ve uç durumları göz önünde bulundurun', '- Örnek kullanım gösterin'],
      writing: ['- Akıcı ve ilgi çekici bir dil kullanın', '- Hedef kitleye uygun bir ton seçin', '- Başlıklar ve alt başlıklarla düzenleyin', '- Sonuç paragrafı ekleyin'],
      analysis: ['- Objektif ve veriye dayalı olun', '- Avantaj ve dezavantajları listeleyin', '- Karşılaştırmalı tablo kullanın', '- Sonuç ve öneriler sunun'],
      education: ['- Basit ve açık bir dil kullanın', '- Adım adım açıklayın', '- Somut örnekler verin', '- Özet ve pratik ipuçları ekleyin'],
      image: ['- Konuyu canlı detaylarla açıklayın', '- Sanatsal stili ve ortamı belirtin', '- Kamera açısını ve alan derinliğini tanımlayın', '- Atmosferik efektler ve ışıklandırma detayları ekleyin'],
      general: ['- Açık ve öz olun', '- Gerekli detayları ekleyin', '- Düzenli bir yapı kullanın']
    }
  }[lang];

  let enhanced = '';
  enhanced += `${labels.role}: ${config.role[lang]}\n\n`;

  if (promptType === 'image') {
    enhanced += `${labels.context}: ${text}\n\n`;
    enhanced += `${labels.imgStyle}: [Style: e.g. Cinematic, Cyberpunk, Oil Painting, Hyper-realistic]\n`;
    enhanced += `${labels.imgComp}: [Composition: e.g. Wide shot, Close-up, Golden Ratio]\n`;
    enhanced += `${labels.imgLight}: [Lighting: e.g. Golden Hour, Moody, Neon, Volumetric]\n`;
    enhanced += `${labels.imgCamera}: [Camera: e.g. 85mm lens, f/1.8, ISO 100]\n`;
    enhanced += `${labels.imgNegative}: [Avoid: e.g. blurry, low quality, distorted hands]\n\n`;
  } else {
    enhanced += `${labels.context}: ${labels.contextMsg}\n\n`;
    enhanced += `${labels.task}: ${text}\n\n`;
  }

  enhanced += `${labels.reqs}:\n`;
  const reqList = requirements[promptType] || requirements.general;
  reqList.forEach(r => enhanced += `${r}\n`);

  enhanced += `\n${labels.format}: ${config.format[lang]}\n\n`;
  enhanced += `${labels.constraints}: ${labels.limitMsg}`;

  return { enhanced, promptType, missing, typeName: lang === 'tr' ? (promptType === 'code' ? '💻 Kod' : promptType === 'writing' ? '✍️ Yazı' : promptType === 'analysis' ? '📊 Analiz' : promptType === 'education' ? '📚 Eğitim' : '📝 Genel') : (promptType === 'code' ? '💻 Code' : promptType === 'writing' ? '✍️ Writing' : promptType === 'analysis' ? '📊 Analysis' : promptType === 'education' ? '📚 Education' : '📝 General') };
}


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
