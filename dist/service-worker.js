/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/analysis/entity-extractor.ts
// Entity Extractor - Extracts named entities from text
// People, organizations, tickers, dates for improved matching
// Known organizations (case-insensitive)
const ORGANIZATIONS = new Set([
    // Government & Policy
    'federal reserve', 'fed', 'fomc', 'white house', 'pentagon', 'congress',
    'senate', 'house', 'treasury', 'sec', 'fda', 'fbi', 'cia', 'doj',
    'nato', 'un', 'united nations', 'world bank', 'imf',
    // Tech Companies
    'openai', 'anthropic', 'google', 'meta', 'facebook', 'apple', 'microsoft',
    'amazon', 'tesla', 'spacex', 'nvidia', 'amd', 'intel', 'ibm', 'oracle',
    'salesforce', 'adobe', 'netflix', 'spotify', 'uber', 'lyft', 'airbnb',
    // Finance
    'goldman sachs', 'jpmorgan', 'morgan stanley', 'blackrock', 'vanguard',
    'fidelity', 'charles schwab', 'citigroup', 'bank of america', 'wells fargo',
    // Crypto
    'coinbase', 'binance', 'ftx', 'kraken', 'gemini', 'tether', 'circle',
    // Sports
    'nfl', 'nba', 'mlb', 'nhl', 'fifa', 'uefa', 'pga', 'formula one', 'f1',
    // News/Media
    'new york times', 'nyt', 'wall street journal', 'wsj', 'bloomberg',
    'reuters', 'associated press', 'ap', 'cnn', 'fox news', 'msnbc',
]);
// Known people patterns (first + last name)
const KNOWN_PEOPLE = new Set([
    // Politics
    'donald trump', 'joe biden', 'kamala harris', 'ron desantis', 'mike pence',
    'barack obama', 'hillary clinton', 'bernie sanders', 'nancy pelosi',
    'mitch mcconnell', 'kevin mccarthy', 'chuck schumer',
    // Finance/Economics
    'jerome powell', 'janet yellen', 'gary gensler', 'warren buffett',
    'elon musk', 'jeff bezos', 'bill gates', 'mark zuckerberg', 'tim cook',
    // Tech
    'sam altman', 'satya nadella', 'sundar pichai', 'jensen huang',
    'lisa su', 'andy jassy', 'dario amodei', 'ilya sutskever',
    // Crypto
    'vitalik buterin', 'changpeng zhao', 'cz', 'sam bankman-fried', 'sbf',
    // Sports
    'lebron james', 'tom brady', 'lionel messi', 'cristiano ronaldo',
]);
/**
 * Extract ticker symbols from text
 * Matches: $BTC, $NVDA, $TSLA, BTC, NVDA (all caps)
 */
function extractTickers(text) {
    const tickers = [];
    // Match $TICKER format
    const dollarMatches = text.matchAll(/\$([A-Z]{2,5})\b/g);
    for (const match of dollarMatches) {
        tickers.push(match[1]);
    }
    // Match standalone all-caps words (3-5 chars) that look like tickers
    // But filter out common words like "USA", "CEO", "NEW"
    const commonWords = new Set(['USA', 'CEO', 'CTO', 'CFO', 'CMO', 'CIO', 'VP', 'NEW', 'OLD', 'YES', 'NO']);
    const standaloneMatches = text.matchAll(/\b([A-Z]{2,5})\b/g);
    for (const match of standaloneMatches) {
        const word = match[1];
        // Only include if not a common word and follows ticker patterns
        if (!commonWords.has(word) && /^[A-Z]{3,5}$/.test(word)) {
            tickers.push(word);
        }
    }
    return [...new Set(tickers)]; // Deduplicate
}
/**
 * Extract people names from text
 * Looks for: capitalized word pairs, known people
 */
function extractPeople(text) {
    const people = [];
    const lowerText = text.toLowerCase();
    // Check for known people (case-insensitive)
    for (const person of KNOWN_PEOPLE) {
        if (lowerText.includes(person)) {
            people.push(person);
        }
    }
    // Extract capitalized word pairs that look like names
    // Pattern: Capitalized word followed by capitalized word
    // Example: "Jerome Powell", "Sam Altman"
    const nameMatches = text.matchAll(/\b([A-Z][a-z]+(?:'[A-Z][a-z]+)?)\s+([A-Z][a-z]+(?:'[A-Z][a-z]+)?)\b/g);
    for (const match of nameMatches) {
        const fullName = `${match[1]} ${match[2]}`;
        const fullNameLower = fullName.toLowerCase();
        // Filter out common false positives
        const falsePositives = [
            'new york', 'los angeles', 'san francisco', 'north korea', 'south korea',
            'white house', 'supreme court', 'wall street', 'silicon valley',
            'middle east', 'united states', 'united kingdom', 'european union',
        ];
        if (!falsePositives.includes(fullNameLower)) {
            people.push(fullNameLower);
        }
    }
    return [...new Set(people)]; // Deduplicate
}
/**
 * Extract organizations from text
 */
function extractOrganizations(text) {
    const organizations = [];
    const lowerText = text.toLowerCase();
    // Check for known organizations (case-insensitive)
    for (const org of ORGANIZATIONS) {
        if (lowerText.includes(org)) {
            organizations.push(org);
        }
    }
    return [...new Set(organizations)]; // Deduplicate
}
/**
 * Extract dates and timeframes from text
 * Matches: "March 2026", "Q1 2025", "2024", "next week", "this month"
 */
function extractDates(text) {
    const dates = [];
    // Month + Year: "March 2026", "Mar 2026"
    const monthYearMatches = text.matchAll(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(202[4-9]|20[3-9]\d)\b/gi);
    for (const match of monthYearMatches) {
        dates.push(match[0].toLowerCase());
    }
    // Quarter + Year: "Q1 2025", "Q4 2024"
    const quarterMatches = text.matchAll(/\bQ([1-4])\s*(202[4-9]|20[3-9]\d)\b/gi);
    for (const match of quarterMatches) {
        dates.push(`q${match[1]} ${match[2]}`);
    }
    // Standalone years: 2024, 2025, etc.
    const yearMatches = text.matchAll(/\b(202[4-9]|20[3-9]\d)\b/g);
    for (const match of yearMatches) {
        dates.push(match[1]);
    }
    // Relative timeframes
    const relativeTimeframes = [
        'next week', 'next month', 'next year', 'next quarter',
        'this week', 'this month', 'this year', 'this quarter',
        'by end of year', 'end of month', 'eoy', 'eom',
    ];
    const lowerText = text.toLowerCase();
    for (const timeframe of relativeTimeframes) {
        if (lowerText.includes(timeframe)) {
            dates.push(timeframe);
        }
    }
    return [...new Set(dates)]; // Deduplicate
}
/**
 * Extract all entities from text
 */
function extractEntities(text) {
    const people = extractPeople(text);
    const tickers = extractTickers(text);
    const organizations = extractOrganizations(text);
    const dates = extractDates(text);
    // Combine all for convenience
    const all = [
        ...people,
        ...tickers,
        ...organizations,
        ...dates,
    ];
    return {
        people,
        tickers,
        organizations,
        dates,
        all,
    };
}
/**
 * Check if a keyword is an entity
 * Used for applying entity weight boost in scoring
 */
function isEntity(keyword, entities) {
    const lower = keyword.toLowerCase();
    // Check if it's in any entity list
    return entities.people.includes(lower) ||
        entities.tickers.includes(keyword.toUpperCase()) ||
        entities.organizations.includes(lower) ||
        entities.dates.includes(lower);
}

;// ./src/analysis/keyword-matcher.ts
// Keyword-based market matcher
// Uses word-boundary matching, synonym expansion, phrase extraction, and entity detection

// ─── Stop words ──────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
    'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all',
    'just', 'so', 'than', 'too', 'very', 'not', 'no', 'yes',
    // Generic everyday words that are too ambiguous to be matching signals.
    // e.g. "sharing them with the world" must not match FIFA World Cup markets.
    // e.g. "this man just keeps..." must not match "Man City" markets.
    'world', 'cup', 'game', 'games', 'live', 'work', 'way', 'show', 'back',
    'know', 'good', 'big', 'take', 'top', 'open', 'run', 'real', 'right',
    'mean', 'only', 'even', 'well', 'off', 'look', 'find', 'going', 'come',
    'make', 'made', 'day', 'days', 'part', 'true', 'keep', 'left', 'try',
    'give', 'once', 'ever', 'much', 'many', 'other', 'every', 'again',
    'move', 'play', 'long', 'high', 'side', 'line', 'lead', 'role', 'hold',
    'plan', 'place', 'start', 'see', 'say', 'said', 'goes',
    // Pronouns / generic nouns that form compound sport names but are noise alone
    'man', 'men', 'city', 'united', 'new', 'old', 'final', 'league',
]);
// Domain-specific noise words that appear in nearly every financial/political tweet
// and produce false positives when used as matching signals
const DOMAIN_NOISE_WORDS = new Set([
    'market', 'markets', 'price', 'prices', 'trading', 'trade',
    'buy', 'sell', 'stock', 'stocks', 'invest', 'investing',
    'predict', 'prediction', 'odds', 'bet', 'betting', 'chance', 'probability',
    'likely', 'unlikely', 'bullish', 'bearish',
    'soon', 'today', 'tomorrow', 'week', 'month', 'year',
    'thread', 'breaking', 'update', 'report', 'says', 'said',
    'now', 'latest',
    // Additional noise words that cause false positives
    'people', 'thing', 'things', 'time', 'times', 'news', 'new',
    'next', 'last', 'first', 'second', 'third', 'another', 'some',
    'here', 'there', 'think', 'thought', 'thoughts', 'post', 'tweet',
    'twitter', 'follow', 'share', 'read', 'watch', 'check', 'via',
    'amp', 'quote', 'retweet', 'reply', 'comment', 'comments',
    'video', 'photo', 'image', 'link', 'article', 'story',
    'must', 'need', 'want', 'lol', 'lmao', 'wtf', 'omg', 'tbh',
    // Generic numbers/quantifiers that match everywhere
    'one', 'two', 'three', 'four', 'five',
    // Ultra-generic verbs that appear in every context
    'got', 'get', 'came', 'come', 'went', 'join', 'joined',
]);
// ─── Synonym / alias map ─────────────────────────────────────────────────────
// Maps tweet tokens (what people write) → canonical market keywords
// Supports multi-word keys via bigram/trigram extraction
const SYNONYM_MAP = {
    // Fed / Monetary Policy
    'fed': ['federal reserve', 'fomc', 'interest rates'],
    'federal reserve': ['fed', 'fomc', 'interest rates'],
    'fomc': ['fed', 'federal reserve', 'interest rates'],
    'jerome powell': ['fed', 'federal reserve', 'fomc'],
    'powell': ['fed', 'federal reserve', 'fomc'],
    'janet yellen': ['treasury', 'fiscal policy'],
    'yellen': ['treasury', 'fiscal policy'],
    'rate hike': ['interest rates', 'fed', 'fomc'],
    'rate cut': ['interest rates', 'fed', 'fomc'],
    'interest rate': ['fed', 'fomc', 'monetary policy'],
    'basis points': ['interest rates', 'rate hike', 'rate cut'],
    'bps': ['basis points', 'interest rates'],
    'dot plot': ['fomc', 'fed', 'interest rates'],
    'quantitative easing': ['fed', 'monetary policy'],
    'qe': ['quantitative easing', 'fed'],
    // Economics
    'cpi': ['inflation', 'consumer price index'],
    'inflation': ['cpi', 'consumer price index', 'cost of living'],
    'pce': ['inflation', 'consumer spending'],
    'gdp': ['economic growth', 'recession'],
    'recession': ['gdp', 'economic downturn', 'contraction'],
    'unemployment': ['jobs', 'labor market', 'payrolls', 'jobless'],
    'nfp': ['nonfarm payrolls', 'jobs', 'unemployment'],
    'nonfarm payrolls': ['jobs', 'unemployment', 'labor market'],
    'payrolls': ['jobs', 'unemployment', 'labor market'],
    'layoffs': ['unemployment', 'jobs', 'labor market'],
    'sp500': ['s&p 500', 'stocks', 'equities'],
    's&p 500': ['sp500', 'stocks', 'equities'],
    's&p': ['sp500', 's&p 500', 'stocks'],
    'nasdaq': ['stocks', 'equities', 'tech stocks'],
    'dow': ['stocks', 'equities', 'dow jones'],
    'dow jones': ['dow', 'stocks', 'equities'],
    'yield curve': ['bonds', 'treasuries', 'interest rates'],
    'treasuries': ['bonds', 'yield curve', 'interest rates'],
    // Politics
    'potus': ['president', 'white house'],
    'white house': ['president', 'administration'],
    'gop': ['republican', 'republicans'],
    'rnc': ['republican', 'republicans'],
    'dnc': ['democrat', 'democrats'],
    'doge': ['spending cuts', 'government efficiency', 'dogecoin', 'crypto', 'meme coin'],
    'doj': ['justice department', 'attorney general'],
    'scotus': ['supreme court'],
    'supreme court': ['scotus'],
    'senate': ['congress', 'legislation'],
    'house': ['congress', 'legislation', 'house of representatives'],
    'congress': ['senate', 'legislation', 'house'],
    'executive order': ['president', 'administration', 'white house'],
    // Crypto
    'btc': ['bitcoin'],
    'bitcoin': ['btc', 'crypto'],
    'eth': ['ethereum'],
    'ethereum': ['eth', 'crypto'],
    'sol': ['solana'],
    'solana': ['sol', 'crypto'],
    'xrp': ['ripple'],
    'ripple': ['xrp'],
    'sec': ['securities', 'regulation', 'crypto regulation'],
    'gensler': ['sec', 'crypto regulation'],
    'etf': ['exchange traded fund', 'bitcoin etf', 'spot etf'],
    'spot etf': ['etf', 'bitcoin etf', 'sec'],
    'defi': ['decentralized finance', 'crypto'],
    'stablecoin': ['usdc', 'usdt', 'tether'],
    'usdc': ['stablecoin', 'crypto'],
    'usdt': ['stablecoin', 'tether', 'crypto'],
    'halving': ['bitcoin', 'btc', 'crypto'],
    'coinbase': ['crypto', 'bitcoin', 'exchange'],
    'binance': ['crypto', 'exchange'],
    // Ethereum ecosystem
    'l2': ['layer 2', 'ethereum', 'eth'],
    'layer2': ['layer 2', 'ethereum', 'eth'],
    'layer-2': ['layer 2', 'ethereum', 'eth'],
    'layer 2': ['ethereum', 'eth', 'scaling'],
    'web3': ['ethereum', 'eth', 'defi', 'crypto'],
    'dapp': ['ethereum', 'eth', 'defi'],
    'dapps': ['ethereum', 'eth', 'defi'],
    'gas fees': ['ethereum', 'eth'],
    'gas fee': ['ethereum', 'eth'],
    'gwei': ['ethereum', 'eth', 'gas fees'],
    'merge': ['ethereum', 'eth', 'proof of stake'],
    'proof of stake': ['ethereum', 'eth', 'staking'],
    'pos': ['proof of stake', 'ethereum', 'staking'],
    'staking': ['ethereum', 'eth', 'proof of stake'],
    'ens': ['ethereum', 'eth'],
    'nft': ['ethereum', 'eth', 'digital art'],
    'nfts': ['ethereum', 'eth', 'nft'],
    'polygon': ['ethereum', 'eth', 'layer 2'],
    'arbitrum': ['ethereum', 'eth', 'layer 2'],
    'optimism': ['ethereum', 'eth', 'layer 2'],
    'base': ['ethereum', 'eth', 'layer 2'],
    'vitalik': ['ethereum', 'eth', 'buterin'],
    'buterin': ['ethereum', 'eth', 'vitalik'],
    // Solana
    'phantom': ['solana', 'sol', 'crypto'],
    'pump fun': ['solana', 'sol', 'memecoin'],
    'memecoin': ['crypto', 'solana', 'doge'],
    'meme coin': ['crypto', 'solana', 'doge'],
    // Other crypto
    'dogecoin': ['doge', 'crypto'],
    'shib': ['shiba', 'crypto', 'memecoin'],
    'pepe': ['memecoin', 'crypto'],
    'altcoin': ['crypto', 'altcoins'],
    'altcoins': ['crypto', 'altcoin'],
    'bull run': ['crypto', 'bitcoin', 'btc'],
    'bear market': ['crypto', 'recession'],
    'crypto winter': ['crypto', 'bitcoin', 'bear market'],
    'on-chain': ['crypto', 'blockchain', 'defi'],
    'blockchain': ['crypto', 'ethereum', 'bitcoin'],
    'wallet': ['crypto', 'ethereum', 'bitcoin'],
    'metamask': ['ethereum', 'eth', 'defi', 'web3'],
    'kraken': ['crypto', 'exchange'],
    'ftx': ['crypto', 'exchange', 'sec'],
    'sbf': ['ftx', 'crypto', 'sec'],
    // Tech / AI
    'openai': ['ai', 'artificial intelligence', 'chatgpt', 'gpt', 'llm'],
    'chatgpt': ['openai', 'ai', 'llm'],
    'gpt': ['openai', 'chatgpt', 'ai', 'llm'],
    'gpt-4': ['openai', 'chatgpt', 'ai', 'llm'],
    'anthropic': ['ai', 'claude', 'llm', 'artificial intelligence'],
    'claude': ['anthropic', 'ai', 'llm'],
    'gemini': ['google', 'ai', 'llm'],
    'llm': ['ai', 'artificial intelligence'],
    'agi': ['artificial general intelligence', 'ai'],
    'sam altman': ['openai', 'ai', 'chatgpt'],
    'altman': ['openai', 'ai', 'chatgpt'],
    'jensen huang': ['nvidia', 'nvda', 'gpu', 'ai chips'],
    'huang': ['nvidia', 'nvda', 'gpu'],
    'nvda': ['nvidia'],
    'nvidia': ['nvda', 'gpu', 'ai chips', 'semiconductors'],
    'gpu': ['nvidia', 'nvda', 'chips'],
    'chips': ['semiconductors', 'nvidia', 'tsmc'],
    'semiconductors': ['chips', 'nvidia', 'tsmc', 'intel'],
    'tsmc': ['semiconductors', 'chips', 'taiwan'],
    'aapl': ['apple'],
    'apple': ['aapl', 'iphone', 'tim cook'],
    'tim cook': ['apple', 'aapl'],
    'msft': ['microsoft'],
    'microsoft': ['msft'],
    'googl': ['google', 'alphabet'],
    'google': ['googl', 'alphabet'],
    'alphabet': ['google', 'googl'],
    'meta': ['facebook', 'instagram'],
    'big tech': ['apple', 'google', 'microsoft', 'meta', 'amazon'],
    'faang': ['big tech', 'apple', 'google', 'meta', 'amazon'],
    'eu ai act': ['ai regulation', 'artificial intelligence', 'regulation'],
    // Geopolitics
    'nato': ['alliance', 'military', 'europe', 'ukraine'],
    'ukraine': ['russia', 'war', 'nato', 'zelensky'],
    'zelensky': ['ukraine', 'russia'],
    'putin': ['russia', 'ukraine', 'kremlin'],
    'kremlin': ['russia', 'putin'],
    'prc': ['china', 'beijing'],
    'beijing': ['china', 'xi jinping'],
    'xi jinping': ['china', 'beijing'],
    'xi': ['china', 'xi jinping', 'beijing'],
    'taiwan': ['china', 'semiconductors', 'tsmc'],
    'gaza': ['israel', 'hamas', 'middle east', 'conflict'],
    'israel': ['gaza', 'hamas', 'middle east'],
    'ceasefire': ['ukraine', 'russia', 'peace', 'conflict'],
    'peace deal': ['ukraine', 'russia', 'peace agreement', 'ceasefire'],
    // Sports
    'nfl': ['football', 'super bowl'],
    'nba': ['basketball'],
    'mlb': ['baseball'],
    'nhl': ['hockey'],
    'super bowl': ['nfl', 'football'],
    'march madness': ['ncaa', 'basketball'],
    'world cup': ['soccer', 'football', 'fifa'],
    'fifa': ['soccer', 'world cup'],
    'champions league': ['soccer', 'football', 'europe', 'uefa', 'ucl'],
    'ucl': ['champions league', 'soccer', 'europe', 'uefa'],
    'europa league': ['soccer', 'football', 'europe', 'uefa'],
    'premier league': ['soccer', 'football', 'england', 'epl'],
    'epl': ['premier league', 'soccer', 'england'],
    'la liga': ['soccer', 'football', 'spain'],
    'serie a': ['soccer', 'football', 'italy'],
    'bundesliga': ['soccer', 'football', 'germany'],
    'man city': ['manchester city', 'soccer', 'premier league', 'champions league'],
    'man united': ['manchester united', 'soccer', 'premier league'],
    'manchester city': ['man city', 'soccer', 'premier league', 'champions league'],
    'manchester united': ['man united', 'soccer', 'premier league'],
    'arsenal': ['soccer', 'premier league', 'england'],
    'liverpool': ['soccer', 'premier league', 'england'],
    'chelsea': ['soccer', 'premier league', 'england'],
    'tottenham': ['soccer', 'premier league', 'spurs'],
    'real madrid': ['soccer', 'la liga', 'champions league'],
    'barcelona': ['soccer', 'la liga', 'spain'],
    'psg': ['paris saint germain', 'soccer', 'france'],
    'inter milan': ['soccer', 'serie a', 'italy'],
    'fa cup': ['soccer', 'england', 'football'],
    'ufc': ['mma', 'fighting', 'sports'],
    'mahomes': ['chiefs', 'kansas city', 'nfl', 'super bowl'],
    'patrick mahomes': ['chiefs', 'kansas city', 'nfl', 'super bowl'],
    'celtics': ['boston', 'nba', 'basketball'],
    'lakers': ['los angeles', 'nba', 'basketball'],
    // Climate / Energy
    'crude': ['oil', 'wti', 'energy'],
    'wti': ['oil', 'crude', 'energy'],
    'brent': ['oil', 'crude', 'energy'],
    'opec': ['oil', 'energy', 'production cuts'],
    'ev': ['electric vehicle', 'tesla', 'clean energy'],
    'electric vehicle': ['ev', 'tesla'],
    'tesla': ['ev', 'electric vehicle', 'elon musk'],
    'elon musk': ['tesla', 'spacex', 'twitter', 'x', 'doge'],
    'musk': ['tesla', 'elon musk', 'spacex', 'doge'],
    'elon': ['elon musk', 'tesla', 'spacex', 'doge'],
    'net zero': ['climate', 'emissions', 'carbon'],
    'paris agreement': ['climate', 'emissions', 'net zero'],
    'carbon': ['climate', 'emissions', 'carbon tax'],
    'global warming': ['climate change', 'climate', 'temperature'],
    'climate change': ['global warming', 'climate', 'emissions'],
    // Trade / Tariffs (2025 dominant news topic)
    'tariff': ['trade war', 'trade deal', 'import tax', 'china trade', 'trade'],
    'tariffs': ['tariff', 'trade war', 'trade deal', 'import tax'],
    'trade war': ['tariff', 'tariffs', 'china', 'trade deal'],
    'trade deal': ['tariff', 'tariffs', 'trade war', 'trade'],
    'import tax': ['tariff', 'tariffs', 'trade'],
    'sanctions': ['trade', 'russia', 'china', 'iran'],
    // Immigration / Border
    'deportation': ['immigration', 'border', 'ice', 'migrants', 'undocumented'],
    'deport': ['deportation', 'immigration', 'ice', 'border'],
    'immigration': ['border', 'deportation', 'ice', 'migrants'],
    'border': ['immigration', 'deportation', 'wall'],
    'migrants': ['immigration', 'border', 'deportation'],
    'ice': ['deportation', 'immigration', 'border'],
    // AI Models & Companies (2025/2026)
    'deepseek': ['ai', 'llm', 'china ai', 'artificial intelligence'],
    'llama': ['meta', 'ai', 'llm', 'open source ai'],
    'mistral': ['ai', 'llm', 'artificial intelligence'],
    'grok': ['xai', 'elon musk', 'ai', 'llm'],
    'xai': ['grok', 'elon musk', 'ai'],
    'perplexity': ['ai', 'search', 'llm'],
    'cursor': ['ai', 'coding', 'developer tools'],
    'copilot': ['microsoft', 'msft', 'ai', 'github'],
    'o1': ['openai', 'chatgpt', 'ai', 'reasoning'],
    'o3': ['openai', 'chatgpt', 'ai', 'reasoning'],
    // Specific people (2025)
    'trump': ['president', 'potus', 'administration', 'gop', 'republican'],
    'donald trump': ['trump', 'potus', 'president', 'republican'],
    'biden': ['president', 'potus', 'democrat', 'administration'],
    'harris': ['democrat', 'kamala', 'vice president'],
    'marco rubio': ['senate', 'republican', 'secretary of state'],
    'rfk': ['health', 'vaccines', 'kennedy'],
    'vivek': ['doge', 'republican', 'government efficiency'],
    // Stocks / Companies (2025)
    'palantir': ['pltr', 'data analytics', 'defense'],
    'pltr': ['palantir'],
    'saylor': ['bitcoin', 'btc', 'microstrategy', 'mstr'],
    'microstrategy': ['bitcoin', 'btc', 'mstr', 'saylor'],
    'mstr': ['microstrategy', 'bitcoin', 'btc'],
    'blackrock': ['etf', 'bitcoin etf', 'institutional'],
    'robinhood': ['stocks', 'crypto', 'retail investing'],
    'ipo': ['stocks', 'listing', 'public offering'],
    // Geopolitics / Countries
    'japan': ['japanese', 'yen', 'nikkei', 'jpy'],
    'japanese': ['japan', 'yen'],
    'china': ['chinese', 'prc', 'beijing', 'xi'],
    'india': ['modi', 'rupee', 'bse'],
    'germany': ['german', 'euro', 'bund', 'europe'],
    'uk': ['britain', 'gbp', 'pound', 'boe'],
    'iran': ['nuclear', 'sanctions', 'middle east'],
    'north korea': ['kim jong un', 'nuclear', 'missiles'],
    // More crypto (2025)
    'sui': ['crypto', 'layer 1'],
    'apt': ['aptos', 'crypto', 'layer 1'],
    'aptos': ['apt', 'crypto', 'layer 1'],
    'ton': ['telegram', 'crypto'],
    'bnb': ['binance', 'crypto'],
    'avax': ['avalanche', 'crypto'],
    'avalanche': ['avax', 'crypto'],
    'trump coin': ['crypto', 'meme coin'],
    'meme': ['memecoin', 'crypto', 'doge'],
    'stablecoin bill': ['stablecoin', 'crypto regulation', 'congress'],
    'crypto bill': ['crypto regulation', 'sec', 'congress'],
    'strategic reserve': ['bitcoin', 'btc', 'crypto'],
    // ── Wall Street / Banks / Institutions ───────────────────────────────────
    'goldman sachs': ['bitcoin', 'crypto', 'bank', 'institutional', 'wall street'],
    'goldman': ['goldman sachs', 'bank', 'wall street'],
    'david solomon': ['goldman sachs', 'bitcoin', 'bank'],
    'solomon': ['goldman sachs', 'bank', 'bitcoin'],
    'jpmorgan': ['bank', 'jamie dimon', 'financial', 'wall street'],
    'jp morgan': ['jpmorgan', 'bank', 'jamie dimon'],
    'jamie dimon': ['jpmorgan', 'bank', 'bitcoin'],
    'dimon': ['jpmorgan', 'bank', 'jamie dimon'],
    'morgan stanley': ['bank', 'wall street', 'institutional'],
    'bank of america': ['bank', 'bofa', 'financial'],
    'bofa': ['bank of america', 'bank'],
    'wells fargo': ['bank', 'financial'],
    'citigroup': ['bank', 'citi', 'financial'],
    'citi': ['citigroup', 'bank'],
    'hsbc': ['bank', 'financial'],
    'wall street': ['banks', 'financial', 'stocks', 'institutional'],
    'larry fink': ['blackrock', 'etf', 'bitcoin etf', 'institutional'],
    'fink': ['blackrock', 'etf', 'bitcoin etf'],
    'ray dalio': ['bridgewater', 'hedge fund', 'investment'],
    'dalio': ['bridgewater', 'investment'],
    'warren buffett': ['berkshire', 'stocks', 'investment'],
    'buffett': ['berkshire', 'stocks'],
    'berkshire': ['warren buffett', 'stocks', 'insurance'],
    'citadel': ['ken griffin', 'market maker', 'hedge fund'],
    'ken griffin': ['citadel', 'hedge fund'],
    'bridgewater': ['ray dalio', 'hedge fund'],
    'ubs': ['bank', 'switzerland', 'financial'],
    'deutsche bank': ['bank', 'german', 'financial'],
    'standard chartered': ['bank', 'financial'],
    // ── Institutional crypto adoption ─────────────────────────────────────────
    'fidelity': ['bitcoin etf', 'fbtc', 'etf', 'institutional'],
    'fbtc': ['fidelity', 'bitcoin etf', 'etf'],
    'ibit': ['blackrock', 'bitcoin etf', 'etf'],
    'gbtc': ['grayscale', 'bitcoin etf', 'crypto'],
    'grayscale': ['gbtc', 'bitcoin etf', 'crypto', 'etf'],
    'bitwise': ['bitcoin etf', 'etf', 'crypto'],
    'ark invest': ['cathie wood', 'etf', 'bitcoin etf'],
    'cathie wood': ['ark invest', 'etf', 'bitcoin'],
    'cathie': ['ark invest', 'bitcoin etf'],
    'institutional adoption': ['bitcoin', 'crypto', 'etf'],
    'institutional': ['bitcoin', 'etf', 'wall street'],
    'treasury': ['bitcoin', 'strategic reserve', 'government'],
    // ── Crypto news phrases ───────────────────────────────────────────────────
    'hodl': ['bitcoin', 'btc', 'crypto'],
    'holds bitcoin': ['bitcoin', 'btc', 'crypto'],
    'owns bitcoin': ['bitcoin', 'btc', 'crypto'],
    'buys bitcoin': ['bitcoin', 'btc', 'crypto'],
    'bought bitcoin': ['bitcoin', 'btc', 'crypto'],
    'adding bitcoin': ['bitcoin', 'btc', 'crypto'],
    'digital gold': ['bitcoin', 'btc', 'store of value'],
    'store of value': ['bitcoin', 'btc', 'gold'],
    'proof of work': ['bitcoin', 'btc', 'mining'],
    'pow': ['proof of work', 'bitcoin', 'mining'],
    'mining': ['bitcoin', 'btc', 'hashrate'],
    'hashrate': ['bitcoin', 'btc', 'mining'],
    'satoshi': ['bitcoin', 'btc'],
    'sats': ['bitcoin', 'btc', 'satoshi'],
    'lightning': ['bitcoin', 'btc', 'lightning network'],
    'ordinals': ['bitcoin', 'btc', 'nft'],
    'runes': ['bitcoin', 'btc'],
    'taproot': ['bitcoin', 'btc'],
    'all time high': ['bitcoin', 'crypto', 'stocks', 'ath'],
    'ath': ['all time high', 'bitcoin', 'crypto'],
    'all-time high': ['bitcoin', 'crypto', 'ath'],
    'new high': ['bitcoin', 'crypto', 'stocks'],
    '100k': ['bitcoin', 'btc', 'price target'],
    '150k': ['bitcoin', 'btc', 'price target'],
    '200k': ['bitcoin', 'btc', 'price target'],
    // ── Politics / Executive branch (2025-2026) ───────────────────────────────
    'scott bessent': ['treasury', 'fiscal', 'secretary treasury'],
    'bessent': ['treasury', 'fiscal policy'],
    'howard lutnick': ['commerce', 'cantor fitzgerald', 'trade'],
    'lutnick': ['commerce', 'trade'],
    'peter navarro': ['tariff', 'trade war', 'china'],
    'navarro': ['tariff', 'trade war'],
    'robert kennedy': ['rfk', 'health', 'vaccines'],
    'department of government efficiency': ['doge', 'spending cuts'],
    // ── Tech companies / AI (2025-2026) ──────────────────────────────────────
    'amazon': ['amzn', 'aws', 'cloud', 'bezos'],
    'amzn': ['amazon'],
    'jeff bezos': ['amazon', 'amzn'],
    'bezos': ['amazon', 'amzn'],
    'andy jassy': ['amazon', 'aws'],
    'spacex': ['elon musk', 'rockets', 'starship'],
    'starship': ['spacex', 'elon musk'],
    'starlink': ['spacex', 'elon musk', 'satellite'],
    'mark zuckerberg': ['meta', 'facebook', 'instagram'],
    'zuckerberg': ['meta', 'facebook', 'ai'],
    'sundar pichai': ['google', 'alphabet', 'ai'],
    'satya nadella': ['microsoft', 'msft', 'ai'],
    'intel': ['semiconductors', 'chips'],
    'amd': ['semiconductors', 'chips', 'gpu'],
    'qualcomm': ['semiconductors', 'chips', 'mobile'],
    'arm': ['semiconductors', 'chips'],
    // ── Nvidia chip architectures & products ─────────────────────────────────
    'jensen': ['jensen huang', 'nvidia', 'nvda', 'gpu'],
    'blackwell': ['nvidia', 'nvda', 'gpu', 'ai chips'],
    'hopper': ['nvidia', 'nvda', 'gpu', 'h100'],
    'h100': ['nvidia', 'nvda', 'gpu', 'ai chips'],
    'h200': ['nvidia', 'nvda', 'gpu', 'ai chips'],
    'b100': ['nvidia', 'nvda', 'gpu', 'blackwell'],
    'b200': ['nvidia', 'nvda', 'gpu', 'blackwell'],
    'gb200': ['nvidia', 'nvda', 'blackwell', 'gpu'],
    'nvlink': ['nvidia', 'nvda', 'gpu'],
    'cuda': ['nvidia', 'nvda', 'gpu'],
    'data center': ['nvidia', 'ai', 'semiconductors', 'chips'],
    'new chips': ['nvidia', 'semiconductors', 'gpu', 'ai chips'],
    'ai chip': ['nvidia', 'nvda', 'gpu', 'semiconductors'],
    'ai chips': ['nvidia', 'nvda', 'gpu', 'semiconductors'],
    'chip ban': ['semiconductors', 'nvidia', 'china', 'export controls'],
    'export controls': ['semiconductors', 'nvidia', 'china', 'chips'],
    'foundry': ['semiconductors', 'tsmc', 'chips'],
    // New AI model releases
    'claude 4': ['anthropic', 'ai', 'claude', 'llm'],
    'claude 3': ['anthropic', 'ai', 'claude', 'llm'],
    'gpt 5': ['openai', 'chatgpt', 'ai', 'llm'],
    'gpt-5': ['openai', 'chatgpt', 'ai', 'llm'],
    'reasoning model': ['ai', 'openai', 'anthropic', 'llm'],
    'inference': ['ai', 'llm', 'nvidia', 'data center'],
    // ── Macro / Global economy ────────────────────────────────────────────────
    'ecb': ['european central bank', 'euro', 'interest rates'],
    'european central bank': ['ecb', 'euro', 'interest rates'],
    'boe': ['bank of england', 'pound', 'interest rates'],
    'bank of england': ['boe', 'pound', 'interest rates'],
    'pboc': ['china', 'yuan', 'interest rates'],
    'boj': ['bank of japan', 'yen', 'japan'],
    'bank of japan': ['boj', 'yen', 'japan'],
    'dollar': ['usd', 'dxy', 'currency'],
    'dxy': ['dollar', 'usd', 'currency'],
    'usd': ['dollar', 'dxy'],
    'euro': ['eur', 'ecb', 'europe'],
    'eur': ['euro', 'ecb'],
    'yen': ['jpy', 'japan', 'boj'],
    'jpy': ['yen', 'japan'],
    'yuan': ['cny', 'rmb', 'china'],
    'gold': ['xau', 'precious metals', 'store of value', 'commodity'],
    'xau': ['gold', 'precious metals'],
    'silver': ['xag', 'precious metals', 'commodity'],
    'commodities': ['gold', 'oil', 'energy', 'agriculture'],
    'housing market': ['real estate', 'mortgage', 'fed'],
    'mortgage': ['housing market', 'real estate', 'interest rates', 'fed'],
    'real estate': ['housing market', 'mortgage'],
    'debt ceiling': ['congress', 'fiscal', 'treasury'],
    'default': ['debt', 'treasury', 'bonds'],
    'bonds': ['treasuries', 'yield', 'interest rates'],
    'yield': ['bonds', 'treasuries', 'interest rates'],
    // ── Sports / Entertainment (expanded) ────────────────────────────────────
    'chiefs': ['kansas city', 'nfl', 'mahomes', 'super bowl'],
    'eagles': ['philadelphia', 'nfl', 'super bowl'],
    'rams': ['los angeles', 'nfl', 'super bowl'],
    'bills': ['buffalo', 'nfl', 'super bowl'],
    'warriors': ['golden state', 'nba', 'basketball'],
    'heat': ['miami', 'nba', 'basketball'],
    'knicks': ['new york', 'nba', 'basketball'],
    'lebron': ['lakers', 'nba', 'basketball'],
    'curry': ['warriors', 'nba', 'basketball'],
    'messi': ['soccer', 'football', 'inter miami'],
    'ronaldo': ['soccer', 'football', 'cr7'],
    'wimbledon': ['tennis', 'grand slam'],
    'us open': ['tennis', 'grand slam'],
    'masters': ['golf', 'augusta'],
    'oscars': ['academy awards', 'movies', 'film'],
    'academy awards': ['oscars', 'movies', 'film'],
    'grammy': ['music', 'awards'],
    'emmys': ['tv', 'television', 'awards'],
    // ── Geopolitics (extended) ────────────────────────────────────────────────
    'middle east': ['israel', 'gaza', 'iran', 'saudi'],
    'saudi': ['saudi arabia', 'oil', 'opec'],
    'saudi arabia': ['saudi', 'oil', 'opec'],
    'hamas': ['gaza', 'israel', 'middle east'],
    'hezbollah': ['israel', 'middle east', 'iran'],
    'kim jong un': ['north korea', 'nuclear', 'missiles'],
    'kim': ['north korea', 'nuclear'],
    'modi': ['india', 'bjp'],
    'macron': ['france', 'europe', 'eu'],
    'sunak': ['uk', 'britain'],
    'scholz': ['germany', 'german', 'eu'],
    'europe': ['eu', 'european', 'ecb'],
    'eu': ['europe', 'european union'],
    'africa': ['emerging markets'],
    'latin america': ['emerging markets'],
    // ── Anime & Japanese Animation ────────────────────────────────────────────
    'anime': ['japanese animation', 'manga', 'crunchyroll', 'funimation'],
    'manga': ['anime', 'japanese animation', 'shonen jump'],
    'aot': ['attack on titan', 'shingeki no kyojin', 'anime'],
    'attack on titan': ['aot', 'shingeki no kyojin', 'anime', 'mappa'],
    'shingeki no kyojin': ['attack on titan', 'aot', 'anime'],
    'csm': ['chainsaw man', 'anime', 'manga'],
    'chainsaw man': ['csm', 'anime', 'manga', 'mappa'],
    'demon slayer': ['kimetsu no yaiba', 'anime', 'ufotable'],
    'kimetsu no yaiba': ['demon slayer', 'anime'],
    'my hero academia': ['mha', 'boku no hero', 'anime', 'manga'],
    'mha': ['my hero academia', 'boku no hero', 'anime'],
    'boku no hero': ['my hero academia', 'mha', 'anime'],
    'one piece': ['anime', 'manga', 'luffy', 'eiichiro oda'],
    'luffy': ['one piece', 'anime'],
    'naruto': ['anime', 'manga', 'shonen jump'],
    'bleach': ['anime', 'manga', 'shonen jump'],
    'dragon ball': ['anime', 'manga', 'dbz', 'goku'],
    'dbz': ['dragon ball', 'anime'],
    'goku': ['dragon ball', 'anime'],
    'jujutsu kaisen': ['jjk', 'anime', 'manga', 'mappa'],
    'jjk': ['jujutsu kaisen', 'anime'],
    'spy x family': ['anime', 'manga'],
    'studio ghibli': ['ghibli', 'anime', 'miyazaki', 'japanese animation'],
    'ghibli': ['studio ghibli', 'anime', 'miyazaki'],
    'miyazaki': ['hayao miyazaki', 'studio ghibli', 'anime'],
    'hayao miyazaki': ['miyazaki', 'studio ghibli', 'ghibli', 'anime'],
    'totoro': ['studio ghibli', 'miyazaki', 'anime'],
    'spirited away': ['studio ghibli', 'miyazaki', 'anime'],
    'mappa': ['anime', 'animation studio', 'attack on titan', 'jujutsu kaisen'],
    'ufotable': ['anime', 'animation studio', 'demon slayer'],
    'toei': ['anime', 'animation studio', 'one piece', 'dragon ball'],
    'bones': ['anime', 'animation studio', 'my hero academia'],
    'crunchyroll': ['anime', 'streaming', 'funimation', 'sony'],
    'funimation': ['anime', 'streaming', 'crunchyroll'],
    'shonen jump': ['manga', 'anime', 'japanese comics'],
    'webtoon': ['manga', 'comics', 'korean comics'],
    'manhwa': ['korean comics', 'manga', 'webtoon'],
    // ── Content Creation & Creator Economy ────────────────────────────────────
    'tiktok': ['short form', 'social media', 'bytedance', 'content creator', 'influencer'],
    'tiktoker': ['tiktok', 'content creator', 'influencer'],
    'youtube shorts': ['shorts', 'youtube', 'short form', 'content creator'],
    'shorts': ['youtube shorts', 'short form', 'youtube'],
    'reels': ['instagram reels', 'instagram', 'short form', 'meta'],
    'instagram reels': ['reels', 'instagram', 'short form'],
    'content creator': ['creator', 'influencer', 'youtuber', 'tiktoker', 'streamer'],
    'creator': ['content creator', 'influencer', 'youtuber'],
    'influencer': ['content creator', 'creator', 'social media'],
    'youtuber': ['youtube', 'content creator', 'creator'],
    'streamer': ['twitch', 'content creator', 'live stream'],
    'mrbeast': ['youtube', 'content creator', 'jimmy donaldson'],
    'jimmy donaldson': ['mrbeast', 'youtube'],
    'creator economy': ['content creator', 'influencer', 'monetization'],
    'monetization': ['creator economy', 'content creator', 'revenue'],
    'subscribers': ['youtube', 'content creator', 'followers'],
    'followers': ['social media', 'influencer', 'subscribers'],
    'views': ['youtube', 'tiktok', 'content creator'],
    'viral': ['tiktok', 'youtube', 'social media', 'trending'],
    'trending': ['viral', 'social media', 'tiktok'],
    'edits': ['video editing', 'content creation', 'editing'],
    'edit': ['video editing', 'editing', 'content creation'],
    'video editing': ['editing', 'content creation', 'premiere', 'final cut'],
    'editing': ['video editing', 'content creation'],
    'clawdbots': ['ai', 'ai bots', 'automation', 'content creation'],
    'ai bots': ['ai', 'automation', 'bots'],
    'bots': ['automation', 'ai bots'],
    // ── Streaming Platforms ────────────────────────────────────────────────────
    'twitch': ['streaming', 'amazon', 'live stream', 'content creator'],
    'live stream': ['streaming', 'twitch', 'youtube'],
    'streaming': ['netflix', 'twitch', 'youtube', 'content'],
    'netflix': ['streaming', 'content', 'series', 'movies'],
    'hulu': ['streaming', 'content', 'disney'],
    'disney plus': ['streaming', 'disney', 'content'],
    'disney+': ['disney plus', 'streaming', 'disney'],
    'hbo max': ['streaming', 'warner bros', 'content'],
    'prime video': ['streaming', 'amazon', 'content'],
    'paramount plus': ['streaming', 'paramount', 'content'],
    // ── AI Video & Content Tools ───────────────────────────────────────────────
    'sora': ['openai', 'ai video', 'video generation', 'ai'],
    'runway': ['ai video', 'video generation', 'generative ai'],
    'pika': ['ai video', 'video generation', 'generative ai'],
    'midjourney': ['ai', 'generative ai', 'ai art', 'image generation'],
    'stable diffusion': ['ai', 'generative ai', 'ai art', 'image generation'],
    'ai video': ['sora', 'runway', 'pika', 'generative ai', 'video generation'],
    'video generation': ['ai video', 'sora', 'runway', 'generative ai'],
    'ai art': ['generative ai', 'midjourney', 'stable diffusion'],
    'ai animation': ['ai video', 'animation', 'generative ai'],
    'generative ai': ['ai', 'ai video', 'ai art', 'diffusion'],
    // ── Film & Movies ──────────────────────────────────────────────────────────
    'film': ['movie', 'cinema', 'box office', 'hollywood'],
    'movie': ['film', 'cinema', 'box office'],
    'cinema': ['film', 'movie', 'theater'],
    'box office': ['movie', 'film', 'revenue', 'theater'],
    'hollywood': ['film', 'movie', 'entertainment'],
    'cartoon': ['animation', 'animated', 'cartoon edits'],
    'animation': ['animated', 'cartoon', 'anime'],
    'animated': ['animation', 'cartoon'],
    'pixar': ['animation', 'disney', 'animated film'],
    'dreamworks': ['animation', 'animated film'],
    // ── Gaming (expanded coverage) ────────────────────────────────────────────
    'gta': ['gta 6', 'grand theft auto', 'rockstar', 'gaming'],
    'gta 6': ['gta', 'grand theft auto', 'rockstar', 'gaming', 'video game'],
    'gta vi': ['gta 6', 'gta', 'grand theft auto', 'rockstar'],
    'grand theft auto': ['gta', 'gta 6', 'rockstar', 'gaming'],
    'rockstar': ['gta', 'gta 6', 'gaming', 'take two'],
    'take two': ['rockstar', 'gta', 'gaming'],
    'elden ring': ['fromsoftware', 'souls', 'gaming', 'rpg', 'dlc'],
    'fromsoftware': ['elden ring', 'dark souls', 'gaming', 'souls'],
    'souls': ['elden ring', 'dark souls', 'fromsoftware', 'gaming'],
    'dark souls': ['fromsoftware', 'souls', 'elden ring', 'gaming'],
    'league of legends': ['lol', 'riot games', 'esports', 'moba', 'gaming'],
    'lol': ['league of legends', 'esports', 'riot games', 'gaming'],
    'riot games': ['league of legends', 'valorant', 'gaming', 'esports'],
    'faker': ['league of legends', 'lol', 't1', 'esports'],
    't1': ['league of legends', 'faker', 'esports', 'korea'],
    'valorant': ['riot games', 'fps', 'esports', 'gaming', 'tac shooter'],
    'sentinels': ['valorant', 'esports', 'tenz', 'gaming'],
    'tenz': ['sentinels', 'valorant', 'esports'],
    'nintendo': ['switch', 'switch 2', 'gaming', 'console', 'zelda', 'mario'],
    'switch': ['nintendo', 'switch 2', 'gaming', 'console'],
    'switch 2': ['nintendo', 'switch', 'gaming', 'console', 'next gen'],
    'zelda': ['nintendo', 'switch', 'gaming', 'tears of the kingdom'],
    'mario': ['nintendo', 'switch', 'gaming', 'super mario'],
    'pokemon': ['nintendo', 'switch', 'gaming', 'game freak'],
    'minecraft': ['mojang', 'microsoft', 'sandbox', 'gaming', 'video game'],
    'mojang': ['minecraft', 'microsoft', 'gaming'],
    'hollow knight': ['silksong', 'indie game', 'metroidvania', 'team cherry'],
    'silksong': ['hollow knight', 'indie game', 'metroidvania', 'gaming'],
    'indie game': ['gaming', 'indie', 'video game'],
    'esports': ['gaming', 'competitive', 'tournament', 'league'],
    'gaming': ['video game', 'esports', 'gamer', 'console'],
    'gamer': ['gaming', 'video game', 'esports'],
    'console': ['gaming', 'playstation', 'xbox', 'nintendo'],
    'playstation': ['ps5', 'sony', 'gaming', 'console'],
    'ps5': ['playstation', 'sony', 'gaming', 'console'],
    'xbox': ['microsoft', 'gaming', 'console'],
    // ── Music (expanded coverage) ─────────────────────────────────────────────
    'taylor swift': ['music', 'pop', 'swifties', 'eras tour', 'album'],
    'swifties': ['taylor swift', 'music', 'fandom'],
    'eras tour': ['taylor swift', 'tour', 'concert', 'music'],
    'beyonce': ['music', 'pop', 'renaissance', 'tour', 'beyoncé'],
    'beyoncé': ['beyonce', 'music', 'pop'],
    'renaissance': ['beyonce', 'music', 'album'],
    'the weeknd': ['music', 'pop', 'r&b', 'abel tesfaye'],
    'abel tesfaye': ['the weeknd', 'music'],
    'coachella': ['music festival', 'festival', 'music', 'concert'],
    'music festival': ['coachella', 'concert', 'music', 'tour'],
    'festival': ['music festival', 'concert', 'music'],
    'sabrina carpenter': ['music', 'pop', 'singer', 'espresso'],
    'espresso': ['sabrina carpenter', 'music', 'song'],
    'ye': ['kanye west', 'kanye', 'music', 'rap', 'hip hop'],
    'concert': ['music', 'tour', 'live music', 'show'],
    'tour': ['concert', 'music', 'live music'],
    'album': ['music', 'release', 'new album'],
    'single': ['music', 'song', 'release'],
    'collaboration': ['music', 'collab', 'feature'],
    'collab': ['collaboration', 'music', 'feature'],
    // ── Social Media & Streaming ──────────────────────────────────────────────
    'kick': ['streaming', 'xqc', 'stake', 'content creator'],
    'pokimane': ['twitch', 'streaming', 'content creator', 'offlinetv'],
    'xqc': ['twitch', 'kick', 'streaming', 'streamer', 'content creator'],
    'mcdonalds': ['fast food', 'breakfast', 'restaurant', 'mcdonald'],
    'mcdonald': ['mcdonalds', 'fast food'],
    'starbucks': ['coffee', 'sbux', 'cafe', 'union'],
    'sbux': ['starbucks', 'coffee'],
    'fast food': ['mcdonalds', 'burger king', 'wendys', 'restaurant'],
    'restaurant': ['fast food', 'dining', 'food'],
    'shein': ['fast fashion', 'ecommerce', 'fashion', 'retail'],
    'balenciaga': ['fashion', 'luxury', 'brand', 'designer'],
    'met gala': ['fashion', 'vogue', 'anna wintour', 'red carpet'],
    'reddit': ['social media', 'rddt', 'stock', 'wallstreetbets'],
    'wallstreetbets': ['reddit', 'wsb', 'stocks', 'meme stock'],
    'wsb': ['wallstreetbets', 'reddit', 'stocks'],
};
// ─── Utility functions ───────────────────────────────────────────────────────
/** Returns true if a character is a word character (letter, digit, apostrophe) */
function isWordChar(ch) {
    const code = ch.charCodeAt(0);
    return ((code >= 97 && code <= 122) || // a-z
        (code >= 65 && code <= 90) || // A-Z
        (code >= 48 && code <= 57) || // 0-9
        code === 39 // apostrophe
    );
}
/**
 * Checks whether `term` appears in `text` as a whole word (respects word boundaries).
 * Avoids creating new RegExp objects per call for performance.
 */
function hasWordBoundaryMatch(text, term) {
    const termLower = term.toLowerCase();
    const textLower = text.toLowerCase();
    let idx = textLower.indexOf(termLower);
    while (idx !== -1) {
        const before = idx === 0 || !isWordChar(textLower[idx - 1]);
        const after = idx + termLower.length >= textLower.length ||
            !isWordChar(textLower[idx + termLower.length]);
        if (before && after)
            return true;
        idx = textLower.indexOf(termLower, idx + 1);
    }
    return false;
}
/**
 * Generates unigrams, bigrams, and trigrams from cleaned text.
 * Enables multi-word synonym keys like "jerome powell" or "rate cut".
 */
function extractPhrases(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const phrases = [...words];
    for (let i = 0; i < words.length - 1; i++) {
        phrases.push(words[i] + ' ' + words[i + 1]);
    }
    for (let i = 0; i < words.length - 2; i++) {
        phrases.push(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
    }
    return phrases;
}
/**
 * Expands a token list with synonyms from SYNONYM_MAP.
 * Both the original tokens and their aliases are included.
 */
function expandWithSynonyms(tokens) {
    const expanded = new Set(tokens);
    for (const token of tokens) {
        const syns = SYNONYM_MAP[token.toLowerCase()];
        if (syns) {
            for (const s of syns)
                expanded.add(s);
        }
    }
    return Array.from(expanded);
}
/**
 * Extracts meaningful tokens from a market title for supplementary matching.
 * These are weighted lower than explicit market keywords.
 */
function extractTitleTokens(title) {
    const TITLE_STOPS = new Set([
        'will', 'the', 'a', 'an', 'in', 'on', 'at', 'by', 'for', 'to', 'of',
        'and', 'or', 'is', 'be', 'has', 'have', 'are', 'was', 'were', 'been',
        'do', 'does', 'did', '2024', '2025', '2026', '2027', 'before', 'after',
        'end', 'yes', 'no', 'than', 'over', 'under', 'above', 'below', 'hit',
        'reach', 'win', 'lose', 'pass', 'major', 'us', 'use', 'its', 'their',
        'any', 'all', 'into', 'out', 'up', 'down',
        'world', 'cup', 'game', 'games', 'live', 'work', 'way', 'show', 'back',
        'know', 'good', 'big', 'take', 'top', 'open', 'run', 'real', 'right',
        'mean', 'only', 'even', 'well', 'off', 'look', 'find', 'going', 'come',
        'make', 'made', 'day', 'days', 'part', 'true', 'keep', 'left', 'try',
        'give', 'once', 'ever', 'much', 'many', 'other', 'every', 'again',
        'move', 'play', 'long', 'high', 'side', 'line', 'lead', 'role', 'hold',
        'plan', 'place', 'start', 'see', 'say', 'said', 'goes',
        'man', 'men', 'city', 'united', 'new', 'old', 'final', 'league',
    ]);
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !TITLE_STOPS.has(w));
}
// ─── Scoring ─────────────────────────────────────────────────────────────────
// Cap the normalization denominator so markets with large keyword lists
// (20-40 keywords from description extraction) don't get artificially low scores.
// Without this cap, a perfect bitcoin+btc+crypto match on a 25-keyword market
// scores 2.2/25 = 0.088 — below threshold despite being a strong signal.
// ─── Promotional/Spam Content Detection ──────────────────────────────────────
const PROMOTIONAL_PATTERNS = (/* unused pure expression or super */ null && ([
    // Financial scams / trading promotions
    /\$\d+k.*pass.*test/i, // "$100K if you pass test"
    /won't give you.*we will/i, // "Your bank won't give you, we will"
    /no deposits.*profits/i, // "No deposits, keep profits"
    /worst case.*lose.*fee/i, // "Worst case you lose the entry fee"
    /free \$\d+/i, // "Free $500"
    /claim.*\$\d+/i, // "Claim your $100"
    /limited.*offer/i, // "Limited time offer"
    /click.*link.*bio/i, // "Click link in bio"
    /dm.*for.*more/i, // "DM me for more info"
    /join.*discord/i, // Promotional Discord links
    /airdrop/i, // Crypto airdrops
    /whitelist/i, // NFT/crypto whitelists
    /presale/i, // Token presales
    /guaranteed.*profit/i, // "Guaranteed profits"
    /risk[- ]free/i, // "Risk-free trading"
]));
/**
 * Detect if a tweet is promotional/spam content
 * Returns true if tweet matches promotional patterns
 */
function isPromotionalContent(text) {
    const normalized = text.toLowerCase();
    // Check against known promotional patterns
    for (const pattern of PROMOTIONAL_PATTERNS) {
        if (pattern.test(text)) {
            return true;
        }
    }
    // Excessive emoji usage (often in spam)
    const emojiCount = (text.match(/[\uD800-\uDFFF]/g) || []).length;
    if (emojiCount > 15 && text.length < 200) {
        return true; // More than 15 emoji chars in a short tweet is suspicious
    }
    // Multiple dollar amounts with no context (often scams)
    const dollarMatches = text.match(/\$\d+[KMB]?/gi);
    if (dollarMatches && dollarMatches.length >= 3) {
        // 3+ different dollar amounts mentioned = likely promotional
        return true;
    }
    return false;
}
// ─── Category coherence detection ───────────────────────────────────────────
// Category-related term clusters for coherence detection
const CATEGORY_CLUSTERS = {
    gaming: new Set(['gaming', 'video game', 'console', 'esports', 'pc', 'steam', 'playstation', 'xbox', 'nintendo', 'switch', 'gta', 'minecraft', 'valorant']),
    crypto: new Set(['crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'btc', 'eth', 'blockchain', 'defi', 'web3', 'solana', 'nft']),
    music: new Set(['music', 'album', 'tour', 'concert', 'artist', 'song', 'single', 'spotify', 'streaming music', 'coachella', 'festival']),
    tech: new Set(['tech', 'technology', 'ai', 'software', 'startup', 'silicon valley', 'coding', 'developer', 'nvidia', 'openai']),
    sports: new Set(['sports', 'team', 'championship', 'playoff', 'season', 'athlete', 'coach', 'league', 'nfl', 'nba']),
    politics: new Set(['politics', 'election', 'congress', 'president', 'senate', 'house', 'vote', 'bill', 'policy']),
    finance: new Set(['stock', 'stocks', 'market', 'trading', 'wall street', 'ipo', 'shares', 'investor']),
};
/**
 * Detects category coherence - gives bonus when tweet contains multiple related terms
 * from the same category, indicating strong topical focus
 */
function getCategoryCoherenceBonus(matchedKeywords, marketCategory) {
    for (const [category, terms] of Object.entries(CATEGORY_CLUSTERS)) {
        const matchedInCategory = matchedKeywords.filter(kw => terms.has(kw.toLowerCase())).length;
        // If we have 3+ terms from same category, strong signal
        if (matchedInCategory >= 3) {
            // Extra boost if market category aligns
            return marketCategory === category ? 0.15 : 0.1;
        }
        // 2 terms from same category is moderate signal
        if (matchedInCategory === 2) {
            return marketCategory === category ? 0.08 : 0.05;
        }
    }
    return 0;
}
/**
 * Recency boost - markets ending soon are more relevant
 */
function getRecencyBoost(market) {
    if (!market.endDate)
        return 0;
    try {
        const endDate = new Date(market.endDate);
        const now = new Date();
        const daysUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        // Markets ending within 7 days get bigger boost (check first!)
        if (daysUntilEnd > 0 && daysUntilEnd <= 7) {
            return 0.2; // Increased from 0.1
        }
        // Markets ending within 30 days get a small boost
        if (daysUntilEnd > 0 && daysUntilEnd <= 30) {
            return 0.1; // Increased from 0.05
        }
    }
    catch (e) {
        // Invalid date, no boost
    }
    return 0;
}
/**
 * Numeric context detection
 * Helps match price targets, dates, percentages mentioned in tweets
 */
function extractNumericContexts(text) {
    const contexts = new Set();
    // Price targets: $100, $50K, $1M, etc.
    const priceMatches = text.matchAll(/\$(\d+(?:,\d{3})*(?:\.\d+)?[KMB]?)/gi);
    for (const match of priceMatches) {
        contexts.add(`price:${match[1].toLowerCase()}`);
    }
    // Percentages: 5%, 10%, etc.
    const percentMatches = text.matchAll(/(\d+(?:\.\d+)?)%/g);
    for (const match of percentMatches) {
        contexts.add(`percent:${match[1]}`);
    }
    // Years: 2024-2029, etc.
    const yearMatches = text.matchAll(/\b(202[4-9])\b/g);
    for (const match of yearMatches) {
        contexts.add(`year:${match[1]}`);
    }
    return contexts;
}
const DENOMINATOR_CAP = 5;
/**
 * Detect negation patterns in tweet text.
 * Returns true if tweet expresses that something will NOT happen.
 */
function detectNegation(text) {
    const lower = text.toLowerCase();
    // Strong negation patterns
    const negationPatterns = [
        /\bwon'?t\b/,
        /\bwill not\b/,
        /\bnot going to\b/,
        /\bunlikely to\b/,
        /\bdoubt\b/,
        /\bimpossible\b/,
        /\bno chance\b/,
        /\bno way\b/,
        /\bnever\b/,
        /\bcan'?t see\b/,
        /\bdon'?t think\b.*\bwill\b/,
        /\bisn'?t going to\b/,
        /\baren'?t going to\b/,
    ];
    return negationPatterns.some(pattern => pattern.test(lower));
}
/**
 * Detect if tweet is asking a question.
 */
function detectQuestion(text) {
    const trimmed = text.trim();
    // Check for question mark
    if (trimmed.includes('?'))
        return true;
    // Check for question words at start
    const lower = text.toLowerCase();
    const questionStarters = [
        /^will\b/,
        /^would\b/,
        /^could\b/,
        /^should\b/,
        /^is\b/,
        /^are\b/,
        /^do\b/,
        /^does\b/,
        /^can\b/,
        /^what\b/,
        /^when\b/,
        /^where\b/,
        /^who\b/,
        /^why\b/,
        /^how\b/,
    ];
    return questionStarters.some(pattern => pattern.test(lower));
}
/**
 * Get entities that appear in the first 100 characters of the tweet.
 * These are considered "prominent" and get extra weight.
 */
function getProminentEntities(text, entities) {
    const prominent = new Set();
    const first100 = text.substring(0, 100).toLowerCase();
    for (const entity of entities.all) {
        if (first100.includes(entity.toLowerCase())) {
            prominent.add(entity.toLowerCase());
        }
    }
    return prominent;
}
function computeScore(r, market, matchedKeywords, hasNegation, isQuestion, prominentEntities) {
    if (r.totalChecked === 0)
        return 0;
    // Weighted sum: entity (2x) > exact > synonym > title
    const weighted = r.entityMatches * 2.0 + // NEW: Entity matches get 2x weight
        r.exactMatches * 1.0 +
        r.synonymMatches * 0.5 + // Reduced from 0.6 to reduce weak synonym matches
        r.titleMatches * 0.15; // Reduced from 0.3 to reduce title noise
    // Normalize by keyword list length, capped to avoid penalizing markets
    // that happen to have many keywords from description extraction.
    const denominator = Math.min(r.totalChecked, DENOMINATOR_CAP);
    const normalized = weighted / denominator;
    const totalMatched = r.exactMatches + r.synonymMatches + r.titleMatches + r.entityMatches;
    // STRICTER FILTERING: Require stronger signals
    // Require EITHER:
    // - 1+ exact match AND 3+ total matches (increased from 2+)
    // - OR 2+ synonym matches AND 4+ total matches (increased from 3+)
    // - OR 1+ entity match AND 3+ total matches (entity-driven match)
    if (r.exactMatches >= 1 || r.entityMatches >= 1) {
        // If we have at least 1 exact or entity match, require 3+ total matches
        if (totalMatched < 3) {
            return 0;
        }
    }
    else if (r.synonymMatches >= 2) {
        // If no exact/entity matches, need 2+ synonym matches AND 4+ total
        if (totalMatched < 4) {
            return 0;
        }
    }
    else {
        // No exact/entity matches and <2 synonym matches = reject
        return 0;
    }
    // Small coverage bonus for matching multiple distinct keywords
    const coverageBonus = Math.min(0.2, (totalMatched - 1) * 0.05);
    // Phrase bonus: multi-word matches are much more specific than single words
    // Each phrase match adds 0.1 confidence (capped at 0.3)
    const phraseBonus = Math.min(0.3, r.multiWordMatches * 0.1);
    // Category coherence bonus
    const coherenceBonus = getCategoryCoherenceBonus(matchedKeywords, market.category || '');
    // Recency boost
    const recencyBoost = getRecencyBoost(market);
    // Entity prominence boost: if matched keywords contain prominent entities
    let prominenceBonus = 0;
    for (const kw of matchedKeywords) {
        if (prominentEntities.has(kw)) {
            prominenceBonus += 0.08; // 8% boost per prominent entity
        }
    }
    prominenceBonus = Math.min(0.25, prominenceBonus); // Cap at 25%
    // Question bonus: if tweet is a question and market title contains question words
    let questionBonus = 0;
    if (isQuestion) {
        const marketTitle = market.title.toLowerCase();
        if (marketTitle.includes('will') || marketTitle.includes('?')) {
            questionBonus = 0.1; // 10% boost for interrogative markets
        }
    }
    // NEGATION PENALTY: If tweet says something won't happen, heavily penalize
    let negationPenalty = 0;
    if (hasNegation) {
        // Check if market title is affirmative (most markets are "Will X happen?")
        const marketTitle = market.title.toLowerCase();
        // If market is asking "will X happen" and tweet says "won't happen", big penalty
        if (marketTitle.includes('will') && !marketTitle.includes('not') && !marketTitle.includes("won't")) {
            negationPenalty = 0.4; // Reduce confidence by 40%
        }
    }
    const baseScore = Math.min(1.0, normalized + (totalMatched > 0 ? coverageBonus : 0) + phraseBonus + coherenceBonus + recencyBoost + prominenceBonus + questionBonus);
    return Math.max(0, baseScore - negationPenalty);
}
// ─── KeywordMatcher class ────────────────────────────────────────────────────
class KeywordMatcher {
    constructor(markets = [], minConfidence = 0.28, // Raised from 0.22 to reduce false positives further
    maxResults = 5) {
        this.markets = markets;
        this.minConfidence = minConfidence;
        this.maxResults = maxResults;
    }
    /**
     * Match a tweet to relevant markets, returning results sorted by confidence.
     */
    match(tweetText) {
        // Filter out very short tweets (likely noise or greetings)
        if (tweetText.trim().length < 20)
            return [];
        // Step 1: Detect negation patterns - if tweet is saying something WON'T happen
        const hasNegation = detectNegation(tweetText);
        // Step 2: Detect if this is a question
        const isQuestion = detectQuestion(tweetText);
        // Step 3: Extract entities (people, tickers, organizations, dates)
        const entities = extractEntities(tweetText);
        // Step 4: Calculate entity prominence (entities in first 100 chars get boost)
        const prominentEntities = getProminentEntities(tweetText, entities);
        // Step 5: Extract raw tokens (unigrams + bigrams + trigrams) from tweet
        const rawTokens = this.extractKeywords(tweetText);
        if (rawTokens.length === 0)
            return [];
        // Step 6: Expand with synonyms — done once, reused for all markets
        const expandedTokens = expandWithSynonyms(rawTokens);
        const rawTokenSet = new Set(rawTokens);
        const expandedTokenSet = new Set(expandedTokens);
        const matches = [];
        const now = new Date();
        for (const market of this.markets) {
            // Filter out expired markets
            if (market.endDate) {
                const endDate = new Date(market.endDate);
                if (endDate < now) {
                    continue; // Skip expired markets
                }
            }
            const result = this.scoreMarket(market, rawTokenSet, expandedTokenSet, entities, hasNegation, isQuestion, prominentEntities);
            if (result.confidence >= this.minConfidence) {
                matches.push(result);
            }
        }
        matches.sort((a, b) => b.confidence - a.confidence);
        return matches.slice(0, this.maxResults);
    }
    /**
     * Extract and clean keywords from tweet text.
     * Returns unigrams + bigrams + trigrams, filtered for noise.
     */
    extractKeywords(text) {
        let normalized = text.toLowerCase();
        // Remove URLs and mentions
        normalized = normalized.replace(/https?:\/\/[^\s]+/g, '');
        normalized = normalized.replace(/@\w+/g, '');
        // Extract hashtags as plain words
        const hashtags = Array.from(text.matchAll(/#(\w+)/g)).map(m => m[1].toLowerCase());
        // Remove special chars, preserve & for "s&p"
        normalized = normalized.replace(/[^a-z0-9\s&']/g, ' ');
        normalized = normalized.replace(/\s+/g, ' ').trim();
        // Generate unigrams + bigrams + trigrams
        const phrases = extractPhrases(normalized);
        // Filter: single tokens must pass stop-word + noise-word checks
        const filtered = phrases.filter(token => {
            if (token.includes(' ')) {
                // Multi-word phrases: only length filter (phrases are inherently specific)
                return token.length > 4;
            }
            return (token.length > 2 &&
                !STOP_WORDS.has(token) &&
                !DOMAIN_NOISE_WORDS.has(token));
        });
        // Merge with hashtags and deduplicate
        return [...new Set([...filtered, ...hashtags])];
    }
    /**
     * Score a single market against the pre-computed tweet token sets.
     */
    scoreMarket(market, rawTokenSet, expandedTokenSet, entities, hasNegation, isQuestion, prominentEntities) {
        const matchedKeywords = [];
        let exactMatches = 0;
        let synonymMatches = 0;
        let titleMatches = 0;
        let entityMatches = 0; // NEW: Track entity matches
        let multiWordMatches = 0; // Track phrase matches for prioritization
        const explicitKeywords = market.keywords.map(k => k.toLowerCase());
        // PRIORITY 1: Multi-word phrases (most specific)
        for (const mk of explicitKeywords) {
            if (mk.includes(' ')) {
                if (hasWordBoundaryMatch(Array.from(rawTokenSet).join(' '), mk)) {
                    exactMatches++;
                    multiWordMatches++;
                    // Check if this is an entity match
                    if (isEntity(mk, entities)) {
                        entityMatches++;
                    }
                    matchedKeywords.push(mk);
                }
                else if (hasWordBoundaryMatch(Array.from(expandedTokenSet).join(' '), mk)) {
                    synonymMatches++;
                    multiWordMatches++;
                    // Check if this is an entity match
                    if (isEntity(mk, entities)) {
                        entityMatches++;
                    }
                    matchedKeywords.push(mk);
                }
            }
        }
        // PRIORITY 2: Single-word exact/synonym matches
        for (const mk of explicitKeywords) {
            if (!mk.includes(' ') && !matchedKeywords.includes(mk)) {
                if (expandedTokenSet.has(mk)) {
                    if (rawTokenSet.has(mk)) {
                        exactMatches++;
                    }
                    else {
                        synonymMatches++;
                    }
                    // Check if this is an entity match (people, tickers, orgs)
                    if (isEntity(mk, entities)) {
                        entityMatches++;
                    }
                    matchedKeywords.push(mk);
                }
            }
        }
        // Title-word fallback: check if any tweet token appears in the market title.
        // Weighted lower than explicit keyword matches; catches cases where
        // generateKeywords() misses a term that's clearly in the title.
        const titleTokens = extractTitleTokens(market.title);
        for (const tt of titleTokens) {
            if (!matchedKeywords.includes(tt) && expandedTokenSet.has(tt)) {
                titleMatches++;
                // Check if this is an entity match
                if (isEntity(tt, entities)) {
                    entityMatches++;
                }
                matchedKeywords.push(tt);
            }
        }
        const confidence = computeScore({
            exactMatches,
            synonymMatches,
            titleMatches,
            entityMatches, // NEW: Pass entity matches to scorer
            totalChecked: explicitKeywords.length,
            multiWordMatches,
        }, market, matchedKeywords, hasNegation, isQuestion, prominentEntities);
        return { market, confidence, matchedKeywords };
    }
    /** Update confidence threshold */
    setMinConfidence(minConfidence) {
        this.minConfidence = minConfidence;
    }
    /** Update max results */
    setMaxResults(maxResults) {
        this.maxResults = maxResults;
    }
}
// Singleton instance
const matcher = new KeywordMatcher();

;// ./src/api/keyword-generator.ts
// Generates market keywords from title + description.
// Uses unigrams only (no bigram noise) plus SYNONYM_MAP forward expansion.
// Including the description means company names, tickers, and context words
// appear as keywords without needing hand-coded SYNONYM_MAP entries.

const TITLE_STOPS = new Set([
    'will', 'the', 'a', 'an', 'in', 'on', 'at', 'by', 'for', 'to', 'of',
    'and', 'or', 'is', 'be', 'has', 'have', 'are', 'was', 'were', 'been',
    'do', 'does', 'did', '2024', '2025', '2026', '2027', '2028', 'before',
    'after', 'end', 'yes', 'no', 'than', 'over', 'under', 'above', 'below',
    'hit', 'reach', 'win', 'lose', 'pass', 'major', 'us', 'use', 'its',
    'their', 'any', 'all', 'into', 'out', 'up', 'down', 'as', 'from',
    'with', 'this', 'that', 'not', 'new', 'more', 'than', 'most', 'least',
    'how', 'what', 'when', 'where', 'who', 'get', 'got', 'put', 'set',
    'per', 'via', 'vs', 'vs.', 'than', 'if', 'whether', 'close', 'below',
    'least', 'value', 'level', 'least', 'each', 'such', 'also', 'still',
    'next', 'last', 'first', 'time', 'market', 'price', 'would',
    // Generic English words that appear in everyday speech but carry no
    // market-specific signal when seen in isolation (e.g. "world" in a
    // FIFA World Cup title would create a spurious keyword that matches
    // tweets mentioning "the world" in an unrelated context).
    // "man city" / "man united" are handled via SYNONYM_MAP bigrams instead.
    'world', 'cup', 'game', 'games', 'live', 'work', 'way', 'show', 'back',
    'know', 'good', 'big', 'take', 'top', 'open', 'run', 'real', 'right',
    'mean', 'only', 'even', 'well', 'off', 'look', 'find', 'going', 'come',
    'make', 'made', 'day', 'days', 'part', 'true', 'keep', 'left', 'try',
    'give', 'once', 'ever', 'much', 'many', 'other', 'every', 'again',
    'move', 'play', 'long', 'high', 'side', 'line', 'lead', 'role', 'hold',
    'plan', 'place', 'start', 'see', 'say', 'said', 'goes',
    'man', 'men', 'city', 'united', 'new', 'old', 'final', 'league',
]);
/** Extract unigrams from a text string, applying stop-word filtering */
function extractUnigrams(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s'&$]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(w => w.length > 2 && !TITLE_STOPS.has(w));
}
/** Extract bigrams + trigrams that are keys in SYNONYM_MAP */
function extractSynonymPhrases(text) {
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s'&]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(w => w.length > 0);
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
        const bigram = words[i] + ' ' + words[i + 1];
        if (SYNONYM_MAP[bigram])
            phrases.push(bigram);
        if (i < words.length - 2) {
            const trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
            if (SYNONYM_MAP[trigram])
                phrases.push(trigram);
        }
    }
    return phrases;
}
// Max keywords per market. Keeps the keyword list focused and prevents the
// scoring denominator from being inflated by verbose description text.
const MAX_KEYWORDS = 20;
/**
 * Generates market keywords from title and optional description.
 *
 * Strategy:
 * 1. Extract unigrams from title (stop-word filtered) — no bigram noise
 * 2. Extract bigrams/trigrams from title ONLY if they are SYNONYM_MAP keys
 * 3. Apply SYNONYM_MAP forward expansion for all tokens found
 * 4. Extract unigrams from first 300 chars of description for extra context
 *    (company names, tickers, etc. not present in the title)
 * 5. Cap total at MAX_KEYWORDS, prioritising title-derived keywords
 * 6. Deduplicate and return
 */
function generateKeywords(title, description) {
    const titleKeywords = new Set();
    const descKeywords = new Set();
    // ── Title: unigrams ──────────────────────────────────────────────────────
    const titleUnigrams = extractUnigrams(title);
    for (const token of titleUnigrams) {
        titleKeywords.add(token);
        const syns = SYNONYM_MAP[token];
        if (syns)
            syns.forEach(s => titleKeywords.add(s));
    }
    // ── Title: known multi-word aliases (bigrams/trigrams in SYNONYM_MAP) ───
    for (const phrase of extractSynonymPhrases(title)) {
        titleKeywords.add(phrase);
        const syns = SYNONYM_MAP[phrase];
        if (syns)
            syns.forEach(s => titleKeywords.add(s));
    }
    // ── Description: unigrams from first 300 chars (supplementary only) ─────
    if (description) {
        const descUnigrams = extractUnigrams(description.slice(0, 300));
        for (const token of descUnigrams) {
            if (!titleKeywords.has(token)) {
                descKeywords.add(token);
                const syns = SYNONYM_MAP[token];
                if (syns)
                    syns.forEach(s => descKeywords.add(s));
            }
        }
    }
    // Title keywords always included first; description fills up to the cap.
    const result = Array.from(titleKeywords);
    for (const k of descKeywords) {
        if (result.length >= MAX_KEYWORDS)
            break;
        result.push(k);
    }
    return result;
}

;// ./src/api/polymarket-client.ts
// Polymarket public API client
// Fetches live binary prediction markets and maps them to the internal Market interface.
// No authentication required — public read-only endpoint with no CORS restrictions.

const POLYMARKET_API = 'https://gamma-api.polymarket.com';
const FETCH_TIMEOUT_MS = 10000; // 10s timeout to prevent hanging on cold starts
/**
 * Returns true only for simple binary Yes/No markets.
 * Filters out multi-outcome and non-binary markets.
 */
function isBinaryMarket(pm) {
    if (!pm.question || !pm.conditionId || !pm.slug)
        return false;
    if (!pm.active || pm.closed)
        return false;
    try {
        const outcomes = JSON.parse(pm.outcomes);
        if (outcomes.length !== 2)
            return false;
        // Must be a Yes/No market
        const lower = outcomes.map(o => o.toLowerCase());
        if (!lower.includes('yes') || !lower.includes('no'))
            return false;
    }
    catch {
        return false;
    }
    return true;
}
/**
 * Fetch active binary markets from Polymarket's public gamma API.
 * Uses cursor-based pagination until we have enough markets.
 */
async function fetchPolymarkets(targetCount = 500, maxPages = 10) {
    const PAGE_SIZE = 100;
    const allMarkets = [];
    let offset = 0;
    for (let page = 0; page < maxPages; page++) {
        const url = `${POLYMARKET_API}/markets?closed=false&active=true` +
            `&order=volume24hrClob&ascending=false` +
            `&limit=${PAGE_SIZE}&offset=${offset}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        try {
            const resp = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!resp.ok) {
                console.error(`[Musashi SW] Polymarket HTTP ${resp.status}`);
                throw new Error(`Polymarket API responded with ${resp.status}`);
            }
            const data = await resp.json();
            if (!Array.isArray(data)) {
                throw new Error('Unexpected Polymarket API response shape');
            }
            if (data.length === 0)
                break; // no more results
            const pageBinary = data
                .filter(isBinaryMarket)
                .map(toMarket)
                .filter(m => m.yesPrice > 0 && m.yesPrice < 1);
            allMarkets.push(...pageBinary);
            console.log(`[Musashi] Polymarket page ${page + 1}: ${data.length} raw → ` +
                `${pageBinary.length} binary (total: ${allMarkets.length})`);
            if (allMarkets.length >= targetCount || data.length < PAGE_SIZE)
                break;
            offset += PAGE_SIZE;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Polymarket API request timed out after ${FETCH_TIMEOUT_MS}ms`);
            }
            throw error;
        }
    }
    console.log(`[Musashi] Fetched ${allMarkets.length} live markets from Polymarket`);
    return allMarkets.slice(0, targetCount);
}
/** Map a raw Polymarket market object to our Market interface */
function toMarket(pm) {
    let yesPrice = 0.5;
    try {
        const prices = JSON.parse(pm.outcomePrices);
        const outcomes = JSON.parse(pm.outcomes);
        // Find the index of "Yes" in outcomes
        const yesIdx = outcomes.findIndex(o => o.toLowerCase() === 'yes');
        if (yesIdx !== -1 && prices[yesIdx] != null) {
            yesPrice = parseFloat(prices[yesIdx]);
        }
    }
    catch {
        // fallback to 0.5
    }
    const safeYes = Math.min(Math.max(yesPrice, 0.01), 0.99);
    const safeNo = +((1 - safeYes).toFixed(2));
    return {
        id: `polymarket-${pm.conditionId}`,
        platform: 'polymarket',
        title: pm.question,
        description: pm.description ?? '',
        keywords: generateKeywords(pm.question, pm.description),
        yesPrice: +safeYes.toFixed(2),
        noPrice: safeNo,
        volume24h: pm.volume24hr ?? 0,
        url: `https://polymarket.com/event/${pm.events?.[0]?.slug ?? pm.slug}`,
        category: inferCategory(pm.question, pm.category),
        lastUpdated: new Date().toISOString(),
        numericId: pm.id,
        oneDayPriceChange: pm.oneDayPriceChange ?? 0,
        endDate: pm.endDateIso ?? undefined,
    };
}
/** Infer a rough category from the market question text */
function inferCategory(question, apiCategory) {
    if (apiCategory) {
        const c = apiCategory.toLowerCase();
        if (c.includes('crypto') || c.includes('bitcoin'))
            return 'crypto';
        if (c.includes('politic') || c.includes('elect'))
            return 'us_politics';
        if (c.includes('sport') || c.includes('nfl') || c.includes('nba'))
            return 'sports';
        if (c.includes('tech'))
            return 'technology';
    }
    const q = question.toUpperCase();
    if (/BTC|ETH|CRYPTO|SOL|XRP|DOGE|BITCOIN|ETHEREUM/.test(q))
        return 'crypto';
    if (/FED|CPI|GDP|INFLATION|RATE|RECESSION|UNEMP|JOBS/.test(q))
        return 'economics';
    if (/TRUMP|BIDEN|HARRIS|PRES|CONGRESS|SENATE|ELECT|GOP|DEM|HOUSE/.test(q))
        return 'us_politics';
    if (/NVDA|AAPL|MSFT|GOOGLE|META|AMAZON|AI|OPENAI|TECH|TESLA/.test(q))
        return 'technology';
    if (/NFL|NBA|MLB|NHL|SUPER BOWL|WORLD CUP|FIFA|GOLF|TENNIS/.test(q))
        return 'sports';
    if (/CLIMATE|WEATHER|CARBON|ENERGY|OIL/.test(q))
        return 'climate';
    if (/UKRAINE|RUSSIA|CHINA|NATO|TAIWAN|ISRAEL|GAZA|IRAN/.test(q))
        return 'geopolitics';
    return 'other';
}

;// ./src/api/kalshi-client.ts
// Kalshi public API client
// Fetches live open markets and maps them to the internal Market interface.
// No authentication required — these are public read-only endpoints.

const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';
const kalshi_client_FETCH_TIMEOUT_MS = 10000; // 10s timeout to prevent hanging on cold starts
/**
 * Returns true for simple binary YES/NO markets.
 * Filters out complex multi-variable event (parlay/combo) markets whose
 * titles are multi-leg strings like "yes Lakers, yes Celtics, no Bulls..."
 */
function isSimpleMarket(km) {
    if (!km.title || !km.ticker)
        return false;
    // MVE / multi-game parlay markets
    if (km.mve_collection_ticker)
        return false;
    if (/MULTIGAME|MVE/i.test(km.ticker))
        return false;
    // Titles that start with "yes " are multi-leg combo selections
    if (/^yes\s/i.test(km.title.trim()))
        return false;
    // More than 2 commas = likely a multi-leg title
    const commas = (km.title.match(/,/g) || []).length;
    if (commas > 2)
        return false;
    return true;
}
/**
 * Fetch open markets from Kalshi's public API using cursor pagination.
 *
 * The default API ordering puts thousands of MVE (parlay/sports) markets first.
 * isSimpleMarket() filters those out, so we must page through until we have
 * enough simple binary markets for meaningful tweet matching.
 *
 * Stops when we reach `targetSimpleCount` simple markets or exhaust `maxPages`.
 */
async function fetchKalshiMarkets(targetSimpleCount = 400, maxPages = 15) {
    const PAGE_SIZE = 200;
    const allSimple = [];
    let cursor;
    for (let page = 0; page < maxPages; page++) {
        const url = cursor
            ? `${KALSHI_API}/markets?status=open&mve_filter=exclude&limit=${PAGE_SIZE}&cursor=${encodeURIComponent(cursor)}`
            : `${KALSHI_API}/markets?status=open&mve_filter=exclude&limit=${PAGE_SIZE}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), kalshi_client_FETCH_TIMEOUT_MS);
        try {
            const resp = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!resp.ok) {
                console.error(`[Musashi SW] Kalshi HTTP ${resp.status} — declarativeNetRequest header stripping may not be active yet`);
                throw new Error(`Kalshi API responded with ${resp.status}`);
            }
            const data = await resp.json();
            if (!Array.isArray(data.markets)) {
                throw new Error('Unexpected Kalshi API response shape');
            }
            const pageSimple = data.markets
                .filter(isSimpleMarket)
                .map(kalshi_client_toMarket)
                .filter(m => m.yesPrice > 0 && m.yesPrice < 1);
            allSimple.push(...pageSimple);
            console.log(`[Musashi] Page ${page + 1}: ${data.markets.length} raw → ` +
                `${pageSimple.length} simple (total simple: ${allSimple.length})`);
            // Stop early once we have enough, or when the API has no more pages
            if (allSimple.length >= targetSimpleCount || !data.cursor)
                break;
            cursor = data.cursor;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Kalshi API request timed out after ${kalshi_client_FETCH_TIMEOUT_MS}ms`);
            }
            throw error;
        }
    }
    console.log(`[Musashi] Fetched ${allSimple.length} live markets from Kalshi`);
    return allSimple;
}
/** Map a raw Kalshi market object to our Market interface */
function kalshi_client_toMarket(km) {
    // Prefer the _dollars variant (already 0–1); fall back to /100 conversion
    let yesPrice;
    if (km.yes_bid_dollars != null && km.yes_ask_dollars != null && km.yes_ask_dollars > 0) {
        yesPrice = (km.yes_bid_dollars + km.yes_ask_dollars) / 2;
    }
    else if (km.yes_bid != null && km.yes_ask != null && km.yes_ask > 0) {
        yesPrice = ((km.yes_bid + km.yes_ask) / 2) / 100;
    }
    else if (km.last_price_dollars != null && km.last_price_dollars > 0) {
        yesPrice = km.last_price_dollars;
    }
    else if (km.last_price != null && km.last_price > 0) {
        yesPrice = km.last_price / 100;
    }
    else {
        yesPrice = 0.5;
    }
    const safeYes = Math.min(Math.max(yesPrice, 0.01), 0.99);
    const safeNo = +((1 - safeYes).toFixed(2));
    // ── URL construction ───────────────────────────────────────────────────────
    // Kalshi web URLs follow: kalshi.com/markets/{series}/{slug}/{event_ticker}
    // The API does NOT return series_ticker, so we always derive it via extractSeriesTicker().
    // The middle slug segment is SEO-only; Kalshi redirects any slug to the canonical one.
    // The final segment MUST be the event_ticker (not market ticker), lowercase.
    const seriesTicker = (km.series_ticker || extractSeriesTicker(km.event_ticker ?? km.ticker))
        .toLowerCase();
    const eventTickerLower = (km.event_ticker ?? km.ticker).toLowerCase();
    const titleSlug = slugify(km.title);
    const marketUrl = `https://kalshi.com/markets/${seriesTicker}/${titleSlug}/${eventTickerLower}`;
    return {
        id: `kalshi-${km.ticker}`,
        platform: 'kalshi',
        title: km.title,
        description: '',
        keywords: generateKeywords(km.title),
        yesPrice: +safeYes.toFixed(2),
        noPrice: safeNo,
        volume24h: km.volume_24h ?? km.volume ?? 0,
        url: marketUrl,
        category: kalshi_client_inferCategory(km.series_ticker || km.event_ticker || km.ticker),
        lastUpdated: new Date().toISOString(),
    };
}
/** Convert a market title to a URL-safe slug (middle segment of Kalshi URLs) */
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
/**
 * Extracts the series ticker from an event_ticker or market ticker.
 * Kalshi event tickers follow: {SERIES}-{DATE_OR_DESCRIPTOR}
 * e.g. "KXBTC-26FEB1708"  → "KXBTC"
 *      "KXGEMINI-VS-CHATGPT" → "KXGEMINI"
 *      "PRES-DEM-2024" → "PRES"
 */
function extractSeriesTicker(ticker) {
    // Try splitting on '-' and returning up to the first segment that
    // looks like a date (digits followed by letters) or is all-caps alpha-only
    const parts = ticker.split('-');
    if (parts.length === 1)
        return parts[0];
    // If second segment starts with digits (looks like a date: 26FEB, 2024, etc.)
    // → series is just the first part
    if (/^\d/.test(parts[1]))
        return parts[0];
    // Otherwise return the first two parts joined
    // e.g. KXGEMINI-VS → "KXGEMINI-VS" would still 404; just use first segment
    return parts[0];
}
/** Infer a rough category from the market's series/event ticker prefix */
function kalshi_client_inferCategory(ticker) {
    const t = ticker.toUpperCase();
    if (/BTC|ETH|CRYPTO|SOL|XRP|DOGE|NFT|DEFI/.test(t))
        return 'crypto';
    if (/FED|CPI|GDP|INFL|RATE|ECON|UNEMP|JOBS|RECESS/.test(t))
        return 'economics';
    if (/TRUMP|BIDEN|PRES|CONG|SENATE|ELECT|GOP|DEM|HOUSE/.test(t))
        return 'us_politics';
    if (/NVDA|AAPL|MSFT|GOOGL|META|AMZN|AI|TECH|TSLA|OPENAI/.test(t))
        return 'technology';
    if (/NFL|NBA|MLB|NHL|SPORT|SUPER|WORLD|FIFA|GOLF|TENNIS/.test(t))
        return 'sports';
    if (/CLIMATE|TEMP|WEATHER|CARBON|EMISS|ENERGY|OIL/.test(t))
        return 'climate';
    if (/UKRAIN|RUSSIA|CHINA|NATO|TAIWAN|ISRAEL|GAZA|IRAN/.test(t))
        return 'geopolitics';
    return 'other';
}

;// ./src/api/arbitrage-detector.ts
// Cross-platform arbitrage detector
// Matches markets across Polymarket and Kalshi to find price discrepancies
/**
 * Normalize a title for fuzzy matching
 * Removes punctuation, dates, common question words, normalizes spacing
 */
function normalizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/\?/g, '') // Remove question marks
        .replace(/\b(will|before|after|by|in|on|at|the|a|an)\b/g, '') // Remove filler words
        .replace(/\b(2024|2025|2026|2027|2028)\b/g, '') // Remove years
        .replace(/[^a-z0-9\s]/g, ' ') // Remove all punctuation
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}
/**
 * Extract key entities from a market title
 * Looks for: names, tickers, numbers, organizations
 */
function arbitrage_detector_extractEntities(title) {
    const normalized = normalizeTitle(title);
    const words = normalized.split(' ');
    const entities = new Set();
    // Extract significant words (3+ chars, not in stop list)
    const stopWords = new Set(['will', 'hit', 'reach', 'win', 'lose', 'pass', 'than', 'over', 'under']);
    for (const word of words) {
        if (word.length >= 3 && !stopWords.has(word)) {
            entities.add(word);
        }
    }
    return entities;
}
/**
 * Calculate similarity score between two titles
 * Returns 0-1 based on shared entities
 */
function calculateTitleSimilarity(title1, title2) {
    const entities1 = arbitrage_detector_extractEntities(title1);
    const entities2 = arbitrage_detector_extractEntities(title2);
    if (entities1.size === 0 || entities2.size === 0)
        return 0;
    // Count shared entities
    let sharedCount = 0;
    for (const entity of entities1) {
        if (entities2.has(entity)) {
            sharedCount++;
        }
    }
    // Jaccard similarity: intersection / union
    const union = entities1.size + entities2.size - sharedCount;
    return union > 0 ? sharedCount / union : 0;
}
/**
 * Calculate keyword overlap between two markets
 * Returns the number of shared keywords
 */
function calculateKeywordOverlap(market1, market2) {
    const keywords1 = new Set(market1.keywords);
    const keywords2 = new Set(market2.keywords);
    let overlap = 0;
    for (const kw of keywords1) {
        if (keywords2.has(kw)) {
            overlap++;
        }
    }
    return overlap;
}
/**
 * Check if two markets refer to the same event
 * Uses title similarity + keyword overlap + category matching
 */
function areMarketsSimilar(poly, kalshi) {
    // Must be in the same category (or one is 'other')
    const categoryMatch = poly.category === kalshi.category ||
        poly.category === 'other' ||
        kalshi.category === 'other';
    if (!categoryMatch) {
        return { isSimilar: false, confidence: 0, reason: 'Different categories' };
    }
    // Calculate title similarity
    const titleSim = calculateTitleSimilarity(poly.title, kalshi.title);
    // Calculate keyword overlap
    const keywordOverlap = calculateKeywordOverlap(poly, kalshi);
    // Matching criteria (needs at least one strong signal):
    // 1. High title similarity (>0.5) OR
    // 2. Strong keyword overlap (3+ shared keywords)
    if (titleSim > 0.5) {
        return {
            isSimilar: true,
            confidence: titleSim,
            reason: `High title similarity (${(titleSim * 100).toFixed(0)}%)`
        };
    }
    if (keywordOverlap >= 3) {
        const confidence = Math.min(keywordOverlap / 10, 0.9); // Cap at 0.9
        return {
            isSimilar: true,
            confidence,
            reason: `${keywordOverlap} shared keywords`
        };
    }
    // Check for exact entity matches (strong signal even with low overall similarity)
    const polyEntities = arbitrage_detector_extractEntities(poly.title);
    const kalshiEntities = arbitrage_detector_extractEntities(kalshi.title);
    const sharedEntities = Array.from(polyEntities).filter(e => kalshiEntities.has(e));
    if (sharedEntities.length >= 2 && titleSim > 0.3) {
        return {
            isSimilar: true,
            confidence: 0.7,
            reason: `Shared entities: ${sharedEntities.slice(0, 3).join(', ')}`
        };
    }
    return { isSimilar: false, confidence: 0, reason: 'Insufficient similarity' };
}
/**
 * Detect arbitrage opportunities across Polymarket and Kalshi
 *
 * @param markets - Combined array of markets from both platforms
 * @param minSpread - Minimum spread to be considered an opportunity (default: 0.03 = 3%)
 * @returns Array of arbitrage opportunities sorted by spread (highest first)
 */
function detectArbitrage(markets, minSpread = 0.03) {
    const opportunities = [];
    // Separate markets by platform
    const polymarkets = markets.filter(m => m.platform === 'polymarket');
    const kalshiMarkets = markets.filter(m => m.platform === 'kalshi');
    console.log(`[Arbitrage] Checking ${polymarkets.length} Polymarket × ${kalshiMarkets.length} Kalshi markets`);
    // Compare each Polymarket market with each Kalshi market
    for (const poly of polymarkets) {
        for (const kalshi of kalshiMarkets) {
            const similarity = areMarketsSimilar(poly, kalshi);
            if (!similarity.isSimilar)
                continue;
            // Calculate spread
            const spread = Math.abs(poly.yesPrice - kalshi.yesPrice);
            if (spread < minSpread)
                continue;
            // Determine direction and profit potential
            let direction;
            let profitPotential;
            if (poly.yesPrice < kalshi.yesPrice) {
                // Buy on Polymarket (cheaper), sell on Kalshi (more expensive)
                direction = 'buy_poly_sell_kalshi';
                profitPotential = spread; // Simplified: actual profit after fees would be lower
            }
            else {
                // Buy on Kalshi (cheaper), sell on Polymarket (more expensive)
                direction = 'buy_kalshi_sell_poly';
                profitPotential = spread;
            }
            opportunities.push({
                polymarket: poly,
                kalshi: kalshi,
                spread,
                profitPotential,
                direction,
                confidence: similarity.confidence,
                matchReason: similarity.reason,
            });
        }
    }
    // Sort by spread (highest first)
    opportunities.sort((a, b) => b.spread - a.spread);
    console.log(`[Arbitrage] Found ${opportunities.length} opportunities (min spread: ${minSpread})`);
    return opportunities;
}
/**
 * Get top arbitrage opportunities
 * Filters by minimum spread and confidence, returns top N
 */
function getTopArbitrage(markets, options = {}) {
    const { minSpread = 0.03, minConfidence = 0.5, limit = 20, category, } = options;
    let opportunities = detectArbitrage(markets, minSpread);
    // Filter by confidence
    opportunities = opportunities.filter(op => op.confidence >= minConfidence);
    // Filter by category if specified
    if (category) {
        opportunities = opportunities.filter(op => op.polymarket.category === category || op.kalshi.category === category);
    }
    // Return top N
    return opportunities.slice(0, limit);
}

;// ./src/analysis/sentiment-analyzer.ts
/**
 * Simple sentiment analyzer for tweets
 * Detects bullish/bearish/neutral sentiment based on keyword analysis
 */
// Bullish indicators
const BULLISH_KEYWORDS = [
    'bullish', 'moon', 'rally', 'pump', 'surge', 'soar', 'skyrocket',
    'buy', 'long', 'calls', 'green', 'win', 'winning', 'yes', 'definitely',
    'confirmed', 'happening', 'inevitable', 'obvious', 'clearly', 'certain',
    'guarantee', 'lock', 'easy', 'confident', 'predict', 'will happen',
    'going to', 'up', 'rise', 'increase', 'gain', 'profit', 'success',
    'boom', 'growth', 'explosive', 'parabolic', 'breakout'
];
// Bearish indicators
const BEARISH_KEYWORDS = [
    'bearish', 'dump', 'crash', 'plunge', 'tank', 'collapse', 'fall',
    'sell', 'short', 'puts', 'red', 'lose', 'losing', 'no', 'impossible',
    'unlikely', 'doubt', 'skeptical', 'concern', 'worried', 'fear', 'risk',
    'down', 'decline', 'drop', 'decrease', 'loss', 'fail', 'failure',
    'bubble', 'overvalued', 'recession', 'bear', 'correction'
];
// Strong modifiers (increase weight)
const STRONG_MODIFIERS = [
    'very', 'extremely', 'highly', 'absolutely', 'completely', 'totally',
    'definitely', 'certainly', 'obviously', 'clearly', 'strongly', 'really'
];
// Negations (reverse sentiment)
const NEGATIONS = [
    'not', 'no', "don't", "won't", "can't", "isn't", "aren't", "doesn't",
    'never', 'neither', 'nor', 'none', 'nobody', 'nothing', 'nowhere'
];
/**
 * Analyze tweet text and return sentiment
 */
function analyzeSentiment(tweetText) {
    const text = tweetText.toLowerCase();
    const words = text.split(/\s+/);
    let bullishScore = 0;
    let bearishScore = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[^a-z]/g, '');
        const prevWord = i > 0 ? words[i - 1].replace(/[^a-z]/g, '') : '';
        // Check for negation
        const isNegated = NEGATIONS.includes(prevWord);
        // Check for strong modifier
        const isStrong = STRONG_MODIFIERS.includes(prevWord);
        const weight = isStrong ? 2 : 1;
        // Check bullish
        if (BULLISH_KEYWORDS.includes(word)) {
            if (isNegated) {
                bearishScore += weight;
            }
            else {
                bullishScore += weight;
            }
        }
        // Check bearish
        if (BEARISH_KEYWORDS.includes(word)) {
            if (isNegated) {
                bullishScore += weight;
            }
            else {
                bearishScore += weight;
            }
        }
    }
    // Calculate total and determine sentiment
    const total = bullishScore + bearishScore;
    if (total === 0) {
        return { sentiment: 'neutral', confidence: 0 };
    }
    const bullishRatio = bullishScore / total;
    const bearishRatio = bearishScore / total;
    // Need strong signal to classify (>60%)
    if (bullishRatio > 0.6) {
        return { sentiment: 'bullish', confidence: bullishRatio };
    }
    if (bearishRatio > 0.6) {
        return { sentiment: 'bearish', confidence: bearishRatio };
    }
    // Mixed or weak signal
    return { sentiment: 'neutral', confidence: 1 - Math.abs(bullishRatio - bearishRatio) };
}

;// ./src/analysis/signal-generator.ts
// Signal Generator - Converts matched markets into actionable trading signals
// Computes edge, urgency, signal_type, and suggested_action for bot developers

/**
 * Check if tweet contains breaking news keywords
 */
function isBreakingNews(text) {
    const breakingKeywords = [
        'breaking',
        'just in',
        'announced',
        'confirmed',
        'official',
        'reports',
        'alert',
        'urgent',
        'developing',
    ];
    const lowerText = text.toLowerCase();
    return breakingKeywords.some(kw => lowerText.includes(kw));
}
/**
 * Calculate implied probability from sentiment
 * Bullish sentiment implies higher YES probability
 * Bearish sentiment implies lower YES probability (higher NO)
 */
function calculateImpliedProbability(sentiment) {
    if (sentiment.sentiment === 'neutral') {
        return 0.5; // No directional bias
    }
    if (sentiment.sentiment === 'bullish') {
        // Bullish: high confidence = higher YES probability
        return 0.5 + (sentiment.confidence * 0.4); // Range: 0.5 to 0.9
    }
    // Bearish: high confidence = lower YES probability
    return 0.5 - (sentiment.confidence * 0.4); // Range: 0.1 to 0.5
}
/**
 * Calculate trading edge for a market given sentiment
 * Edge = how much the sentiment-implied probability differs from market price
 */
function calculateEdge(market, sentiment) {
    const impliedProb = calculateImpliedProbability(sentiment);
    const currentPrice = market.yesPrice;
    // Raw difference between implied and actual price
    const priceDiff = Math.abs(impliedProb - currentPrice);
    // Weight by sentiment confidence
    const edge = sentiment.confidence * priceDiff;
    return edge;
}
/**
 * Check if market expires soon (within 7 days)
 */
function expiresSoon(market) {
    if (!market.endDate)
        return false;
    const endDate = new Date(market.endDate);
    const now = new Date();
    const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
}
/**
 * Compute urgency level based on edge, volume, and expiry
 */
function computeUrgency(edge, market, hasArbitrage, arbitrageSpread) {
    // Critical: Strong edge + high volume + expires soon
    // OR very high arbitrage spread
    if (hasArbitrage && arbitrageSpread && arbitrageSpread > 0.05) {
        return 'critical';
    }
    if (edge > 0.15 && market.volume24h > 500000 && expiresSoon(market)) {
        return 'critical';
    }
    // High: Good edge OR moderate arbitrage
    if (edge > 0.10) {
        return 'high';
    }
    if (hasArbitrage && arbitrageSpread && arbitrageSpread > 0.03) {
        return 'high';
    }
    // Medium: Decent edge
    if (edge > 0.05) {
        return 'medium';
    }
    // Low: Match found but no clear edge
    return 'low';
}
/**
 * Determine signal type based on context
 */
function computeSignalType(tweetText, sentiment, edge, hasArbitrage) {
    // Arbitrage takes precedence
    if (hasArbitrage) {
        return 'arbitrage';
    }
    // Breaking news
    if (isBreakingNews(tweetText)) {
        return 'news_event';
    }
    // Sentiment strongly disagrees with market (high edge)
    if (edge > 0.10 && sentiment.sentiment !== 'neutral') {
        return 'sentiment_shift';
    }
    // Default: just a match without strong signal
    return 'user_interest';
}
/**
 * Generate suggested trading action
 */
function generateSuggestedAction(market, sentiment, edge, urgency) {
    // Don't suggest action if edge is too low
    if (edge < 0.10) {
        return {
            direction: 'HOLD',
            confidence: 0,
            edge: 0,
            reasoning: 'Insufficient edge to justify a trade',
        };
    }
    const impliedProb = calculateImpliedProbability(sentiment);
    const currentPrice = market.yesPrice;
    let direction;
    let reasoning;
    if (sentiment.sentiment === 'neutral') {
        direction = 'HOLD';
        reasoning = 'Neutral sentiment, no clear directional bias';
    }
    else if (sentiment.sentiment === 'bullish') {
        // Bullish sentiment
        if (impliedProb > currentPrice) {
            // YES is underpriced
            direction = 'YES';
            reasoning = `Bullish sentiment (${(sentiment.confidence * 100).toFixed(0)}% confidence) suggests YES is underpriced at ${(currentPrice * 100).toFixed(0)}%`;
        }
        else {
            direction = 'HOLD';
            reasoning = 'Bullish sentiment but YES already priced high';
        }
    }
    else {
        // Bearish sentiment
        if (impliedProb < currentPrice) {
            // YES is overpriced, buy NO
            direction = 'NO';
            reasoning = `Bearish sentiment (${(sentiment.confidence * 100).toFixed(0)}% confidence) suggests YES is overpriced at ${(currentPrice * 100).toFixed(0)}%`;
        }
        else {
            direction = 'HOLD';
            reasoning = 'Bearish sentiment but YES already priced low';
        }
    }
    // Confidence based on edge and urgency
    let actionConfidence = edge;
    if (urgency === 'critical')
        actionConfidence = Math.min(edge * 1.5, 0.95);
    else if (urgency === 'high')
        actionConfidence = Math.min(edge * 1.2, 0.9);
    return {
        direction,
        confidence: actionConfidence,
        edge,
        reasoning,
    };
}
/**
 * Generate event ID from tweet text (deterministic hash)
 * Same text will always produce the same event ID for deduplication
 */
function generateEventId(tweetText) {
    // Simple hash function for deterministic IDs
    let hash = 0;
    for (let i = 0; i < tweetText.length; i++) {
        const char = tweetText.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    const hashStr = Math.abs(hash).toString(36);
    return `evt_${hashStr}`;
}
/**
 * Generate a trading signal from matched markets and tweet text
 */
function generateSignal(tweetText, matches, arbitrageOpportunity) {
    const startTime = Date.now();
    // If no matches, return minimal signal
    if (matches.length === 0) {
        return {
            event_id: generateEventId(tweetText),
            signal_type: 'user_interest',
            urgency: 'low',
            matches: [],
            metadata: {
                processing_time_ms: Date.now() - startTime,
                tweet_text: tweetText,
            },
        };
    }
    // Analyze tweet sentiment
    const sentiment = analyzeSentiment(tweetText);
    // Use the top match (highest confidence) for signal computation
    const topMatch = matches[0];
    const topMarket = topMatch.market;
    // Calculate edge
    const edge = calculateEdge(topMarket, sentiment);
    // Compute urgency
    const urgency = computeUrgency(edge, topMarket, !!arbitrageOpportunity, arbitrageOpportunity?.spread);
    // Determine signal type
    const signal_type = computeSignalType(tweetText, sentiment, edge, !!arbitrageOpportunity);
    // Generate suggested action
    const suggested_action = generateSuggestedAction(topMarket, sentiment, edge, urgency);
    return {
        event_id: generateEventId(tweetText),
        signal_type,
        urgency,
        matches,
        suggested_action,
        sentiment,
        arbitrage: arbitrageOpportunity,
        metadata: {
            processing_time_ms: Date.now() - startTime,
            tweet_text: tweetText,
        },
    };
}
/**
 * Batch generate signals for multiple tweets
 */
function batchGenerateSignals(tweets) {
    return tweets.map(tweet => generateSignal(tweet.text, tweet.matches));
}

;// ./src/analysis/analyze-text.ts
/* unused harmony import specifier */ var analyze_text_KeywordMatcher;
/* unused harmony import specifier */ var analyze_text_generateSignal;
// Text Analysis Orchestrator
// Combines keyword matching, sentiment analysis, and signal generation


/**
 * Analyze tweet text and return trading signal with matched markets
 * This is the main entry point for text analysis
 */
async function analyzeText(text, markets, options) {
    const startTime = Date.now();
    // Step 1: Match markets using keyword matcher
    const matcher = new analyze_text_KeywordMatcher(markets, options?.minConfidence ?? 0.3, options?.maxResults ?? 5);
    const matches = matcher.match(text);
    // Step 2: Check if any matched markets have arbitrage opportunities
    // This would require cross-referencing with stored arbitrage data
    // For now, we'll leave this as undefined and add it in the service worker
    const arbitrageOpportunity = undefined;
    // Step 3: Generate trading signal
    const signal = analyze_text_generateSignal(text, matches, arbitrageOpportunity);
    // Update processing time to include the full pipeline
    signal.metadata.processing_time_ms = Date.now() - startTime;
    return signal;
}
/**
 * Analyze text and check for arbitrage in the matched markets
 * This version cross-references with cached arbitrage opportunities
 */
async function analyzeTextWithArbitrage(text, markets, arbitrageOpportunities, options) {
    const startTime = Date.now();
    // Step 1: Match markets
    const matcher = new KeywordMatcher(markets, options?.minConfidence ?? 0.3, options?.maxResults ?? 5);
    const matches = matcher.match(text);
    // Step 2: Check if any matched markets have arbitrage
    let arbitrageOpportunity;
    if (matches.length > 0 && arbitrageOpportunities.length > 0) {
        const topMatch = matches[0];
        const matchedMarketId = topMatch.market.id;
        // Find arbitrage opportunity involving this market
        arbitrageOpportunity = arbitrageOpportunities.find(arb => arb.polymarket.id === matchedMarketId || arb.kalshi.id === matchedMarketId);
    }
    // Step 3: Generate signal
    const signal = generateSignal(text, matches, arbitrageOpportunity);
    signal.metadata.processing_time_ms = Date.now() - startTime;
    return signal;
}
/**
 * Simple wrapper for backward compatibility
 * Returns just the matched markets without signal generation
 */
function simpleMatch(text, markets, minConfidence = 0.3, maxResults = 5) {
    const matcher = new analyze_text_KeywordMatcher(markets, minConfidence, maxResults);
    return matcher.match(text);
}

;// ./src/api/price-tracker.ts
// Price Tracker - Tracks market price changes over time
// Stores historical snapshots to detect movers and price trends
// Storage keys for price history
const STORAGE_KEY_PRICE_HISTORY = 'price_history_v1';
const STORAGE_KEY_MOVERS = 'market_movers_v1';
const STORAGE_KEY_MOVERS_TS = 'moversTs_v1';
// How long to keep price history (7 days)
const HISTORY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// How long to keep movers in cache (5 minutes)
const MOVERS_CACHE_TTL_MS = 5 * 60 * 1000;
/**
 * Record a price snapshot for a market
 */
async function recordPriceSnapshot(marketId, platform, yesPrice) {
    const snapshot = {
        marketId,
        platform,
        yesPrice,
        timestamp: Date.now(),
    };
    // Get existing history
    const history = await loadPriceHistory();
    // Initialize array if not exists
    if (!history[marketId]) {
        history[marketId] = [];
    }
    // Add new snapshot
    history[marketId].push(snapshot);
    // Keep only recent snapshots (last 7 days)
    const cutoff = Date.now() - HISTORY_TTL_MS;
    history[marketId] = history[marketId].filter(s => s.timestamp >= cutoff);
    // Save back to storage
    await savePriceHistory(history);
}
/**
 * Record snapshots for multiple markets
 */
async function recordBulkSnapshots(markets) {
    const history = await loadPriceHistory();
    const now = Date.now();
    const cutoff = now - HISTORY_TTL_MS;
    for (const market of markets) {
        const snapshot = {
            marketId: market.id,
            platform: market.platform,
            yesPrice: market.yesPrice,
            timestamp: now,
        };
        if (!history[market.id]) {
            history[market.id] = [];
        }
        history[market.id].push(snapshot);
        // Keep only recent snapshots
        history[market.id] = history[market.id].filter(s => s.timestamp >= cutoff);
    }
    await savePriceHistory(history);
}
/**
 * Get price change for a market over a time period
 */
async function getPriceChange(marketId, hoursAgo) {
    const history = await loadPriceHistory();
    const snapshots = history[marketId];
    if (!snapshots || snapshots.length === 0) {
        return null;
    }
    // Get current price (most recent snapshot)
    const current = snapshots[snapshots.length - 1];
    // Find snapshot closest to hoursAgo
    const targetTime = Date.now() - (hoursAgo * 60 * 60 * 1000);
    // Find the snapshot closest to targetTime
    let closestSnapshot = snapshots[0];
    let closestDiff = Math.abs(closestSnapshot.timestamp - targetTime);
    for (const snapshot of snapshots) {
        const diff = Math.abs(snapshot.timestamp - targetTime);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestSnapshot = snapshot;
        }
    }
    // If the closest snapshot is too old (more than 2x the target period), return null
    if (closestDiff > (hoursAgo * 60 * 60 * 1000 * 2)) {
        return null;
    }
    // Calculate price change
    const change = current.yesPrice - closestSnapshot.yesPrice;
    return change;
}
/**
 * Detect market movers (significant price changes)
 */
async function detectMovers(markets, minChange = 0.05, // 5% minimum change
timeframe = '1h') {
    const hoursMap = { '1h': 1, '6h': 6, '24h': 24 };
    const hours = hoursMap[timeframe];
    const movers = [];
    for (const market of markets) {
        const change1h = await getPriceChange(market.id, 1);
        const change24h = await getPriceChange(market.id, 24);
        if (change1h === null)
            continue;
        const absChange = Math.abs(change1h);
        if (absChange >= minChange) {
            const history = await loadPriceHistory();
            const snapshots = history[market.id];
            const previousPrice = snapshots && snapshots.length > 1
                ? snapshots[snapshots.length - 2].yesPrice
                : market.yesPrice;
            movers.push({
                market,
                priceChange1h: change1h,
                priceChange24h: change24h ?? 0,
                previousPrice,
                currentPrice: market.yesPrice,
                direction: change1h > 0 ? 'up' : 'down',
                timestamp: Date.now(),
            });
        }
    }
    // Sort by absolute change (biggest movers first)
    movers.sort((a, b) => Math.abs(b.priceChange1h) - Math.abs(a.priceChange1h));
    return movers;
}
/**
 * Get cached movers or recompute if stale
 */
async function getMovers(markets, options = {}) {
    const { minChange = 0.05, timeframe = '1h', limit = 20, forceRefresh = false, } = options;
    if (!forceRefresh) {
        // Try to load from cache
        const cached = await loadCachedMovers();
        if (cached && cached.movers && cached.timestamp) {
            const age = Date.now() - cached.timestamp;
            if (age < MOVERS_CACHE_TTL_MS) {
                console.log(`[Price Tracker] Returning ${cached.movers.length} cached movers`);
                return filterMovers(cached.movers, minChange, limit);
            }
        }
    }
    // Compute fresh movers
    const movers = await detectMovers(markets, minChange, timeframe);
    // Cache the results
    await cacheMovers(movers);
    console.log(`[Price Tracker] Detected ${movers.length} movers (min change: ${minChange})`);
    return movers.slice(0, limit);
}
/**
 * Filter and limit movers
 */
function filterMovers(movers, minChange, limit) {
    return movers
        .filter(m => Math.abs(m.priceChange1h) >= minChange)
        .slice(0, limit);
}
/**
 * Load price history from storage
 */
async function loadPriceHistory() {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        return {};
    }
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY_PRICE_HISTORY], (result) => {
            const history = result[STORAGE_KEY_PRICE_HISTORY] ?? {};
            resolve(history);
        });
    });
}
/**
 * Save price history to storage
 */
async function savePriceHistory(history) {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        return;
    }
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY_PRICE_HISTORY]: history }, () => {
            resolve();
        });
    });
}
/**
 * Load cached movers from storage
 */
async function loadCachedMovers() {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        return null;
    }
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY_MOVERS, STORAGE_KEY_MOVERS_TS], (result) => {
            const movers = result[STORAGE_KEY_MOVERS];
            const timestamp = result[STORAGE_KEY_MOVERS_TS];
            if (movers && timestamp) {
                resolve({ movers, timestamp });
            }
            else {
                resolve(null);
            }
        });
    });
}
/**
 * Cache movers to storage
 */
async function cacheMovers(movers) {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        return;
    }
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [STORAGE_KEY_MOVERS]: movers,
            [STORAGE_KEY_MOVERS_TS]: Date.now(),
        }, () => {
            resolve();
        });
    });
}
/**
 * Clear old price history (cleanup utility)
 */
async function cleanupOldHistory() {
    const history = await loadPriceHistory();
    const cutoff = Date.now() - HISTORY_TTL_MS;
    let cleaned = 0;
    for (const marketId in history) {
        const before = history[marketId].length;
        history[marketId] = history[marketId].filter(s => s.timestamp >= cutoff);
        const after = history[marketId].length;
        if (history[marketId].length === 0) {
            delete history[marketId];
        }
        cleaned += (before - after);
    }
    if (cleaned > 0) {
        await savePriceHistory(history);
        console.log(`[Price Tracker] Cleaned ${cleaned} old snapshots`);
    }
}

;// ./src/api/polymarket-price-poller.ts
/**
 * Polymarket CLOB Price Poller
 *
 * Lightweight price polling for Polymarket markets using the CLOB API.
 * Fetches only price data (not full market objects) for efficient updates.
 *
 * CLOB API: https://clob.polymarket.com
 */
const CLOB_API = 'https://clob.polymarket.com';
/**
 * Fetch current price for a single Polymarket market from CLOB API
 *
 * @param numericId - Polymarket numeric ID (from market.numericId)
 * @returns YES price as number (0-1), or null if fetch fails
 */
async function fetchPolymarketPrice(numericId) {
    try {
        const url = `${CLOB_API}/price?token_id=${numericId}`;
        // Add 5-second timeout to prevent hanging
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) {
            console.warn(`[Polymarket CLOB] Failed to fetch price for ${numericId}: HTTP ${response.status}`);
            return null;
        }
        const data = await response.json();
        const price = parseFloat(data.price);
        if (isNaN(price) || price < 0 || price > 1) {
            console.warn(`[Polymarket CLOB] Invalid price for ${numericId}: ${data.price}`);
            return null;
        }
        return price;
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn(`[Polymarket CLOB] Timeout fetching price for ${numericId}`);
        }
        else {
            console.error(`[Polymarket CLOB] Error fetching price for ${numericId}:`, error);
        }
        return null;
    }
}
/**
 * Parallel batch fetch with controlled concurrency
 *
 * Faster than sequential but respects concurrency limits.
 *
 * @param markets - Markets to update prices for
 * @param concurrency - Max concurrent requests (default: 5)
 * @returns Markets with updated prices
 */
async function parallelFetchPolymarketPrices(markets, concurrency = 5) {
    const polymarketMarkets = markets.filter(m => m.platform === 'polymarket' && m.numericId);
    if (polymarketMarkets.length === 0) {
        return markets;
    }
    // Fetch prices in batches with controlled concurrency
    const prices = new Map();
    for (let i = 0; i < polymarketMarkets.length; i += concurrency) {
        const batch = polymarketMarkets.slice(i, i + concurrency);
        const results = await Promise.allSettled(batch.map(async (m) => {
            const price = await fetchPolymarketPrice(m.numericId);
            return { id: m.id, price };
        }));
        // Collect successful results
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.price !== null) {
                prices.set(result.value.id, result.value.price);
            }
        }
    }
    // Update markets with fetched prices
    const updatedMarkets = markets.map(market => {
        if (market.platform !== 'polymarket' || !prices.has(market.id)) {
            return market;
        }
        const freshPrice = prices.get(market.id);
        return {
            ...market,
            yesPrice: parseFloat(freshPrice.toFixed(2)),
            noPrice: parseFloat((1 - freshPrice).toFixed(2)),
            lastUpdated: new Date().toISOString(),
        };
    });
    console.log(`[Polymarket CLOB] Updated ${prices.size}/${polymarketMarkets.length} Polymarket prices (parallel)`);
    return updatedMarkets;
}

;// ./src/background/service-worker.ts
// Musashi Service Worker
// Fetches Polymarket + Kalshi markets (bypasses CORS) and stores them in chrome.storage.
// Content script reads from storage — no large-payload message passing needed.






// v2 key — invalidates the old Polymarket-only cache so combined data is fetched fresh
const STORAGE_KEY_MARKETS = 'markets_v2';
const STORAGE_KEY_TS = 'marketsTs_v2';
const STORAGE_KEY_ARBITRAGE = 'arbitrage_v1';
const STORAGE_KEY_ARBITRAGE_TS = 'arbitrageTs_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes (reduced from 30)
// Price polling configuration
const PRICE_POLL_INTERVAL_MS = 5 * 60 * 1000; // Poll every 5 minutes (reduced from 60s to save CPU)
const TOP_MARKETS_COUNT = 20; // Track top 20 markets by volume (reduced from 50 to save resources)
console.log('[Musashi SW] Service worker initialized');
// ── Proactive fetch on install / browser startup ──────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    refreshMarkets();
    startPricePolling();
});
chrome.runtime.onStartup.addListener(() => {
    refreshMarkets();
    startPricePolling();
});
// ── Message handler ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Content script asks for markets (cache miss or first load)
    if (message.type === 'FETCH_MARKETS') {
        chrome.storage.local.get([STORAGE_KEY_MARKETS, STORAGE_KEY_TS]).then(async (cached) => {
            const ts = cached[STORAGE_KEY_TS] ?? 0;
            const markets = cached[STORAGE_KEY_MARKETS];
            // Return cached if fresh
            if (Array.isArray(markets) && markets.length > 0 && Date.now() - ts < CACHE_TTL_MS) {
                console.log(`[Musashi SW] Returning ${markets.length} cached markets`);
                sendResponse({ markets });
                return;
            }
            // Fetch fresh
            console.log('[Musashi SW] Fetching fresh markets from Polymarket + Kalshi...');
            const fresh = await refreshMarkets();
            sendResponse({ markets: fresh });
        }).catch((e) => {
            console.error('[Musashi SW] FETCH_MARKETS error:', e);
            sendResponse({ markets: [] });
        });
        return true; // keep channel open for async
    }
    // Badge update from content script
    if (message.type === 'UPDATE_BADGE') {
        const count = message.count || 0;
        if (sender.tab?.id) {
            chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '', tabId: sender.tab.id });
            chrome.action.setBadgeBackgroundColor({ color: '#A8C5DD', tabId: sender.tab.id });
        }
        sendResponse({ success: true });
        return true;
    }
    // Get arbitrage opportunities
    if (message.type === 'GET_ARBITRAGE') {
        chrome.storage.local.get([STORAGE_KEY_ARBITRAGE, STORAGE_KEY_ARBITRAGE_TS, STORAGE_KEY_MARKETS]).then((cached) => {
            const arbitrageTs = cached[STORAGE_KEY_ARBITRAGE_TS] ?? 0;
            const cachedArbitrage = cached[STORAGE_KEY_ARBITRAGE];
            // Return cached arbitrage if fresh (same TTL as markets)
            if (Array.isArray(cachedArbitrage) && Date.now() - arbitrageTs < CACHE_TTL_MS) {
                console.log(`[Musashi SW] Returning ${cachedArbitrage.length} cached arbitrage opportunities`);
                const filtered = filterArbitrage(cachedArbitrage, message.minSpread, message.category);
                sendResponse({ opportunities: filtered });
                return;
            }
            // Compute fresh arbitrage from cached markets
            const markets = cached[STORAGE_KEY_MARKETS];
            if (Array.isArray(markets) && markets.length > 0) {
                const opportunities = detectArbitrage(markets, 0.01); // Lower threshold for storage
                chrome.storage.local.set({
                    [STORAGE_KEY_ARBITRAGE]: opportunities,
                    [STORAGE_KEY_ARBITRAGE_TS]: Date.now(),
                });
                console.log(`[Musashi SW] Computed and cached ${opportunities.length} arbitrage opportunities`);
                const filtered = filterArbitrage(opportunities, message.minSpread, message.category);
                sendResponse({ opportunities: filtered });
            }
            else {
                console.log('[Musashi SW] No markets available for arbitrage detection');
                sendResponse({ opportunities: [] });
            }
        }).catch((e) => {
            console.error('[Musashi SW] GET_ARBITRAGE error:', e);
            sendResponse({ opportunities: [] });
        });
        return true; // keep channel open for async
    }
    // Analyze text with full signal generation (for bot developers / API)
    if (message.type === 'ANALYZE_TEXT_WITH_SIGNALS') {
        chrome.storage.local.get([STORAGE_KEY_MARKETS, STORAGE_KEY_ARBITRAGE]).then(async (cached) => {
            const markets = cached[STORAGE_KEY_MARKETS] ?? [];
            const arbitrage = cached[STORAGE_KEY_ARBITRAGE] ?? [];
            if (!Array.isArray(markets) || markets.length === 0) {
                console.log('[Musashi SW] No markets available for analysis');
                sendResponse({ signal: null, error: 'No markets loaded' });
                return;
            }
            try {
                const signal = await analyzeTextWithArbitrage(message.text, markets, arbitrage, {
                    minConfidence: message.minConfidence ?? 0.3,
                    maxResults: message.maxResults ?? 5,
                });
                console.log(`[Musashi SW] Generated signal: ${signal.signal_type} (${signal.urgency})`);
                sendResponse({ signal });
            }
            catch (error) {
                console.error('[Musashi SW] ANALYZE_TEXT_WITH_SIGNALS error:', error);
                sendResponse({ signal: null, error: String(error) });
            }
        }).catch((e) => {
            console.error('[Musashi SW] ANALYZE_TEXT_WITH_SIGNALS error:', e);
            sendResponse({ signal: null, error: String(e) });
        });
        return true; // keep channel open for async
    }
    // Get market movers (markets with significant price changes)
    if (message.type === 'GET_MOVERS') {
        chrome.storage.local.get([STORAGE_KEY_MARKETS]).then(async (cached) => {
            const markets = cached[STORAGE_KEY_MARKETS] ?? [];
            if (!Array.isArray(markets) || markets.length === 0) {
                console.log('[Musashi SW] No markets available for movers detection');
                sendResponse({ movers: [] });
                return;
            }
            try {
                const movers = await getMovers(markets, {
                    minChange: message.minChange ?? 0.05,
                    timeframe: message.timeframe ?? '1h',
                    limit: message.limit ?? 20,
                    forceRefresh: message.forceRefresh ?? false,
                });
                console.log(`[Musashi SW] Returning ${movers.length} movers`);
                sendResponse({ movers });
            }
            catch (error) {
                console.error('[Musashi SW] GET_MOVERS error:', error);
                sendResponse({ movers: [] });
            }
        }).catch((e) => {
            console.error('[Musashi SW] GET_MOVERS error:', e);
            sendResponse({ movers: [] });
        });
        return true; // keep channel open for async
    }
});
// Clear badge when navigating away from Twitter/X
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = tab.url || '';
        if (!url.includes('twitter.com') && !url.includes('x.com')) {
            chrome.action.setBadgeText({ text: '', tabId });
        }
    }
});
// ── Helper: Filter arbitrage opportunities ───────────────────────────────────
function filterArbitrage(opportunities, minSpread, category) {
    let filtered = opportunities;
    if (minSpread !== undefined) {
        filtered = filtered.filter(op => op.spread >= minSpread);
    }
    if (category) {
        filtered = filtered.filter(op => op.polymarket.category === category || op.kalshi.category === category);
    }
    return filtered;
}
// ── Market refresh ────────────────────────────────────────────────────────────
async function refreshMarkets() {
    try {
        // Fetch both sources in parallel; if one fails the other still contributes
        const [polyResult, kalshiResult] = await Promise.allSettled([
            fetchPolymarkets(1000, 15),
            fetchKalshiMarkets(400, 15),
        ]);
        const polyMarkets = polyResult.status === 'fulfilled' ? polyResult.value : [];
        const kalshiMarkets = kalshiResult.status === 'fulfilled' ? kalshiResult.value : [];
        if (polyResult.status === 'rejected') {
            console.warn('[Musashi SW] Polymarket fetch failed:', polyResult.reason);
        }
        if (kalshiResult.status === 'rejected') {
            console.warn('[Musashi SW] Kalshi fetch failed:', kalshiResult.reason);
        }
        // Merge; dedup by id just in case
        const seen = new Set();
        const markets = [...polyMarkets, ...kalshiMarkets].filter(m => {
            if (seen.has(m.id))
                return false;
            seen.add(m.id);
            return true;
        });
        console.log(`[Musashi SW] Fetched ${polyMarkets.length} Polymarket + ` +
            `${kalshiMarkets.length} Kalshi = ${markets.length} total markets`);
        if (markets.length > 0) {
            // Detect arbitrage opportunities
            const arbitrageOpportunities = detectArbitrage(markets, 0.01); // Low threshold for storage
            console.log(`[Musashi SW] Detected ${arbitrageOpportunities.length} arbitrage opportunities`);
            // Record price snapshots for price tracking
            await recordBulkSnapshots(markets);
            await chrome.storage.local.set({
                [STORAGE_KEY_MARKETS]: markets,
                [STORAGE_KEY_TS]: Date.now(),
                [STORAGE_KEY_ARBITRAGE]: arbitrageOpportunities,
                [STORAGE_KEY_ARBITRAGE_TS]: Date.now(),
            });
            console.log(`[Musashi SW] Stored ${markets.length} markets + ${arbitrageOpportunities.length} arbitrage opportunities + price snapshots`);
        }
        // Clear any previous ERR badge
        chrome.action.setBadgeText({ text: '' });
        return markets;
    }
    catch (e) {
        console.error('[Musashi SW] refreshMarkets failed:', e);
        // Show red ERR badge on ALL tabs so the user can see without opening any console
        chrome.action.setBadgeText({ text: 'ERR' });
        chrome.action.setBadgeBackgroundColor({ color: '#FF4444' });
        return [];
    }
}
// ── Price polling for movers detection ────────────────────────────────────────
let pricePollingInterval = null;
/**
 * Start polling prices for top markets by volume
 */
function startPricePolling() {
    // Clear any existing interval
    if (pricePollingInterval) {
        clearInterval(pricePollingInterval);
    }
    console.log('[Musashi SW] Starting price polling (5min interval)');
    // Poll immediately
    pollTopMarketPrices();
    // Then poll every 5 minutes
    pricePollingInterval = setInterval(() => {
        pollTopMarketPrices();
    }, PRICE_POLL_INTERVAL_MS);
    // Cleanup old history every 6 hours (reduced frequency)
    setInterval(() => {
        cleanupOldHistory();
    }, 6 * 60 * 60 * 1000);
}
/**
 * Poll prices for the top markets by volume
 * Fetches fresh prices from Polymarket CLOB API for lightweight updates
 */
async function pollTopMarketPrices() {
    try {
        // Get cached markets
        const cached = await chrome.storage.local.get([STORAGE_KEY_MARKETS]);
        const markets = cached[STORAGE_KEY_MARKETS] ?? [];
        if (markets.length === 0) {
            console.log('[Musashi SW] No markets cached, skipping price poll');
            return;
        }
        // Get top markets by volume (create copy to avoid mutating original array)
        const topMarkets = [...markets]
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, TOP_MARKETS_COUNT);
        console.log(`[Musashi SW] Polling prices for top ${topMarkets.length} markets`);
        // Fetch fresh prices from Polymarket CLOB API
        // Only Polymarket markets with numericId will be updated
        // Kalshi markets keep their cached prices until next full refresh
        const freshMarkets = await parallelFetchPolymarketPrices(topMarkets, 5);
        // Update cached markets with fresh prices
        const marketMap = new Map(markets.map(m => [m.id, m]));
        for (const fresh of freshMarkets) {
            marketMap.set(fresh.id, fresh);
        }
        const updatedMarkets = Array.from(marketMap.values());
        // Save updated markets back to cache
        await chrome.storage.local.set({
            [STORAGE_KEY_MARKETS]: updatedMarkets,
        });
        // Record snapshots with fresh prices
        await recordBulkSnapshots(freshMarkets);
        const polyCount = freshMarkets.filter(m => m.platform === 'polymarket').length;
        console.log(`[Musashi SW] Recorded ${freshMarkets.length} price snapshots (${polyCount} Polymarket, ${freshMarkets.length - polyCount} Kalshi)`);
        // Detect movers in the background (this will cache them)
        const movers = await getMovers(updatedMarkets, {
            minChange: 0.05,
            timeframe: '1h',
            limit: 20,
            forceRefresh: true,
        });
        if (movers.length > 0) {
            console.log(`[Musashi SW] Detected ${movers.length} movers - ` +
                `Top: ${movers[0].market.title.substring(0, 50)} ` +
                `(${movers[0].direction === 'up' ? '+' : ''}${(movers[0].priceChange1h * 100).toFixed(1)}%)`);
        }
    }
    catch (error) {
        console.error('[Musashi SW] Price polling error:', error);
    }
}

/******/ })()
;