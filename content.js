// Content Script - Page interaction and Floating Button

// API Config - Enhanced System Prompt with JSON Framework
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


// Supported sites
const SUPPORTED_SITES = [
    'chat.openai.com',
    'chatgpt.com',
    'gemini.google.com',
    'claude.ai',
    'aistudio.google.com',
    'poe.com',
    'perplexity.ai'
];

// Site-specific selectors  
const SITE_SELECTORS = {
    'chat.openai.com': ['#prompt-textarea', 'textarea[data-id="root"]', 'div[contenteditable="true"]'],
    'chatgpt.com': ['#prompt-textarea', 'textarea[data-id="root"]', 'div[contenteditable="true"]'],
    'gemini.google.com': ['div.ql-editor[contenteditable="true"]', 'div[contenteditable="true"]', 'textarea'],
    'claude.ai': ['div.ProseMirror[contenteditable="true"]', 'div[contenteditable="true"]'],
    'aistudio.google.com': ['textarea', 'div[contenteditable="true"]'],
    'poe.com': ['textarea', 'div[contenteditable="true"]'],
    'perplexity.ai': ['textarea', 'div[contenteditable="true"]']
};

let floatingButton = null;
let currentTextArea = null;
let isOptimizing = false;

// Check site support
function isSupportedSite() {
    return SUPPORTED_SITES.some(site => window.location.hostname.includes(site.replace('www.', '')));
}

// Find text area
function findTextArea() {
    const hostname = window.location.hostname;

    for (const [site, selectors] of Object.entries(SITE_SELECTORS)) {
        if (hostname.includes(site.replace('www.', ''))) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && isVisible(element)) {
                    return element;
                }
            }
        }
    }

    // General fallback
    const generalSelectors = ['textarea:not([readonly])', 'div[contenteditable="true"]'];
    for (const selector of generalSelectors) {
        const element = document.querySelector(selector);
        if (element && isVisible(element)) {
            return element;
        }
    }

    return null;
}

// Is element visible?
function isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetWidth > 0;
}

// ========== SENSITIVE DATA DETECTION (ENHANCED) ==========

// National ID (TR) validation algorithm
function isValidTCKimlik(tc) {
    if (!/^[1-9]\d{10}$/.test(tc)) return false;

    const digits = tc.split('').map(Number);

    // 10th digit check
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const check10 = (oddSum * 7 - evenSum) % 10;
    if (check10 < 0 || digits[9] !== (check10 + 10) % 10 && digits[9] !== check10) {
        // Negative mod fix
        if (digits[9] !== ((oddSum * 7 - evenSum) % 10 + 10) % 10) return false;
    }

    // 11th digit check
    const sum10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    if (digits[10] !== sum10 % 10) return false;

    return true;
}

// Credit card Luhn algorithm
function isValidCreditCard(number) {
    const cleaned = number.replace(/[\s.-]/g, '');
    if (!/^\d{16}$/.test(cleaned)) return false;

    // Luhn algorithm logic
    let sum = 0;
    for (let i = 0; i < 16; i++) {
        let digit = parseInt(cleaned[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

// Check for context keywords around a match
function hasContext(text, index, keywords, windowSize = 60) {
    if (!keywords || keywords.length === 0) return true;

    const start = Math.max(0, index - windowSize);
    const end = Math.min(text.length, index + windowSize + 10);
    const surrounding = text.substring(start, end).toLocaleLowerCase('tr-TR');

    return keywords.some(kw => surrounding.includes(kw.toLocaleLowerCase('tr-TR')));
}

// Valid IP address check
function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    for (const part of parts) {
        const num = parseInt(part);
        if (num < 0 || num > 255) return false;
    }

    // Exclude private IP ranges (localhost, private)
    const first = parseInt(parts[0]);
    if (first === 127 || first === 10 || first === 0) return false;
    if (first === 192 && parseInt(parts[1]) === 168) return false;
    if (first === 172 && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) return false;

    return true;
}

const SENSITIVE_PATTERNS = [
    {
        name: 'Email',
        pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi,
        validate: (match) => {
            const examples = ['example', 'test', 'sample', 'user', 'email', 'ornek', 'mail'];
            const local = match.split('@')[0].toLowerCase();
            return !examples.some(ex => local.includes(ex));
        },
        mask: (match) => match.split('@')[0].slice(0, 2) + '***@' + match.split('@')[1]
    },
    {
        name: 'API Key',
        pattern: /(?:\b(?:sk-|ant-api-|AC[a-f0-9]{32}|sk_live_|ghp_|gho_|ghu_|ghs_|ghr_|xox[baprs]-|AIza)[0-9A-Za-z\-_]{20,}\b)|(?:\b(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?token|bearer|auth[_-]?token|private[_-]?key|credential|token)[\s:=]+["']?([a-zA-Z0-9.\-_/+=]{16,})["']?)/gi,
        validate: (match) => {
            const forbidden = ['example', 'test', 'your', 'dummy', 'null', 'undefined', 'password', 'şifre'];
            return !forbidden.some(f => match.toLowerCase().includes(f));
        },
        mask: () => '[API_KEY_HIDDEN]'
    },
    {
        name: 'Password',
        // Flexible pattern: keyword + optional words + (delimiter or 'is') + value
        pattern: /(?:password|şifre|parola|pwd|pass|sifre|secret)(?:\s+[\w\s]{1,40})?(?:[:=]|\s+is\s+)["']?([^\s"']{4,64})["']?/gi,
        validate: (match) => {
            const forbidden = ['example', 'test', 'your', 'dummy', 'null', 'undefined', 'password', 'şifre'];
            // Extract the actual value (last part)
            const parts = match.trim().split(/[\s:=]+/);
            const value = parts[parts.length - 1].replace(/["'\s]/g, '');
            const placeholders = ['****', 'xxxx', '1234', 'password', 'şifre', 'test', 'sample', 'admin', 'qwerty', 'root'];
            return value.length >= 4 && !placeholders.includes(value.toLowerCase()) && !forbidden.some(f => value.toLowerCase().includes(f));
        },
        mask: () => '[PASSWORD_HIDDEN]'
    },
    {
        name: 'DB Connection',
        pattern: /(?:mongodb|mysql|postgres|postgresql|mssql|oracle|redis|jdbc|[a-z0-9]+db)[+a-z]*:\/\/(?:[^\s"':]+:[^\s"':]+@)?[^\s"']+/gi,
        validate: (match) => match.includes('://'),
        mask: () => '[DB_CONNECTION_HIDDEN]'
    },
    {
        name: 'National ID (TR)',
        pattern: /\b[1-9]\d{10}\b/g,
        contextKeywords: ['tc', 'kimlik', 'tckn', 'id', 'identity'],
        validate: (match, index, fullText, item) => isValidTCKimlik(match) && hasContext(fullText, index, item.contextKeywords),
        mask: (match) => match.slice(0, 3) + '*****' + match.slice(-3)
    },
    {
        name: 'Credit Card',
        pattern: /\b(?:\d{4}[\s.-]?){3}\d{4}\b/g,
        contextKeywords: ['card', 'credit', 'debit', 'mastercard', 'visa', 'kart', 'kredi', 'payment', 'exp'],
        validate: (match, index, fullText, item) => isValidCreditCard(match) && hasContext(fullText, index, item.contextKeywords),
        mask: (match) => {
            const cleaned = match.replace(/[\s.-]/g, '');
            return cleaned.slice(0, 4) + ' **** **** ' + cleaned.slice(-4);
        }
    },
    {
        name: 'IBAN (TR)',
        pattern: /\bTR\s?\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{2}\b/gi,
        validate: () => true,
        mask: (match) => 'TR** **** **** **** **** ' + match.replace(/[\s]/g, '').slice(-2)
    },
    {
        name: 'Customer/Employee ID',
        pattern: /\b(?:müşteri|musteri|sicil|personel|çalışan|employee|staff|user|customer|id|no)\s*(?:no|numarası?|id)?\s*[:\s]?\s*([A-Z]{1,4}[- ]?\d{4,12})\b|\b([A-Z]{2,4}[-]\d{4,10})\b/gi,
        validate: (match) => {
            const forbidden = ['http', 'utf', 'ver', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            return !forbidden.some(f => match.toLowerCase().includes(f));
        },
        mask: () => '[ID_HIDDEN]'
    },
    {
        name: 'Phone Number',
        pattern: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{2,4}(?:[\s.-]?\d{2,4})?/g,
        contextKeywords: ['tel', 'phone', 'gsm', 'numara', 'contact', 'call', 'mobile', 'cep', 'cell', 'ulaş', 'ara'],
        validate: (match, index, fullText, item) => {
            const digits = match.replace(/[^\d]/g, '');
            if (digits.length < 7 || digits.length > 15) return false;
            if (/^(19|20)\d{2}$/.test(digits)) return false;
            return hasContext(fullText, index, item.contextKeywords);
        },
        mask: () => '[PHONE_HIDDEN]'
    },
    {
        name: 'Address',
        pattern: /(?:adres|address)\s*[:\s]?\s*[^,\n]{10,100}?\s*(?:mah|mahallesi|cad|cadde|sok|sokak|apt|apartman|kat|daire|blok|sitesi|köyü|ilçesi|county|street|st|road|rd|avenue|ave|building|floor)\b[^,\n]{0,50}/gi,
        validate: (match) => {
            const forbidden = ['http', 'www', '@', '.com'];
            return !forbidden.some(f => match.includes(f));
        },
        mask: () => '[ADDRESS_HIDDEN]'
    },
    {
        name: 'Private Key',
        pattern: /-----BEGIN\s+(?:[A-Z0-9]+\s+)?PRIVATE\s+KEY-----[\s\S]{50,}-----END\s+(?:[A-Z0-9]+\s+)?PRIVATE\s+KEY-----/gi,
        validate: () => true,
        mask: () => '[PRIVATE_KEY_HIDDEN]'
    }
];


// Detect sensitive data (Enhanced - with Validation and Context)
function detectSensitiveData(text) {
    const detected = [];

    for (const item of SENSITIVE_PATTERNS) {
        // Use exec to get indices for context checking
        let match;
        const pattern = new RegExp(item.pattern.source, item.pattern.flags);
        const validMatches = [];

        while ((match = pattern.exec(text)) !== null) {
            const matchValue = match[0];
            const index = match.index;

            // Check validation (now passing context info)
            if (item.validate ? item.validate(matchValue, index, text, item) : true) {
                if (!validMatches.includes(matchValue)) {
                    validMatches.push(matchValue);
                }
            }
        }

        if (validMatches.length > 0) {
            detected.push({
                type: item.name,
                count: validMatches.length,
                matches: validMatches
            });
        }
    }

    return detected;
}

// Mask sensitive data (Robust multi-occurrence handler)
function maskSensitiveData(text) {
    const findings = [];

    // 1. Collect all valid matches across all patterns
    for (const item of SENSITIVE_PATTERNS) {
        let match;
        const pattern = new RegExp(item.pattern.source, item.pattern.flags);

        while ((match = pattern.exec(text)) !== null) {
            const matchValue = match[0];
            const start = match.index;
            const end = start + matchValue.length;

            if (item.validate ? item.validate(matchValue, start, text, item) : true) {
                findings.push({
                    start,
                    end,
                    replacement: item.mask(matchValue)
                });
            }
        }
    }

    // 2. Sort findings by start index in descending order to avoid offset shifts
    findings.sort((a, b) => b.start - a.start);

    // 3. Apply replacements from back to front
    let result = text;
    let lastStart = Infinity;

    for (const f of findings) {
        // Prevent overlapping replacements
        if (f.end <= lastStart) {
            result = result.slice(0, f.start) + f.replacement + result.slice(f.end);
            lastStart = f.start;
        }
    }

    return result;
}

// ========== LOCAL PROMPT ENHANCEMENT (API-LESS) ==========

// Prompt types and keywords
const PROMPT_TYPES = {
    code: {
        keywords: ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'sql', 'html', 'css', 'react', 'vue', 'angular', 'node', 'django', 'flask', 'code', 'script', 'program', 'function', 'class', 'api', 'database', 'backend', 'frontend', 'algorithm', 'debug', 'error', 'app', 'web', 'mobile', 'bot', 'automation'],
        role: {
            en: 'You are an experienced software developer.',
            tr: 'Sen deneyimli bir yazılım geliştiricisisin.'
        },
        format: {
            en: 'Clean, commented code + explanation',
            tr: 'Temiz, yorumlanmış kod + açıklama'
        },
        template: 'code'
    },
    writing: {
        keywords: ['write', 'article', 'blog', 'content', 'text', 'story', 'script', 'poem', 'slogan', 'title', 'summary', 'translate', 'edit', 'email', 'letter', 'report', 'presentation', 'cv', 'biography', 'advertising', 'marketing', 'social media', 'tweet', 'post', 'caption'],
        role: {
            en: 'You are a creative and experienced content writer.',
            tr: 'Sen yaratıcı ve deneyimli bir içerik yazarısın.'
        },
        format: {
            en: 'Organized paragraphs, headings, and subheadings',
            tr: 'Düzenli paragraflar, başlıklar ve alt başlıklar'
        },
        template: 'writing'
    },
    analysis: {
        keywords: ['analysis', 'compare', 'evaluate', 'examine', 'research', 'statistics', 'data', 'trend', 'predict', 'forecast', 'swot', 'market', 'competitor', 'price', 'cost', 'risk', 'opportunity', 'pros', 'cons'],
        role: {
            en: 'You are an expert analyst capable of detailed analysis.',
            tr: 'Sen detaylı analizler yapabilen uzman bir analistsin.'
        },
        format: {
            en: 'Headings, tables, bullet points, and conclusion section',
            tr: 'Başlıklar, tablolar, madde işaretleri ve sonuç bölümü'
        },
        template: 'analysis'
    },
    education: {
        keywords: ['explain', 'teach', 'what is', 'how', 'why', 'when', 'who', 'example', 'show', 'step', 'guide', 'tutorial', 'lesson', 'course', 'training', 'learn', 'beginner', 'basic', 'advanced', 'tip', 'trick'],
        role: {
            en: 'You are a patient and explanatory educator.',
            tr: 'Sen sabırlı ve açıklayıcı bir eğitmensin.'
        },
        format: {
            en: 'Step-by-step explanations, examples, and summary',
            tr: 'Adım adım açıklamalar, örnekler ve özet'
        },
        template: 'education'
    },
    image: {
        keywords: ['draw', 'generate', 'image', 'photo', 'picture', 'painting', 'sketch', 'illustration', 'render', 'resmet', 'çiz', 'görüntü', 'resim', 'fotoğraf', 'tasarla', 'oluştur'],
        role: {
            en: 'You are an expert AI Image Prompt Engineer.',
            tr: 'Sen uzman bir Yapay Zeka Görsel Prompt Mühendisisin.'
        },
        format: {
            en: 'Detailed descriptive prompt including style, composition, and lighting',
            tr: 'Stil, kompozisyon ve ışıklandırma içeren detaylı açıklayıcı prompt'
        },
        template: 'image'
    },
    general: {
        keywords: [],
        role: {
            en: 'You are a helpful and knowledgeable assistant.',
            tr: 'Sen yardımcı ve bilgili bir asistansın.'
        },
        format: {
            en: 'Organized and clear text',
            tr: 'Düzenli ve açık metin'
        },
        template: 'general'
    }
};

// Language detection (Simple but effective for TR/EN)
function detectLanguage(text) {
    const trLetters = /[çğıöşüÇĞİÖŞÜ]/;
    const commonTrWords = [' ve ', ' bir ', ' ile ', ' bu ', ' için ', ' de ', ' da ', ' ama ', ' mi ', ' mı ', ' her '];

    if (trLetters.test(text)) return 'tr';

    const lowerText = text.toLowerCase();
    if (commonTrWords.some(word => lowerText.includes(word))) return 'tr';

    return 'en';
}

// Detect prompt type
function detectPromptType(text) {
    const lowerText = text.toLowerCase();
    let bestMatch = { type: 'general', score: 0 };

    for (const [type, config] of Object.entries(PROMPT_TYPES)) {
        if (type === 'general') continue;

        let score = 0;
        for (const keyword of config.keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                score++;
            }
        }

        if (score > bestMatch.score) {
            bestMatch = { type, score };
        }
    }

    return bestMatch.type;
}

// Check missing components
function checkMissingComponents(text) {
    const missing = [];
    const lowerText = text.toLowerCase();

    // Role check
    const rolKeywords = ['you ', 'as a', 'act as', 'role of', 'expert', 'professional'];
    if (!rolKeywords.some(k => lowerText.includes(k))) {
        missing.push('Role');
    }

    // Format check
    const formatKeywords = ['format', 'list', 'table', 'bullet', 'paragraph', 'code', 'json', 'markdown'];
    if (!formatKeywords.some(k => lowerText.includes(k))) {
        missing.push('Format');
    }

    // Detail/Requirement check
    if (text.length < 50) {
        missing.push('Detail');
    }

    // Constraint check
    const limitKeywords = ['only', 'maximum', 'minimum', 'at most', 'at least', 'short', 'long', 'limit'];
    if (!limitKeywords.some(k => lowerText.includes(k))) {
        missing.push('Constraint');
    }

    return missing;
}

// Local prompt enhancement (API-less)
function enhancePromptLocally(text) {
    const lang = detectLanguage(text);
    const promptType = detectPromptType(text);
    const config = PROMPT_TYPES[promptType];
    const missing = checkMissingComponents(text);

    const labels = {
        en: {
            role: '**ROLE**', context: '**CONTEXT**', task: '**TASK**', reqs: '**REQUIREMENTS**', format: '**FORMAT**', constraints: '**CONSTRAINTS**',
            contextMsg: 'User is asking for help on the following topic.', limitMsg: 'Do not over-extend, focus on the topic.',
            imgStyle: '**STYLE**', imgComp: '**COMPOSITION**', imgLight: '**LIGHTING**', imgCamera: '**CAMERA/LENS**', imgNegative: '**NEGATIVE PROMPT**'
        },
        tr: {
            role: '**ROL**', context: '**BAĞLAM**', task: '**GÖREV**', reqs: '**GEREKSİNİMLER**', format: '**FORMAT**', constraints: '**KISITLAMALAR**',
            contextMsg: 'Kullanıcı aşağıdaki konu hakkında yardım istiyor.', limitMsg: 'Gereksiz uzatmayın, konuya odaklanın.',
            imgStyle: '**STİL**', imgComp: '**KOMPOZİSYON**', imgLight: '**IŞIKLANDIRMA**', imgCamera: '**KAMERA/LENS**', imgNegative: '**NEGATİF PROMPT**'
        }
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

    // Create template
    let enhanced = '';

    // ROLE
    enhanced += `${labels.role}: ${config.role[lang]}\n\n`;

    // Specialized Logic for Image Prompt
    if (promptType === 'image') {
        enhanced += `${labels.context}: ${text}\n\n`;
        enhanced += `${labels.imgStyle}: [Style: e.g. Cinematic, Cyberpunk, Oil Painting, Hyper-realistic]\n`;
        enhanced += `${labels.imgComp}: [Composition: e.g. Wide shot, Close-up, Golden Ratio]\n`;
        enhanced += `${labels.imgLight}: [Lighting: e.g. Golden Hour, Moody, Neon, Volumetric]\n`;
        enhanced += `${labels.imgCamera}: [Camera: e.g. 85mm lens, f/1.8, ISO 100]\n`;
        enhanced += `${labels.imgNegative}: [Avoid: e.g. blurry, low quality, distorted hands]\n\n`;
    } else {
        // CONTEXT
        enhanced += `${labels.context}: ${labels.contextMsg}\n\n`;

        // TASK
        enhanced += `${labels.task}: ${text}\n\n`;
    }

    // REQUIREMENTS
    enhanced += `${labels.reqs}:\n`;
    const reqList = requirements[promptType] || requirements.general;
    reqList.forEach(r => enhanced += `${r}\n`);

    // FORMAT
    enhanced += `\n${labels.format}: ${config.format[lang]}\n\n`;

    // CONSTRAINTS
    enhanced += `${labels.constraints}: ${labels.limitMsg}`;

    return {
        enhanced,
        promptType,
        missing,
        typeName: lang === 'tr' ?
            (promptType === 'code' ? '💻 Kod' : promptType === 'writing' ? '✍️ Yazı' : promptType === 'analysis' ? '📊 Analiz' : promptType === 'education' ? '📚 Eğitim' : '📝 Genel') :
            (promptType === 'code' ? '💻 Code' : promptType === 'writing' ? '✍️ Writing' : promptType === 'analysis' ? '📊 Analysis' : promptType === 'education' ? '📚 Education' : '📝 General')
    };
}

// ========== TEXT OPERATIONS ==========

// Get text
function getText(element) {
    if (!element) return '';
    if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
        return element.value;
    }
    return element.innerText || element.textContent || '';
}

// Set text
function setText(element, text) {
    if (!element) return false;

    try {
        if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }

        if (element.contentEditable === 'true') {
            element.focus();
            // Use execCommand to preserve undo history and trigger site listeners better
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, text);
            // Fallback if execCommand doesn't work
            if (element.innerText !== text) {
                element.innerText = text;
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
    } catch (e) {
        console.error('setText error:', e);
    }
    return false;
}

// Create floating button
function createFloatingButton() {
    if (floatingButton) return floatingButton;

    floatingButton = document.createElement('div');
    floatingButton.id = 'prompt-optimizer-floating-btn';
    floatingButton.innerHTML = `
    <div class="po-btn-content">
      <span class="po-icon">⚡</span>
      <span class="po-text">Enhance Prompt</span>
    </div>
    <div class="po-loading" style="display: none;">
      <span class="po-spinner"></span>
      <span class="po-text">Optimizing...</span>
    </div>
  `;

    floatingButton.addEventListener('click', handleOptimizeClick);
    document.body.appendChild(floatingButton);

    return floatingButton;
}

// Update button position
function updateButtonPosition() {
    if (!floatingButton || !currentTextArea) return;

    const rect = currentTextArea.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    floatingButton.style.top = `${rect.top + scrollTop - 50}px`;
    floatingButton.style.left = `${rect.right + scrollLeft - 250}px`;

    // Ekran dışına çıkmasın
    if (floatingButton.getBoundingClientRect().top < 10) {
        floatingButton.style.top = `${rect.bottom + scrollTop + 5}px`;
    }
}

// Show/hide button
function showButton() {
    if (!floatingButton) createFloatingButton();
    floatingButton.classList.add('po-visible');
    updateButtonPosition();
}

function hideButton() {
    if (floatingButton) {
        floatingButton.classList.remove('po-visible');
    }
}

// Optimize click handler
async function handleOptimizeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isOptimizing || !currentTextArea) return;

    let text = getText(currentTextArea).trim();
    if (!text) {
        showToast('Please write a prompt first!', 'warning');
        return;
    }

    // 🔒 SENSITIVE DATA CHECK
    const sensitiveData = detectSensitiveData(text);
    if (sensitiveData.length > 0) {
        const types = sensitiveData.map(d => d.type).join(', ');
        showToast('⚠️ Sensitive data detected: ' + types + ' - Masking...', 'warning');
        text = maskSensitiveData(text);
        await new Promise(r => setTimeout(r, 1500));
    }

    // API key check
    let settings = null;
    let useLocalMode = false;

    try {
        if (chrome?.storage?.local) {
            settings = await chrome.storage.local.get(['apiKey', 'apiProvider', 'useLocalMode']);
        }
    } catch (e) {
        console.log('Storage error, using local mode');
    }

    // If no API key or local mode is selected -> LOCAL ENHANCEMENT
    if (!settings?.apiKey || settings?.useLocalMode) {
        useLocalMode = true;
    }

    isOptimizing = true;
    setLoadingState(true);

    try {
        let optimized;

        if (useLocalMode) {
            // 🏠 LOCAL ENHANCEMENT (API-less)
            const result = enhancePromptLocally(text);
            optimized = result.enhanced;

            // Missing component warning
            if (result.missing.length > 0) {
                showToast(`${result.typeName} template applied | Missing: ${result.missing.join(', ')}`, 'info');
            } else {
                showToast(`${result.typeName} template applied! ✨`, 'success');
            }
        } else {
            // 🌐 API ENHANCEMENT
            optimized = await callAPI(text, settings.apiKey, settings.apiProvider || 'gemini');
            showToast('Prompt optimized! ✨', 'success');
        }

        setText(currentTextArea, optimized);

    } catch (error) {
        // Fallback to local mode on API error
        console.error('API Error:', error);
        showToast('API error! Trying local mode...', 'warning');

        try {
            const result = enhancePromptLocally(text);
            setText(currentTextArea, result.enhanced);
            showToast(`${result.typeName} template applied (Local mode)`, 'success');
        } catch (localError) {
            showToast('Error: ' + error.message, 'error');
        }
    } finally {
        isOptimizing = false;
        setLoadingState(false);
    }
}

// Loading state
function setLoadingState(loading) {
    if (!floatingButton) return;

    const content = floatingButton.querySelector('.po-btn-content');
    const loadingEl = floatingButton.querySelector('.po-loading');

    if (loading) {
        content.style.display = 'none';
        loadingEl.style.display = 'flex';
    } else {
        content.style.display = 'flex';
        loadingEl.style.display = 'none';
    }
}

// Toast notification
function showToast(message, type) {
    const existing = document.getElementById('po-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'po-toast';
    toast.className = 'po-toast po-toast-' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('po-toast-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('po-toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// API Call
async function callAPI(prompt, apiKey, provider) {
    // Get Persona info if available
    const settings = await chrome.storage.local.get(['selectedPersonaId']);
    let systemRole = 'You are a world-class expert Prompt Engineer.';

    if (settings.selectedPersonaId) {
        // Personas are in popup.js, but since we are in content.js, 
        // we can't easily access the array unless we store it or hardcode it.
        // For simplicity, let's look up common ones or just let the API handle the engineer role.
        // Actually, let's pull the full system prompt from memory or use a message to get current persona.
        // OR: Better yet, storage.local can store the full ROLE text too.
        const personaData = await chrome.storage.local.get(['selectedPersonaRole']);
        if (personaData.selectedPersonaRole) {
            systemRole = personaData.selectedPersonaRole;
        }
    }

    const API_ENDPOINTS = {
        openai: 'https://api.openai.com/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
        claude: 'https://api.anthropic.com/v1/messages'
    };

    const endpoint = API_ENDPOINTS[provider];
    let headers = { 'Content-Type': 'application/json' };

    if (provider === 'openai') {
        headers['Authorization'] = 'Bearer ' + apiKey;
    } else if (provider === 'claude') {
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
    }

    const body = provider === 'openai' ? JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', systemRole) },
            { role: 'user', content: 'Optimize this prompt:\n\n' + prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
    }) : provider === 'gemini' ? JSON.stringify({
        contents: [{
            parts: [{ text: OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', systemRole) + '\n\nOptimize this prompt:\n\n' + prompt }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    }) : provider === 'claude' ? JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: OPTIMIZER_SYSTEM_PROMPT.replace('You are a world-class expert Prompt Engineer.', systemRole),
        messages: [{ role: 'user', content: 'Optimize this prompt:\n\n' + prompt }]
    }) : null;

    if (!body) throw new Error('Unknown provider');

    const url = provider === 'gemini' ? endpoint + '?key=' + apiKey : endpoint;

    const response = await fetch(url, { method: 'POST', headers: headers, body: body });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API error');
    }

    const data = await response.json();

    if (provider === 'openai') return data.choices[0].message.content;
    if (provider === 'gemini') return data.candidates[0].content.parts[0].text;
    if (provider === 'claude') return data.content[0].text;

    throw new Error('Unknown provider');
}

// ========== SECURITY UI ==========

let securityAlert = null;
let detectionDebounceTimeout = null;

function showSecurityAlert(detectedItems) {
    if (securityAlert) securityAlert.remove();

    securityAlert = document.createElement('div');
    securityAlert.id = 'po-security-alert';

    const types = detectedItems.map(d => d.type).join(', ');

    securityAlert.innerHTML = `
        <div class="po-alert-title">
            <span class="po-alert-icon">⚠️</span>
            <span>Sensitive Data Detected</span>
        </div>
        <div class="po-alert-msg">
            Detected: <strong>${types}</strong>. Should I censor this data for your privacy?
        </div>
        <div class="po-alert-actions">
            <button id="po-censor-yes" class="po-alert-btn po-btn-yes" title="Censor data">✓</button>
            <button id="po-censor-no" class="po-alert-btn po-btn-no" title="Ignore">✕</button>
        </div>
    `;

    document.body.appendChild(securityAlert);
    setTimeout(() => securityAlert.classList.add('po-alert-visible'), 10);

    document.getElementById('po-censor-yes').addEventListener('click', () => {
        const text = getText(currentTextArea);
        const masked = maskSensitiveData(text);
        setText(currentTextArea, masked);
        hideSecurityAlert();
        showToast('Sensitive data censored! (***)', 'success');
    });

    document.getElementById('po-censor-no').addEventListener('click', () => {
        hideSecurityAlert();
    });
}

function hideSecurityAlert() {
    if (securityAlert) {
        securityAlert.classList.remove('po-alert-visible');
        setTimeout(() => {
            if (securityAlert) securityAlert.remove();
            securityAlert = null;
        }, 300);
    }
}

// Input handler
function handleInput() {
    const text = getText(currentTextArea);

    // Floating Button Visibility
    if (text && text.length > 3) {
        showButton();
    } else {
        hideButton();
    }

    // Real-time Sensitive Data Detection (Debounced)
    clearTimeout(detectionDebounceTimeout);
    detectionDebounceTimeout = setTimeout(() => {
        if (!text || text.length < 5) {
            hideSecurityAlert();
            return;
        }

        const detected = detectSensitiveData(text);
        if (detected.length > 0) {
            showSecurityAlert(detected);
        } else {
            hideSecurityAlert();
        }
    }, 800);
}

// Focus handler
function handleFocus(e) {
    currentTextArea = e.target;
    handleInput();
}

// Blur handler
function handleBlur() {
    setTimeout(() => {
        if (!floatingButton?.matches(':hover')) {
            hideButton();
        }
    }, 200);
}

// Initialize
function init() {
    if (!isSupportedSite()) {
        console.log('Prompt Optimizer: Bu site desteklenmiyor');
        return;
    }

    console.log('⚡ Prompt Optimizer active!');

    function watchForTextArea() {
        const textArea = findTextArea();

        if (textArea && textArea !== currentTextArea) {
            if (currentTextArea) {
                currentTextArea.removeEventListener('input', handleInput);
                currentTextArea.removeEventListener('paste', handleInput);
                currentTextArea.removeEventListener('change', handleInput);
                currentTextArea.removeEventListener('focus', handleFocus);
                currentTextArea.removeEventListener('blur', handleBlur);
            }

            currentTextArea = textArea;
            currentTextArea.addEventListener('input', handleInput);
            currentTextArea.addEventListener('paste', () => setTimeout(handleInput, 0));
            currentTextArea.addEventListener('change', handleInput);
            currentTextArea.addEventListener('focus', handleFocus);
            currentTextArea.addEventListener('blur', handleBlur);

            handleInput();
        }
    }

    watchForTextArea();

    // DOM değişikliklerini izle
    const observer = new MutationObserver(() => {
        watchForTextArea();
        if (floatingButton && currentTextArea) {
            updateButtonPosition();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', updateButtonPosition, { passive: true });
    window.addEventListener('resize', updateButtonPosition, { passive: true });
}

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPrompt') {
        sendResponse({ text: getText(findTextArea()) || '' });
    }
    if (request.action === 'setPrompt') {
        sendResponse({ success: setText(findTextArea(), request.text) });
    }
    return true;
});

// Başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
