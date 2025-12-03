interface FuzzyMatch {
  text: string;
  score: number;
  distance: number;
}

interface SpellCheckResult {
  original: string;
  corrected: string;
  confidence: number;
  suggestions: string[];
}

class FuzzySearch {
  private dictionary: Set<string> = new Set();
  private commonTypos: Map<string, string> = new Map();

  constructor() {
    this.initializeDictionary();
    this.initializeCommonTypos();
  }

  private initializeDictionary() {
    // Arabic product-related terms
    const arabicTerms = [
      'هاتف', 'ذكي', 'حاسوب', 'محمول', 'ساعة', 'أحذية', 'ملابس', 'رياضية',
      'ألعاب', 'كتب', 'أثاث', 'عطور', 'تجميل', 'إلكترونيات', 'أجهزة',
      'ملابس', 'نسائية', 'رجالية', 'أطفال', 'منزل', 'مطبخ', 'غرفة', 'نوم',
      'صالة', 'حمام', 'مكتب', 'دراسة', 'لعبة', 'ترفيه', 'رياضة', 'صحة',
      'جمال', 'عناية', 'بشرة', 'شعر', 'أظافر', 'ماكياج', 'عطور', 'ساعات',
      'مجوهرات', 'حقائب', 'شنط', 'أحزمة', 'نظارات', 'قبعات', 'قفازات',
      'جوارب', 'ملابس', 'داخلية', 'سباحة', 'جري', 'كرة', 'قدم', 'سلة',
      'تنس', 'اسكواش', 'يوغا', 'تاي', 'تشي', 'زومبا', 'رقص', 'موسيقى',
      'أفلام', 'مسلسلات', 'كتب', 'روايات', 'قصص', 'شعر', 'تاريخ', 'علوم',
      'طبخ', 'خبز', 'حلويات', 'مشروبات', 'قهوة', 'شاي', 'عصير', 'ماء',
      'غازية', 'طبيعية', 'عضوية', 'بيولوجية', 'صديقة', 'البيئة', 'أخضر',
      'أزرق', 'أحمر', 'أصفر', 'وردي', 'رمادي', 'أسود', 'أبيض', 'بني',
      'برتقالي', 'أرجواني', 'ذهبي', 'فضي', 'نحاسي', 'خشبي', 'معدني',
      'بلاستيكي', 'زجاجي', 'قطني', 'صوفي', 'حريري', 'جلدي', 'مطاطي',
      'نايلون', 'بوليستر', 'صغير', 'متوسط', 'كبير', 'عملاق', 'مصغر'
    ];

    // English product-related terms
    const englishTerms = [
      'phone', 'smartphone', 'computer', 'laptop', 'watch', 'shoes', 'clothes',
      'sports', 'games', 'books', 'furniture', 'perfume', 'cosmetics', 'electronics',
      'devices', 'women', 'men', 'kids', 'home', 'kitchen', 'bedroom', 'living',
      'bathroom', 'office', 'study', 'toy', 'entertainment', 'sport', 'health',
      'beauty', 'care', 'skin', 'hair', 'nails', 'makeup', 'watches', 'jewelry',
      'bags', 'belts', 'glasses', 'hats', 'gloves', 'socks', 'underwear', 'swim',
      'run', 'football', 'basketball', 'tennis', 'squash', 'yoga', 'tai', 'chi',
      'zumba', 'dance', 'music', 'movies', 'series', 'novels', 'stories', 'poetry',
      'history', 'science', 'cooking', 'baking', 'desserts', 'drinks', 'coffee',
      'tea', 'juice', 'water', 'soda', 'natural', 'organic', 'biological', 'eco',
      'green', 'blue', 'red', 'yellow', 'pink', 'gray', 'black', 'white', 'brown',
      'orange', 'purple', 'gold', 'silver', 'copper', 'wooden', 'metal', 'plastic',
      'glass', 'cotton', 'wool', 'silk', 'leather', 'rubber', 'nylon', 'polyester',
      'small', 'medium', 'large', 'extra', 'mini'
    ];

    // Add all terms to dictionary
    [...arabicTerms, ...englishTerms].forEach(term => {
      this.dictionary.add(term.toLowerCase());
    });
  }

  private initializeCommonTypos() {
    // Common Arabic typos and corrections
    const arabicTypos = {
      'هاتف': ['هاتاف', 'هاتيف', 'هاثف', 'هاتف'],
      'ذكي': ['ذكى', 'ذكاي', 'ذكعي'],
      'حاسوب': ['حاسب', 'حاسيب', 'حاسبب'],
      'محمول': ['محمول', 'محمول', 'محمول'],
      'ساعة': ['ساعه', 'ساعة', 'ساعه'],
      'أحذية': ['احذية', 'أحذيه', 'احذيه'],
      'ملابس': ['ملابس', 'ملابس', 'ملابس'],
      'رياضية': ['رياضيه', 'رياضية', 'رياضيه'],
      'ألعاب': ['العاب', 'ألعاب', 'العاب'],
      'كتب': ['كتب', 'كتب', 'كتب'],
      'أثاث': ['اثاث', 'أثاث', 'اثاث'],
      'عطور': ['عطور', 'عطور', 'عطور'],
      'تجميل': ['تجميل', 'تجميل', 'تجميل'],
      'إلكترونيات': ['الكترونيات', 'إلكترونيات', 'الكترونيات'],
      'أجهزة': ['اجهزة', 'أجهزة', 'اجهزة']
    };

    // Add typos to map
    Object.entries(arabicTypos).forEach(([correct, typos]) => {
      typos.forEach(typo => {
        this.commonTypos.set(typo, correct);
      });
    });
  }

  // Calculate Levenshtein distance
  private levenshteinDistance(str1: string, str2: string): number {
    const rows = str2.length + 1;
    const cols = str1.length + 1;
    const matrix: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

    for (let i = 0; i < rows; i++) {
      matrix[i]![0] = i;
    }

    for (let j = 0; j < cols; j++) {
      matrix[0]![j] = j;
    }

    for (let i = 1; i < rows; i++) {
      const currentRow = matrix[i];
      const prevRow = matrix[i - 1];
      
      if (!currentRow || !prevRow) continue;
      
      for (let j = 1; j < cols; j++) {
        const prev = prevRow[j - 1];
        const prev_col = currentRow[j - 1];
        const prev_row = prevRow[j];
        
        if (prev === undefined || prev_col === undefined || prev_row === undefined) {
          continue;
        }
        
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          currentRow[j] = prev;
        } else {
          currentRow[j] = Math.min(prev + 1, prev_col + 1, prev_row + 1);
        }
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  // Calculate similarity score (0-1, where 1 is perfect match)
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;

    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;

    const distance = this.levenshteinDistance(str1, str2);
    return 1 - (distance / maxLength);
  }

  // Find fuzzy matches for a word
  findMatches(query: string, maxResults: number = 5): FuzzyMatch[] {
    const queryLower = query.toLowerCase();
    const matches: FuzzyMatch[] = [];

    // First check for exact matches
    if (this.dictionary.has(queryLower)) {
      return [{
        text: query,
        score: 1,
        distance: 0
      }];
    }

    // Check common typos
    if (this.commonTypos.has(queryLower)) {
      const correction = this.commonTypos.get(queryLower)!;
      return [{
        text: correction,
        score: 0.9,
        distance: this.levenshteinDistance(queryLower, correction)
      }];
    }

    // Find fuzzy matches
    for (const word of this.dictionary) {
      const similarity = this.calculateSimilarity(queryLower, word);
      const distance = this.levenshteinDistance(queryLower, word);

      // Only include matches with reasonable similarity
      if (similarity >= 0.6 || distance <= 2) {
        matches.push({
          text: word,
          score: similarity,
          distance
        });
      }
    }

    // Sort by score (descending) then by distance (ascending)
    matches.sort((a, b) => {
      if (Math.abs(a.score - b.score) > 0.1) {
        return b.score - a.score;
      }
      return a.distance - b.distance;
    });

    return matches.slice(0, maxResults);
  }

  // Spell check a query and provide corrections
  spellCheck(query: string): SpellCheckResult {
    const words = query.split(/\s+/);
    const correctedWords: string[] = [];
    let totalConfidence = 0;
    const suggestions: string[] = [];

    for (const word of words) {
      if (word.length < 3) {
        correctedWords.push(word);
        totalConfidence += 1;
        continue;
      }

      const matches = this.findMatches(word, 3);
      const bestMatch = matches[0];

      if (bestMatch && bestMatch.score >= 0.8) {
        correctedWords.push(bestMatch.text);
        totalConfidence += bestMatch.score;

        if (matches.length > 1) {
          suggestions.push(...matches.slice(1).map(m => m.text));
        }
      } else {
        correctedWords.push(word);
        totalConfidence += 0.5;
      }
    }

    const corrected = correctedWords.join(' ');
    const confidence = totalConfidence / words.length;

    // Remove duplicates and limit suggestions
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 3);

    return {
      original: query,
      corrected: corrected !== query ? corrected : query,
      confidence,
      suggestions: uniqueSuggestions
    };
  }

  // Enhanced search with spell correction
  searchWithCorrection(query: string, searchFunction: (correctedQuery: string) => any[]) {
    const spellCheckResult = this.spellCheck(query);

    // Always try the original query first
    const originalResults = searchFunction(query);

    // If original query has results or high confidence, return it
    if (originalResults.length > 0 || spellCheckResult.confidence >= 0.8) {
      return {
        results: originalResults,
        spellCheck: spellCheckResult,
        usedCorrection: false
      };
    }

    // Try corrected query
    const correctedResults = searchFunction(spellCheckResult.corrected);

    return {
      results: correctedResults.length > 0 ? correctedResults : originalResults,
      spellCheck: spellCheckResult,
      usedCorrection: correctedResults.length > 0
    };
  }

  // Get autocomplete suggestions
  getAutocompleteSuggestions(partial: string, maxResults: number = 5): string[] {
    if (partial.length < 2) return [];

    const partialLower = partial.toLowerCase();
    const suggestions: FuzzyMatch[] = [];

    for (const word of this.dictionary) {
      if (word.startsWith(partialLower)) {
        suggestions.push({
          text: word,
          score: 1,
          distance: 0
        });
      } else if (word.includes(partialLower)) {
        const similarity = this.calculateSimilarity(partialLower, word);
        if (similarity >= 0.7) {
          suggestions.push({
            text: word,
            score: similarity,
            distance: this.levenshteinDistance(partialLower, word)
          });
        }
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(match => match.text);
  }
}

// Export singleton instance
const fuzzySearch = new FuzzySearch();
export default fuzzySearch;
export { FuzzySearch };
