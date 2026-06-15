import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Painting } from '../models/Painting.js';
import { Auction } from '../models/Auction.js';

/**
 * Seed Database with Sample Data
 * Run: npm run seed
 */

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@shonaarts.com',
    password: 'Admin@123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=B85A30&color=fff',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=534AB7&color=fff',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=D85A30&color=fff',
  },
];

const samplePaintings = [
  {
    title: 'Sunset Dreams',
    category: 'Abstract',
    description:
      'A vibrant abstract piece capturing the essence of a tropical sunset with bold strokes and warm colors.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    ],
    stock: 1,
    artist: 'Maria Rodriguez',
    style: 'Abstract',
    popularity: 85,
    featured: true,
  },
  {
    title: 'Urban Reflections',
    category: 'Modern',
    description:
      'Contemporary cityscape featuring geometric patterns and metallic tones, perfect for modern interiors.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
    images: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'],
    stock: 1,
    artist: 'David Chen',
    style: 'Modern',
    popularity: 78,
    featured: true,
  },
  {
    title: 'Serene Mountains',
    category: 'Landscape',
    description:
      'Peaceful mountain landscape with misty peaks and tranquil valleys, inspired by nature.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800',
    images: ['https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800'],
    stock: 2,
    artist: 'Emily Watson',
    style: 'Realism',
    popularity: 92,
    featured: true,
  },
  {
    title: 'Portrait of Grace',
    category: 'Portrait',
    description:
      'Elegant portrait showcasing classical techniques with modern sensibility and emotional depth.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800',
    images: ['https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800'],
    stock: 1,
    artist: 'Alessandro Rossi',
    style: 'Contemporary',
    popularity: 88,
    featured: false,
  },
  {
    title: 'Ocean Waves',
    category: 'Landscape',
    description:
      'Dynamic seascape capturing the power and beauty of ocean waves with stunning detail.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
    stock: 1,
    artist: 'Sarah Johnson',
    style: 'Impressionist',
    popularity: 75,
    featured: false,
  },
  {
    title: 'Geometric Harmony',
    category: 'Abstract',
    description:
      'Minimalist abstract composition featuring clean lines and balanced geometric shapes.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
    images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'],
    stock: 3,
    artist: 'Michael Park',
    style: 'Minimalist',
    popularity: 70,
    featured: false,
  },
  {
    title: 'Floral Symphony',
    category: 'Still Life',
    description:
      'Vibrant still life featuring an arrangement of exotic flowers in rich, saturated colors.',
    price: 780,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
    stock: 2,
    artist: 'Lisa Anderson',
    style: 'Contemporary',
    popularity: 82,
    featured: false,
  },
  {
    title: 'Digital Dreams',
    category: 'Digital',
    description:
      'Cutting-edge digital artwork blending technology and artistry in a futuristic vision.',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    images: ['https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'],
    stock: 5,
    artist: 'Alex Turner',
    style: 'Digital',
    popularity: 95,
    featured: true,
  },
  {
    title: 'Autumn Forest',
    category: 'Landscape',
    description:
      'Warm autumn scene with golden leaves and dappled sunlight filtering through trees.',
    price: 1050,
    image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800',
    images: ['https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800'],
    stock: 1,
    artist: 'Robert Williams',
    style: 'Impressionist',
    popularity: 79,
    featured: false,
  },
  {
    title: 'Abstract Emotions',
    category: 'Abstract',
    description:
      'Expressive abstract work conveying deep emotions through bold colors and dynamic brushwork.',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
    images: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'],
    stock: 1,
    artist: 'Nina Patel',
    style: 'Expressionist',
    popularity: 86,
    featured: true,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Painting.deleteMany({});
    await Auction.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = (await User.create(sampleUsers as any)) as unknown as any[];
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create paintings
    console.log('🎨 Creating paintings...');
    const createdPaintings = (await Painting.create(samplePaintings as any)) as unknown as any[];
    console.log(`✅ Created ${createdPaintings.length} paintings`);

    // Create sample auctions
    console.log('🔨 Creating auctions...');
    const auctionPaintings = createdPaintings.slice(0, 3); // First 3 paintings for auction

    const sampleAuctions = auctionPaintings.map((painting: any, index: number) => ({
      artworkId: painting._id,
      startingPrice: painting.price * 0.7, // Start at 70% of price
      highestBid: painting.price * 0.7,
      endTime: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000), // 1, 2, 3 days from now
      status: 'live',
      bidHistory: [],
    }));

    const createdAuctions = (await Auction.create(sampleAuctions as any)) as unknown as any[];
    console.log(`✅ Created ${createdAuctions.length} auctions`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🎨 Paintings: ${createdPaintings.length}`);
    console.log(`🔨 Auctions: ${createdAuctions.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n🔐 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Email: admin@shonaarts.com');
    console.log('  Password: Admin@123');
    console.log('\nCustomer Account:');
    console.log('  Email: john@example.com');
    console.log('  Password: Customer@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
