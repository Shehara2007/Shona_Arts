import type { Types } from 'mongoose';
import { Painting } from '../models/Painting.js';
import { Auction } from '../models/Auction.js';
import { AIChat } from '../models/AIChat.js';

/**
 * AI Service for Shona Arts Platform
 * Handles: Artwork Valuation, Bid Suggestions, Chatbot Responses, Artwork Analysis
 */

// ============================================
// 1. AI ARTWORK VALUE ESTIMATOR
// ============================================

interface ArtworkDetails {
  title: string;
  category: string;
  style: string;
  artist: string;
  price: number;
  popularity?: number;
  size?: string;
  medium?: string;
  condition?: string;
  year?: number;
}

interface ValuationResult {
  estimatedMinValue: number;
  estimatedMaxValue: number;
  confidence: number; // 0-100
  marketTrend: 'Rising' | 'Stable' | 'Declining';
  factors: Array<{
    factor: string;
    impact: 'Positive' | 'Neutral' | 'Negative';
    description: string;
  }>;
  explanation: string;
}

export async function estimateArtworkValue(
  artworkDetails: ArtworkDetails,
): Promise<ValuationResult> {
  const { category, style, artist, price, popularity = 0, size, medium, condition, year } = artworkDetails;

  // Base calculation using current price
  let baseValue = price;
  let multiplierMin = 0.8;
  let multiplierMax = 1.5;
  const factors: ValuationResult['factors'] = [];

  // Factor 1: Category demand
  const highDemandCategories = ['Abstract', 'Portrait', 'Landscape'];
  if (highDemandCategories.includes(category)) {
    multiplierMax += 0.3;
    factors.push({
      factor: 'Category Demand',
      impact: 'Positive',
      description: `${category} artworks are currently in high demand`,
    });
  }

  // Factor 2: Artist reputation (simulated)
  const renownedArtists = ['Vincent', 'Pablo', 'Leonardo', 'Monet'];
  if (renownedArtists.some((name) => artist.includes(name))) {
    multiplierMax += 0.5;
    multiplierMin += 0.2;
    factors.push({
      factor: 'Artist Reputation',
      impact: 'Positive',
      description: 'Artist has established market presence',
    });
  }

  // Factor 3: Popularity score
  if (popularity > 70) {
    multiplierMax += 0.2;
    factors.push({
      factor: 'Popularity',
      impact: 'Positive',
      description: 'High engagement and interest from collectors',
    });
  } else if (popularity < 30) {
    multiplierMin -= 0.1;
    factors.push({
      factor: 'Popularity',
      impact: 'Neutral',
      description: 'Moderate market interest',
    });
  }

  // Factor 4: Style trends
  const trendingStyles = ['Modern', 'Contemporary', 'Minimalist'];
  if (trendingStyles.includes(style)) {
    multiplierMax += 0.15;
    factors.push({
      factor: 'Style Trend',
      impact: 'Positive',
      description: `${style} style is currently trending`,
    });
  }

  // Factor 5: Size (if provided)
  if (size) {
    const sizeMatch = size.match(/(\d+)/g);
    if (sizeMatch && sizeMatch.length >= 2) {
      const area = parseInt(sizeMatch[0]) * parseInt(sizeMatch[1]);
      if (area > 5000) {
        // Large artwork
        multiplierMax += 0.25;
        factors.push({
          factor: 'Size',
          impact: 'Positive',
          description: 'Large format commands premium pricing',
        });
      }
    }
  }

  // Factor 6: Medium
  const premiumMediums = ['Oil', 'Acrylic on Canvas', 'Mixed Media'];
  if (medium && premiumMediums.some((m) => medium.includes(m))) {
    multiplierMax += 0.1;
    factors.push({
      factor: 'Medium',
      impact: 'Positive',
      description: 'Premium materials increase value',
    });
  }

  // Factor 7: Condition
  if (condition === 'Excellent' || condition === 'Mint') {
    multiplierMax += 0.15;
    factors.push({
      factor: 'Condition',
      impact: 'Positive',
      description: 'Excellent condition preserves value',
    });
  } else if (condition === 'Fair' || condition === 'Poor') {
    multiplierMin -= 0.2;
    multiplierMax -= 0.1;
    factors.push({
      factor: 'Condition',
      impact: 'Negative',
      description: 'Condition issues may affect value',
    });
  }

  // Factor 8: Age/Year
  const currentYear = new Date().getFullYear();
  if (year && currentYear - year > 50) {
    multiplierMax += 0.3;
    factors.push({
      factor: 'Age',
      impact: 'Positive',
      description: 'Historical significance adds value',
    });
  }

  // Calculate final estimates
  const estimatedMinValue = Math.round(baseValue * multiplierMin);
  const estimatedMaxValue = Math.round(baseValue * multiplierMax);

  // Determine market trend
  let marketTrend: ValuationResult['marketTrend'] = 'Stable';
  if (popularity > 60 && trendingStyles.includes(style)) {
    marketTrend = 'Rising';
  } else if (popularity < 30) {
    marketTrend = 'Declining';
  }

  // Calculate confidence based on available data
  const dataPoints = [category, style, artist, size, medium, condition, year].filter(Boolean).length;
  const confidence = Math.min(95, 50 + dataPoints * 6);

  const explanation = `Based on analysis of ${factors.length} key factors including ${category} category demand, ${style} style trends, and artist reputation, this artwork is estimated to be valued between $${estimatedMinValue.toLocaleString()} and $${estimatedMaxValue.toLocaleString()}. The market trend is ${marketTrend.toLowerCase()} with ${confidence}% confidence.`;

  return {
    estimatedMinValue,
    estimatedMaxValue,
    confidence,
    marketTrend,
    factors,
    explanation,
  };
}

// ============================================
// 2. AI BID SUGGESTION ENGINE
// ============================================

interface BidSuggestionInput {
  auctionId: Types.ObjectId | string;
  currentHighestBid: number;
  startingPrice: number;
  timeLeftMinutes: number;
  bidCount: number;
  artworkPrice: number;
  artworkCategory: string;
  artworkPopularity: number;
}

interface BidSuggestionResult {
  suggestedBid: number;
  minBid: number;
  maxBid: number;
  bidRating: 'Low Bid' | 'Fair Bid' | 'Strong Bid' | 'Winning Chance High';
  confidence: number;
  reasoning: string;
  strategy: string;
}

export async function suggestBidAmount(input: BidSuggestionInput): Promise<BidSuggestionResult> {
  const {
    currentHighestBid,
    startingPrice,
    timeLeftMinutes,
    bidCount,
    artworkPrice,
    artworkCategory,
    artworkPopularity,
  } = input;

  // Calculate bid increment (typically 5-10% of current bid)
  const baseIncrement = Math.max(50, Math.round(currentHighestBid * 0.05));
  const minBid = currentHighestBid + baseIncrement;

  // Analyze auction dynamics
  const bidVelocity = bidCount / Math.max(1, 1440 - timeLeftMinutes); // bids per minute
  const competitionLevel = bidVelocity > 0.1 ? 'High' : bidVelocity > 0.05 ? 'Medium' : 'Low';

  // Time pressure factor
  let urgencyMultiplier = 1.0;
  if (timeLeftMinutes < 60) {
    urgencyMultiplier = 1.3; // Last hour - bid more aggressively
  } else if (timeLeftMinutes < 360) {
    urgencyMultiplier = 1.15; // Last 6 hours
  }

  // Popularity factor
  const popularityMultiplier = 1 + artworkPopularity / 200;

  // Calculate suggested bid
  let suggestedBid = Math.round(minBid * urgencyMultiplier * popularityMultiplier);

  // Ensure suggested bid doesn't exceed artwork's estimated value
  const maxReasonableBid = artworkPrice * 1.3;
  suggestedBid = Math.min(suggestedBid, maxReasonableBid);

  // Calculate bid rating
  const bidRatio = suggestedBid / artworkPrice;
  let bidRating: BidSuggestionResult['bidRating'];
  let confidence: number;

  if (bidRatio < 0.7) {
    bidRating = 'Low Bid';
    confidence = 45;
  } else if (bidRatio < 0.9) {
    bidRating = 'Fair Bid';
    confidence = 65;
  } else if (bidRatio < 1.1) {
    bidRating = 'Strong Bid';
    confidence = 80;
  } else {
    bidRating = 'Winning Chance High';
    confidence = 90;
  }

  // Adjust confidence based on competition
  if (competitionLevel === 'High') {
    confidence -= 15;
  } else if (competitionLevel === 'Low') {
    confidence += 10;
  }

  confidence = Math.max(30, Math.min(95, confidence));

  // Generate reasoning
  const reasoning = `With ${bidCount} bids and ${timeLeftMinutes} minutes remaining, competition is ${competitionLevel.toLowerCase()}. Your suggested bid of $${suggestedBid.toLocaleString()} is ${bidRatio > 1 ? 'above' : 'at'} the artwork's market value, giving you a ${bidRating.toLowerCase()} position.`;

  // Generate strategy
  let strategy = '';
  if (timeLeftMinutes > 360) {
    strategy = 'Early stage: Consider waiting or placing a moderate bid to show interest.';
  } else if (timeLeftMinutes > 60) {
    strategy = 'Mid-auction: Time to make your move with a competitive bid.';
  } else {
    strategy = 'Final hour: Bid decisively to secure the artwork!';
  }

  return {
    suggestedBid,
    minBid,
    maxBid: maxReasonableBid,
    bidRating,
    confidence,
    reasoning,
    strategy,
  };
}

// ============================================
// 3. AI CHATBOT ASSISTANT
// ============================================

interface ChatbotInput {
  question: string;
  userId: Types.ObjectId | string;
  artworkId?: Types.ObjectId | string;
  context?: 'gallery' | 'auction' | 'artwork-detail' | 'custom-order' | 'general';
}

interface ChatbotResponse {
  answer: string;
  suggestions?: string[];
  relatedArtworks?: any[];
}

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotResponse> {
  const { question, userId, artworkId, context } = input;
  const lowerQuestion = question.toLowerCase();

  let answer = '';
  const suggestions: string[] = [];

  // Fetch artwork details if artworkId is provided
  let artwork: any = null;
  if (artworkId) {
    artwork = await Painting.findById(artworkId).populate('reviews');
  }

  // ===== ARTWORK HISTORY & DETAILS =====
  if (
    lowerQuestion.includes('history') ||
    lowerQuestion.includes('about this') ||
    lowerQuestion.includes('tell me about')
  ) {
    if (artwork) {
      answer = `"${artwork.title}" is a ${artwork.style} ${artwork.category.toLowerCase()} created by ${artwork.artist}. `;
      answer += `This piece showcases ${artwork.description} `;
      answer += `The artwork has gained significant attention with a popularity score of ${artwork.popularity}/100. `;
      answer += `It's currently priced at $${artwork.price.toLocaleString()}.`;

      suggestions.push('What is the estimated value?', 'Is this price fair?', 'Show similar artworks');
    } else {
      answer =
        "I'd love to tell you about this artwork! Could you please specify which painting you're interested in, or navigate to its detail page?";
    }
  }

  // ===== PRICE FAIRNESS =====
  else if (
    lowerQuestion.includes('price fair') ||
    lowerQuestion.includes('worth it') ||
    lowerQuestion.includes('good deal')
  ) {
    if (artwork) {
      const valuation = await estimateArtworkValue({
        title: artwork.title,
        category: artwork.category,
        style: artwork.style,
        artist: artwork.artist,
        price: artwork.price,
        popularity: artwork.popularity,
      });

      const avgEstimate = (valuation.estimatedMinValue + valuation.estimatedMaxValue) / 2;
      const fairness = artwork.price <= avgEstimate ? 'fair' : 'slightly above market average';

      answer = `Based on AI analysis, "${artwork.title}" is priced ${fairness}. `;
      answer += `The estimated market value ranges from $${valuation.estimatedMinValue.toLocaleString()} to $${valuation.estimatedMaxValue.toLocaleString()}. `;
      answer += `Current price: $${artwork.price.toLocaleString()}. `;
      answer += `Market trend: ${valuation.marketTrend}. `;
      answer += `This is a ${artwork.price <= avgEstimate ? 'good opportunity' : 'premium piece'}.`;

      suggestions.push('What factors affect the value?', 'Show me similar artworks', 'Add to cart');
    } else {
      answer =
        'To evaluate price fairness, I need to know which artwork you\'re considering. Please visit the artwork\'s detail page or tell me the title.';
    }
  }

  // ===== BID SUGGESTIONS =====
  else if (
    lowerQuestion.includes('bid') ||
    lowerQuestion.includes('auction') ||
    lowerQuestion.includes('how much should i')
  ) {
    if (artworkId) {
      const auction = await Auction.findOne({ artworkId, status: 'live' });

      if (auction) {
        const timeLeft = Math.max(0, (auction.endTime.getTime() - Date.now()) / 60000);

        const bidSuggestion = await suggestBidAmount({
          auctionId: auction._id,
          currentHighestBid: auction.highestBid || auction.startingPrice,
          startingPrice: auction.startingPrice,
          timeLeftMinutes: timeLeft,
          bidCount: auction.bidHistory.length,
          artworkPrice: artwork?.price || auction.startingPrice,
          artworkCategory: artwork?.category || 'Unknown',
          artworkPopularity: artwork?.popularity || 50,
        });

        answer = `For this auction, I suggest bidding $${bidSuggestion.suggestedBid.toLocaleString()}. `;
        answer += `${bidSuggestion.reasoning} `;
        answer += `Strategy: ${bidSuggestion.strategy}`;

        suggestions.push('Place this bid', 'View bid history', 'Set bid alert');
      } else {
        answer =
          "This artwork isn't currently in an active auction. Would you like to purchase it directly or check other live auctions?";
        suggestions.push('Buy now', 'View live auctions', 'Add to wishlist');
      }
    } else {
      answer =
        'I can help you with bidding strategy! Please navigate to a specific auction, and I\'ll analyze the best bid amount for you.';
      suggestions.push('View live auctions', 'How does bidding work?');
    }
  }

  // ===== ROOM MATCHING =====
  else if (
    lowerQuestion.includes('room') ||
    lowerQuestion.includes('wall') ||
    lowerQuestion.includes('match') ||
    lowerQuestion.includes('fit')
  ) {
    if (artwork) {
      answer = `"${artwork.title}" would look stunning in your space! `;
      answer += `This ${artwork.category.toLowerCase()} with ${artwork.style.toLowerCase()} style works well in `;

      if (artwork.category === 'Abstract') {
        answer += 'modern living rooms, offices, or creative spaces. ';
      } else if (artwork.category === 'Landscape') {
        answer += 'living rooms, bedrooms, or hallways. ';
      } else if (artwork.category === 'Portrait') {
        answer += 'studies, libraries, or formal dining rooms. ';
      } else {
        answer += 'various interior settings. ';
      }

      answer +=
        'Use our AI Wall Preview feature to upload a photo of your room and see exactly how it will look!';

      suggestions.push('Try AI Wall Preview', 'View room examples', 'Get design tips');
    } else {
      answer =
        'I can help you visualize artworks in your room! Use our AI Wall Preview feature to upload a room photo and see paintings in place.';
      suggestions.push('Try AI Wall Preview', 'Browse gallery');
    }
  }

  // ===== STYLE & TECHNIQUE =====
  else if (
    lowerQuestion.includes('style') ||
    lowerQuestion.includes('technique') ||
    lowerQuestion.includes('how was this made')
  ) {
    if (artwork) {
      answer = `"${artwork.title}" is created in the ${artwork.style} style. `;

      const styleDescriptions: Record<string, string> = {
        Abstract:
          'Abstract art uses shapes, colors, and forms to achieve its effect rather than depicting visual reality.',
        Modern:
          'Modern art emphasizes experimentation and breaks from traditional forms, often featuring bold colors and simplified forms.',
        Contemporary:
          'Contemporary art reflects current ideas and concerns, often pushing boundaries and challenging conventions.',
        Impressionist:
          'Impressionism captures the immediate impression of a scene, using visible brush strokes and emphasis on light.',
        Realism: 'Realism depicts subjects as they appear in everyday life, without embellishment or interpretation.',
      };

      answer += styleDescriptions[artwork.style] || 'This style is characterized by unique artistic expression. ';
      answer += `The artist ${artwork.artist} brings their distinctive vision to this ${artwork.category.toLowerCase()}.`;

      suggestions.push('View more by this artist', 'Explore this style', 'Learn about techniques');
    } else {
      answer =
        'I can explain different art styles and techniques! Which style interests you? We have Abstract, Modern, Contemporary, Impressionist, and more.';
    }
  }

  // ===== CUSTOM ORDERS =====
  else if (
    lowerQuestion.includes('custom') ||
    lowerQuestion.includes('commission') ||
    lowerQuestion.includes('personalized')
  ) {
    answer =
      'You can commission a custom artwork tailored to your preferences! Our custom order process includes:\n\n';
    answer += '1. Choose your preferred style, size, and medium\n';
    answer += '2. Upload reference images or describe your vision\n';
    answer += '3. Set your budget and timeline\n';
    answer += '4. Our artists will create a unique piece just for you\n\n';
    answer += 'Custom orders typically take 2-6 weeks depending on complexity.';

    suggestions.push('Start custom order', 'View custom examples', 'Pricing guide');
  }

  // ===== SHIPPING & DELIVERY =====
  else if (
    lowerQuestion.includes('shipping') ||
    lowerQuestion.includes('delivery') ||
    lowerQuestion.includes('how long')
  ) {
    answer = 'We offer secure worldwide shipping for all artworks:\n\n';
    answer += '• Standard Shipping: 5-7 business days\n';
    answer += '• Express Shipping: 2-3 business days\n';
    answer += '• International: 10-14 business days\n\n';
    answer +=
      'All artworks are professionally packaged with insurance. Free shipping on orders over $500!';

    suggestions.push('View shipping rates', 'Track my order', 'Shipping policy');
  }

  // ===== PAYMENT & RETURNS =====
  else if (
    lowerQuestion.includes('payment') ||
    lowerQuestion.includes('return') ||
    lowerQuestion.includes('refund')
  ) {
    answer = 'Payment & Returns:\n\n';
    answer += '💳 We accept all major credit cards, PayPal, and PayHere\n';
    answer += '🔒 All transactions are secure and encrypted\n';
    answer += '↩️ 30-day return policy for undamaged artworks\n';
    answer += '💯 100% authenticity guarantee\n\n';
    answer += 'Custom orders are non-refundable but we ensure your satisfaction throughout the process.';

    suggestions.push('Payment methods', 'Return policy', 'Contact support');
  }

  // ===== GENERAL HELP =====
  else if (lowerQuestion.includes('help') || lowerQuestion.includes('how do i')) {
    answer = "I'm here to help! I can assist you with:\n\n";
    answer += '🎨 Finding the perfect artwork\n';
    answer += '💰 Understanding pricing and value\n';
    answer += '🔨 Bidding strategies for auctions\n';
    answer += '🏠 Visualizing art in your space\n';
    answer += '✨ Custom artwork commissions\n';
    answer += '📦 Shipping and delivery\n\n';
    answer += 'What would you like to know more about?';

    suggestions.push(
      'Browse gallery',
      'View live auctions',
      'Start custom order',
      'Try AI Wall Preview',
    );
  }

  // ===== DEFAULT RESPONSE =====
  else {
    answer =
      "I'm Shona AI, your art assistant! I can help you discover artworks, understand pricing, suggest bids, and visualize pieces in your space. What would you like to know?";

    suggestions.push(
      'Tell me about this artwork',
      'Is this price fair?',
      'How much should I bid?',
      'Will this match my room?',
    );
  }

  // Save chat to database
  if (userId) {
    await AIChat.create({
      userId,
      artworkId: artworkId || undefined,
      question,
      answer,
      context: context || 'general',
    });
  }

  return {
    answer,
    suggestions,
  };
}

// ============================================
// 4. ARTWORK RECOMMENDATION ENGINE
// ============================================

export async function getRecommendedArtworks(
  userId: Types.ObjectId | string,
  limit: number = 6,
): Promise<any[]> {
  // Get user's wishlist and order history to understand preferences
  const userChats = await AIChat.find({ userId }).sort({ createdAt: -1 }).limit(10);

  // Extract categories and styles from chat history
  const preferredCategories = new Set<string>();
  const preferredStyles = new Set<string>();

  for (const chat of userChats) {
    if (chat.artworkId) {
      const artwork = await Painting.findById(chat.artworkId);
      if (artwork) {
        preferredCategories.add(artwork.category);
        preferredStyles.add(artwork.style);
      }
    }
  }

  // Build recommendation query
  const query: any = {};

  if (preferredCategories.size > 0) {
    query.category = { $in: Array.from(preferredCategories) };
  }

  if (preferredStyles.size > 0) {
    query.style = { $in: Array.from(preferredStyles) };
  }

  // Get recommended artworks
  let recommendations = await Painting.find(query)
    .sort({ popularity: -1, createdAt: -1 })
    .limit(limit);

  // If not enough recommendations, add popular artworks
  if (recommendations.length < limit) {
    const additional = await Painting.find({ _id: { $nin: recommendations.map((r) => r._id) } })
      .sort({ popularity: -1 })
      .limit(limit - recommendations.length);

    recommendations = [...recommendations, ...additional];
  }

  return recommendations;
}

// ============================================
// 5. EXPORT ALL SERVICES
// ============================================

export const AIService = {
  estimateArtworkValue,
  suggestBidAmount,
  getChatbotResponse,
  getRecommendedArtworks,
};
