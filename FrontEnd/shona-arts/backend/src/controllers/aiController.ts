import type { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';
import { Painting } from '../models/Painting.js';
import { Auction } from '../models/Auction.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * AI Controller - Handles all AI-powered features
 */

// ============================================
// 1. ARTWORK VALUE ESTIMATION
// ============================================

/**
 * @route   POST /api/ai/estimate-value
 * @desc    Estimate artwork value using AI
 * @access  Public
 */
export const estimateValue = asyncHandler(async (req: Request, res: Response) => {
  const { artworkId, artworkDetails } = req.body;

  let details = artworkDetails;

  // If artworkId is provided, fetch from database
  if (artworkId) {
    const artwork = await Painting.findById(artworkId);
    if (!artwork) {
      res.status(404).json({ message: 'Artwork not found' });
      return;
    }

    details = {
      title: artwork.title,
      category: artwork.category,
      style: artwork.style,
      artist: artwork.artist,
      price: artwork.price,
      popularity: artwork.popularity,
    };
  }

  if (!details) {
    res.status(400).json({ message: 'Artwork details are required' });
    return;
  }

  const valuation = await AIService.estimateArtworkValue(details);

  res.status(200).json({
    success: true,
    data: valuation,
  });
});

// ============================================
// 2. BID SUGGESTION
// ============================================

/**
 * @route   POST /api/ai/suggest-bid
 * @desc    Get AI-powered bid suggestion for auction
 * @access  Private
 */
export const suggestBid = asyncHandler(async (req: Request, res: Response) => {
  const { auctionId } = req.body;

  if (!auctionId) {
    res.status(400).json({ message: 'Auction ID is required' });
    return;
  }

  // Fetch auction details
  const auction = await Auction.findById(auctionId).populate('artworkId');
  if (!auction) {
    res.status(404).json({ message: 'Auction not found' });
    return;
  }

  if (auction.status !== 'live') {
    res.status(400).json({ message: 'Auction is not active' });
    return;
  }

  const artwork = auction.artworkId as any;
  const timeLeftMinutes = Math.max(0, (auction.endTime.getTime() - Date.now()) / 60000);

  const suggestion = await AIService.suggestBidAmount({
    auctionId: auction._id,
    currentHighestBid: auction.highestBid || auction.startingPrice,
    startingPrice: auction.startingPrice,
    timeLeftMinutes,
    bidCount: auction.bidHistory.length,
    artworkPrice: artwork.price,
    artworkCategory: artwork.category,
    artworkPopularity: artwork.popularity,
  });

  res.status(200).json({
    success: true,
    data: suggestion,
  });
});

// ============================================
// 3. CHATBOT
// ============================================

/**
 * @route   POST /api/ai/chat
 * @desc    Get AI chatbot response
 * @access  Private
 */
export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { question, artworkId, context } = req.body;
    const userId = req.user?.id;

  if (!question) {
    res.status(400).json({ message: 'Question is required' });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const response = await AIService.getChatbotResponse({
    question,
    userId,
    artworkId,
    context,
  });

  res.status(200).json({
    success: true,
    data: response,
  });
});

// ============================================
// 4. ARTWORK RECOMMENDATIONS
// ============================================

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get personalized artwork recommendations
 * @access  Private
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const limit = parseInt(req.query.limit as string) || 6;

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const recommendations = await AIService.getRecommendedArtworks(userId, limit);

  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations,
  });
});

// ============================================
// 5. ARTWORK HISTORY & DETAILS
// ============================================

/**
 * @route   GET /api/ai/artwork-details/:id
 * @desc    Get AI-enhanced artwork details and history
 * @access  Public
 */
export const getArtworkDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const artwork = await Painting.findById(id).populate('reviews');
  if (!artwork) {
    res.status(404).json({ message: 'Artwork not found' });
    return;
  }

  // Get AI valuation
  const valuation = await AIService.estimateArtworkValue({
    title: artwork.title,
    category: artwork.category,
    style: artwork.style,
    artist: artwork.artist,
    price: artwork.price,
    popularity: artwork.popularity,
  });

  // Generate AI-enhanced description
  const aiEnhancedDetails = {
    artwork,
    valuation,
    aiInsights: {
      styleDescription: generateStyleDescription(artwork.style),
      categoryInsights: generateCategoryInsights(artwork.category),
      artistBackground: generateArtistBackground(artwork.artist),
      investmentPotential: calculateInvestmentPotential(valuation),
    },
  };

  res.status(200).json({
    success: true,
    data: aiEnhancedDetails,
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    Abstract:
      'Abstract art uses visual language of shape, form, color and line to create a composition which may exist with a degree of independence from visual references in the world.',
    Modern:
      'Modern art embraces experimentation and innovation, breaking away from traditional artistic conventions to explore new forms of expression.',
    Contemporary:
      'Contemporary art reflects the current moment, addressing present-day issues and utilizing diverse media and techniques.',
    Impressionist:
      'Impressionism captures fleeting moments and the play of light, using visible brushstrokes and an emphasis on accurate depiction of natural light.',
    Realism:
      'Realism depicts subjects truthfully, without artificiality and avoiding artistic conventions or implausible, exotic, and supernatural elements.',
    Expressionist:
      'Expressionism presents the world from a subjective perspective, distorting it radically for emotional effect to evoke moods or ideas.',
    Surrealism:
      'Surrealism explores the unconscious mind, featuring unexpected juxtapositions and dream-like scenarios that challenge rational thought.',
    Minimalist:
      'Minimalism strips art down to its essential features, using simple forms, limited color palettes, and clean lines.',
  };

  return descriptions[style] || 'A unique artistic style that showcases distinctive creative expression.';
}

function generateCategoryInsights(category: string): string {
  const insights: Record<string, string> = {
    Abstract:
      'Abstract artworks are highly sought after by contemporary collectors and interior designers. They offer versatility in placement and interpretation.',
    Portrait:
      'Portrait art has timeless appeal and strong emotional connection. Historical portraits often appreciate significantly in value.',
    Landscape:
      'Landscape paintings remain consistently popular, offering tranquility and connection to nature. They suit various interior styles.',
    'Still Life':
      'Still life compositions demonstrate technical mastery and attention to detail, appealing to traditional art collectors.',
    Digital:
      'Digital art represents the cutting edge of contemporary art, with growing market demand and innovative techniques.',
    Sculpture:
      'Three-dimensional artworks command premium prices and make bold statements in any space.',
  };

  return (
    insights[category] ||
    'This category represents a significant segment of the art market with dedicated collectors.'
  );
}

function generateArtistBackground(artist: string): string {
  // In a real application, this would query an artist database
  return `${artist} is a talented artist whose work demonstrates mastery of technique and unique creative vision. Their pieces are collected by art enthusiasts worldwide.`;
}

function calculateInvestmentPotential(valuation: any): string {
  const { marketTrend, confidence } = valuation;

  if (marketTrend === 'Rising' && confidence > 70) {
    return 'High - Strong upward trend with solid market confidence';
  } else if (marketTrend === 'Rising') {
    return 'Moderate-High - Positive trend with growing interest';
  } else if (marketTrend === 'Stable' && confidence > 70) {
    return 'Moderate - Stable value with reliable market presence';
  } else if (marketTrend === 'Declining') {
    return 'Conservative - Consider for personal enjoyment rather than investment';
  }

  return 'Moderate - Balanced investment potential';
}

// ============================================
// 6. BATCH VALUATION (for admin)
// ============================================

/**
 * @route   POST /api/ai/batch-valuate
 * @desc    Get valuations for multiple artworks
 * @access  Private (Admin)
 */
export const batchValuate = asyncHandler(async (req: Request, res: Response) => {
  const { artworkIds } = req.body;

  if (!artworkIds || !Array.isArray(artworkIds)) {
    res.status(400).json({ message: 'Artwork IDs array is required' });
    return;
  }

  const artworks = await Painting.find({ _id: { $in: artworkIds } });

  const valuations = await Promise.all(
    artworks.map(async (artwork: any) => {
      const valuation = await AIService.estimateArtworkValue({
        title: artwork.title,
        category: artwork.category,
        style: artwork.style,
        artist: artwork.artist,
        price: artwork.price,
        popularity: artwork.popularity,
      });

      return {
        artworkId: artwork._id,
        title: artwork.title,
        currentPrice: artwork.price,
        valuation,
      };
    }),
  );

  res.status(200).json({
    success: true,
    count: valuations.length,
    data: valuations,
  });
});
