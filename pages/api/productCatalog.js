// This file simulates a product catalog API that would typically fetch from a database
// In a real implementation, this would connect to your actual product database

const productCatalog = {
  categories: [
    {
      id: "women",
      name: "Women's Fashion",
      subcategories: ["Dresses", "Tops", "Bottoms", "Outerwear", "Activewear", "Accessories"]
    },
    {
      id: "men",
      name: "Men's Fashion",
      subcategories: ["Shirts", "Pants", "Suits", "Outerwear", "Activewear", "Accessories"]
    },
    {
      id: "kids",
      name: "Kids' Fashion",
      subcategories: ["Girls", "Boys", "Babies", "Shoes", "Accessories"]
    },
    {
      id: "seasonal",
      name: "Seasonal Collections",
      subcategories: ["Summer", "Fall", "Winter", "Spring", "Holiday"]
    }
  ],
  
  featuredProducts: [
    {
      id: "fp1",
      name: "Summer Breeze Dress",
      price: 49.99,
      category: "women",
      subcategory: "Dresses",
      description: "A light, flowy dress perfect for summer days and nights. Made from 100% sustainable cotton.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Blue", "Pink"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "fp2",
      name: "Classic Business Suit",
      price: 199.99,
      category: "men",
      subcategory: "Suits",
      description: "A sophisticated suit for the modern professional. Tailored fit with premium materials.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Black", "Gray"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1553240799-36214670ddcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "fp3",
      name: "Everyday Comfort Tee",
      price: 24.99,
      category: "women",
      subcategory: "Tops",
      description: "A soft, comfortable t-shirt for everyday wear. Made from organic cotton blend.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Black", "Gray", "Red", "Blue"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "fp4",
      name: "Winter Wonderland Jacket",
      price: 129.99,
      category: "seasonal",
      subcategory: "Winter",
      description: "Stay warm and stylish with this insulated winter jacket. Waterproof and windproof.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Green"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  
  popularItems: [
    {
      id: "pi1",
      name: "Designer Jeans",
      price: 79.99,
      category: "women",
      subcategory: "Bottoms",
      description: "Premium denim jeans with a perfect fit. Stretchy and comfortable for all-day wear.",
      sizes: ["0", "2", "4", "6", "8", "10", "12", "14"],
      colors: ["Blue", "Black", "White"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "pi2",
      name: "Classic Oxford Shirt",
      price: 59.99,
      category: "men",
      subcategory: "Shirts",
      description: "A timeless Oxford shirt for any occasion. Breathable cotton fabric with a comfortable fit.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Blue", "Pink", "Green"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  
  newArrivals: [
    {
      id: "na1",
      name: "Autumn Knit Sweater",
      price: 69.99,
      category: "women",
      subcategory: "Tops",
      description: "A cozy, warm sweater for the autumn season. Made from a soft wool blend.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Beige", "Brown", "Red"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1576670759310-fc6357f346ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "na2",
      name: "Active Performance Leggings",
      price: 49.99,
      category: "women",
      subcategory: "Activewear",
      description: "High-performance leggings perfect for workouts or casual wear. Moisture-wicking and stretchy.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Gray", "Blue", "Pink"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  
  saleItems: [
    {
      id: "s1",
      name: "Holiday Party Dress",
      originalPrice: 89.99,
      salePrice: 59.99,
      category: "seasonal",
      subcategory: "Holiday",
      description: "A stunning dress for holiday parties and celebrations. Elegant and comfortable.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Red", "Green", "Black", "Gold"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "s2",
      name: "Summer Sandals",
      originalPrice: 49.99,
      salePrice: 29.99,
      category: "women",
      subcategory: "Accessories",
      description: "Comfortable and stylish sandals for summer. Cushioned insole and durable outsole.",
      sizes: ["5", "6", "7", "8", "9", "10"],
      colors: ["Brown", "Black", "White"],
      inStock: true,
      imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  
  // Store policies for the chatbot to reference
  policies: {
    returns: {
      timeframe: "30 days",
      conditions: "Items must be unworn with original tags attached",
      exceptions: ["Swimwear", "Intimate apparel", "Final sale items"],
      process: "Visit our return portal or bring the item to any store location with your receipt"
    },
    shipping: {
      standard: {
        cost: "Free for orders over $50, otherwise $5.99",
        timeframe: "3-5 business days"
      },
      express: {
        cost: "$12.99",
        timeframe: "1-2 business days"
      },
      international: {
        cost: "Varies by country",
        timeframe: "7-14 business days"
      }
    },
    priceMatch: "We match prices from authorized retailers within 14 days of purchase",
    sizeGuide: "https://trendythreads.com/size-guide",
    giftCards: {
      types: ["Physical", "Digital"],
      expirationPolicy: "Gift cards never expire",
      minimumAmount: 10,
      maximumAmount: 500
    }
  },
  
  // Store locations for the chatbot to reference
  storeLocations: [
    {
      name: "TrendyThreads NYC Flagship",
      address: "123 Fashion Ave, New York, NY 10018",
      hours: "Monday-Saturday: 10am-9pm, Sunday: 11am-7pm",
      phone: "212-555-1234",
      features: ["Personal Shopping", "Alterations", "Cafe"]
    },
    {
      name: "TrendyThreads LA",
      address: "456 Rodeo Drive, Los Angeles, CA 90210",
      hours: "Monday-Saturday: 10am-8pm, Sunday: 11am-6pm",
      phone: "310-555-5678",
      features: ["Personal Shopping", "VIP Lounge"]
    },
    {
      name: "TrendyThreads Chicago",
      address: "789 Michigan Ave, Chicago, IL 60611",
      hours: "Monday-Saturday: 10am-8pm, Sunday: 11am-6pm",
      phone: "312-555-9012",
      features: ["Personal Shopping", "Alterations"]
    }
  ]
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return specific data if requested, or full catalog
    const { category, type, id } = req.query;
    
    if (category) {
      const categoryData = productCatalog.categories.find(c => c.id === category);
      return res.status(200).json(categoryData || { error: "Category not found" });
    }
    
    if (type) {
      switch(type) {
        case 'featured':
          return res.status(200).json(productCatalog.featuredProducts);
        case 'popular':
          return res.status(200).json(productCatalog.popularItems);
        case 'new':
          return res.status(200).json(productCatalog.newArrivals);
        case 'sale':
          return res.status(200).json(productCatalog.saleItems);
        case 'policies':
          return res.status(200).json(productCatalog.policies);
        case 'locations':
          return res.status(200).json(productCatalog.storeLocations);
        default:
          return res.status(400).json({ error: "Invalid type parameter" });
      }
    }
    
    if (id) {
      // Search for product by ID across all product arrays
      const allProducts = [
        ...productCatalog.featuredProducts,
        ...productCatalog.popularItems,
        ...productCatalog.newArrivals,
        ...productCatalog.saleItems
      ];
      
      const product = allProducts.find(p => p.id === id);
      return res.status(200).json(product || { error: "Product not found" });
    }
    
    // Return entire catalog if no specific request
    return res.status(200).json(productCatalog);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 