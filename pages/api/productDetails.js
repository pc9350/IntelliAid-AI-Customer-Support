// API endpoint to search for products by keyword
// Import the product catalog data directly since we can't import from an API route
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
  ]
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: "Keyword parameter is required" });
    }
    
    // Normalize the search keyword
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    // Combine all products into a single array for searching
    const allProducts = [
      ...productCatalog.featuredProducts,
      ...productCatalog.popularItems,
      ...productCatalog.newArrivals,
      ...productCatalog.saleItems
    ];
    
    // Search for products that match the keyword in name or description
    const matchingProducts = allProducts.filter(product => {
      return (
        product.name.toLowerCase().includes(normalizedKeyword) ||
        product.description.toLowerCase().includes(normalizedKeyword) ||
        product.category.toLowerCase().includes(normalizedKeyword) ||
        product.subcategory.toLowerCase().includes(normalizedKeyword)
      );
    });
    
    // Limit to 3 results to not overwhelm the user
    const limitedResults = matchingProducts.slice(0, 3);
    
    return res.status(200).json({ 
      results: limitedResults,
      total: matchingProducts.length,
      keyword: normalizedKeyword
    });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 