// Large product dataset with 1000+ items for testing useDeferredValue
// This creates a realistic dataset with various categories and properties

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
  "Automotive",
  "Food & Beverages",
  "Office Supplies",
];

const brands = [
  "TechCorp",
  "StyleMax",
  "HomeComfort",
  "SportsPro",
  "BookWise",
  "BeautyGlow",
  "PlayTime",
  "AutoPlus",
  "FreshTaste",
  "OfficeEase",
  "Innovation Labs",
  "Premium Choice",
  "EcoFriendly",
  "Budget Best",
  "Luxury Line",
];

const adjectives = [
  "Premium",
  "Professional",
  "Compact",
  "Wireless",
  "Smart",
  "Eco-Friendly",
  "Portable",
  "Heavy-Duty",
  "Ultra-Light",
  "High-Performance",
  "Classic",
  "Modern",
  "Vintage",
  "Deluxe",
  "Essential",
  "Advanced",
  "Basic",
  "Multi-Purpose",
  "Ergonomic",
  "Durable",
];

const productTypes = {
  Electronics: [
    "Smartphone",
    "Laptop",
    "Tablet",
    "Headphones",
    "Speaker",
    "Camera",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Charger",
    "Cable",
    "Router",
  ],
  Clothing: [
    "T-Shirt",
    "Jeans",
    "Dress",
    "Jacket",
    "Shoes",
    "Hat",
    "Sweater",
    "Shorts",
    "Socks",
    "Underwear",
    "Coat",
    "Scarf",
  ],
  "Home & Garden": [
    "Chair",
    "Table",
    "Lamp",
    "Vase",
    "Pillow",
    "Blanket",
    "Plant Pot",
    "Garden Tool",
    "Decoration",
    "Storage Box",
    "Mirror",
    "Clock",
  ],
  "Sports & Outdoors": [
    "Backpack",
    "Water Bottle",
    "Tent",
    "Sleeping Bag",
    "Hiking Boots",
    "Bicycle",
    "Ball",
    "Racket",
    "Weights",
    "Yoga Mat",
    "Helmet",
    "Gloves",
  ],
  Books: [
    "Novel",
    "Textbook",
    "Cookbook",
    "Biography",
    "Guide",
    "Dictionary",
    "Comic Book",
    "Journal",
    "Notebook",
    "Calendar",
    "Planner",
    "Map",
  ],
  "Health & Beauty": [
    "Shampoo",
    "Conditioner",
    "Moisturizer",
    "Sunscreen",
    "Perfume",
    "Makeup",
    "Toothbrush",
    "Vitamins",
    "Soap",
    "Lotion",
    "Serum",
    "Mask",
  ],
  "Toys & Games": [
    "Board Game",
    "Puzzle",
    "Action Figure",
    "Doll",
    "Building Blocks",
    "Card Game",
    "Video Game",
    "Toy Car",
    "Stuffed Animal",
    "Art Kit",
    "Ball",
    "Robot",
  ],
  Automotive: [
    "Car Part",
    "Oil",
    "Filter",
    "Tire",
    "Battery",
    "Tool Kit",
    "Car Cover",
    "Air Freshener",
    "Phone Mount",
    "Dash Cam",
    "Cleaner",
    "Wax",
  ],
  "Food & Beverages": [
    "Coffee",
    "Tea",
    "Snacks",
    "Pasta",
    "Sauce",
    "Spices",
    "Juice",
    "Water",
    "Cereal",
    "Cookies",
    "Chocolate",
    "Nuts",
  ],
  "Office Supplies": [
    "Pen",
    "Pencil",
    "Paper",
    "Notebook",
    "Stapler",
    "Folder",
    "Organizer",
    "Calculator",
    "Tape",
    "Scissors",
    "Marker",
    "Sticky Notes",
  ],
};

// Function to generate random price
const generatePrice = () => {
  const prices = [
    9.99, 19.99, 29.99, 49.99, 79.99, 99.99, 149.99, 199.99, 299.99, 499.99,
    799.99, 1299.99,
  ];
  return prices[Math.floor(Math.random() * prices.length)];
};

// Function to generate random rating
const generateRating = () => {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0 stars
};

// Function to generate random stock quantity
const generateStock = () => {
  return Math.floor(Math.random() * 500) + 1;
};

// Function to generate a single product
const generateProduct = (id) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const productType =
    productTypes[category][
      Math.floor(Math.random() * productTypes[category].length)
    ];

  return {
    id: id,
    name: `${adjective} ${brand} ${productType}`,
    category: category,
    brand: brand,
    price: generatePrice(),
    rating: generateRating(),
    stock: generateStock(),
    inStock: Math.random() > 0.1, // 90% chance of being in stock
    description: `High-quality ${adjective.toLowerCase()} ${productType.toLowerCase()} from ${brand}. Perfect for everyday use.`,
    tags: [
      adjective.toLowerCase(),
      productType.toLowerCase().replace(/\s+/g, "-"),
      brand.toLowerCase(),
      category.toLowerCase().replace(/\s+/g, "-"),
    ],
  };
};

// Generate the large dataset
export const largeProductDataset = Array.from({ length: 2000 }, (_, index) =>
  generateProduct(index + 1)
);

// Helper function to simulate expensive search operation
export const expensiveSearchFilter = (products, searchTerm) => {
  // Add artificial delay to simulate expensive operation
  const start = performance.now();

  const results = products.filter((product) => {
    // Simulate complex matching logic
    const searchLower = searchTerm.toLowerCase();

    // Check multiple fields
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const categoryMatch = product.category.toLowerCase().includes(searchLower);
    const brandMatch = product.brand.toLowerCase().includes(searchLower);
    const descriptionMatch = product.description
      .toLowerCase()
      .includes(searchLower);
    const tagMatch = product.tags.some((tag) => tag.includes(searchLower));

    return (
      nameMatch || categoryMatch || brandMatch || descriptionMatch || tagMatch
    );
  });

  // Add some computational overhead to make it more realistic
  results.forEach((product) => {
    // Simulate some processing
    product._relevanceScore = Math.random();
  });

  // Sort by relevance (more expensive operation)
  results.sort((a, b) => b._relevanceScore - a._relevanceScore);

  const end = performance.now();
  console.log(`Search took ${end - start} milliseconds`);

  return results;
};

// Sample usage for testing:
console.log(`Generated ${largeProductDataset.length} products`);
console.log("Sample products:", largeProductDataset.slice(0, 5));
console.log("Categories available:", [
  ...new Set(largeProductDataset.map((p) => p.category)),
]);
console.log("Brands available:", [
  ...new Set(largeProductDataset.map((p) => p.brand)),
]);

// Export default for easy importing
export default largeProductDataset;
