import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 320,
  margin: '8px 0',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 180,
  position: 'relative',
}));

const SaleTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: '#E53935',
  color: 'white',
  padding: '4px 8px',
  borderRadius: 4,
  fontWeight: 'bold',
  fontSize: '0.75rem',
  zIndex: 1,
}));

const PriceSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  marginTop: 8,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  marginRight: 8,
}));

const ProductCard = ({ product }) => {
  // Handle both sale and regular products
  const isSaleItem = 'originalPrice' in product && 'salePrice' in product;

  return (
    <StyledCard>
      <ProductImage
        image={product.imageUrl || 'https://via.placeholder.com/300x180?text=Product+Image'}
        title={product.name}
      >
        {isSaleItem && (
          <SaleTag>
            {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% OFF
          </SaleTag>
        )}
      </ProductImage>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Typography>
        
        <PriceSection>
          {isSaleItem ? (
            <>
              <OriginalPrice variant="body2">${product.originalPrice.toFixed(2)}</OriginalPrice>
              <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                ${product.salePrice.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </PriceSection>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {/* Size Chips */}
          {product.sizes && product.sizes.slice(0, 4).map((size) => (
            <Chip 
              key={size} 
              label={size} 
              size="small" 
              variant="outlined" 
              sx={{ borderRadius: '4px' }}
            />
          ))}
          {product.sizes && product.sizes.length > 4 && (
            <Chip 
              label={`+${product.sizes.length - 4}`} 
              size="small" 
              variant="outlined" 
              sx={{ borderRadius: '4px' }}
            />
          )}
        </Box>
        
        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
          {/* Color indicators */}
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            {product.colors && product.colors.slice(0, 3).map((color) => (
              <CircleIcon 
                key={color} 
                sx={{ 
                  fontSize: 16, 
                  mr: 0.5, 
                  color: color.toLowerCase(),
                  // For "white" color, add a border to make it visible
                  ...(color.toLowerCase() === 'white' && {
                    border: '1px solid #ccc',
                    borderRadius: '50%'
                  })
                }} 
              />
            ))}
            {product.colors && product.colors.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{product.colors.length - 3}
              </Typography>
            )}
          </Box>
          
          {/* In stock indicator */}
          {product.inStock ? (
            <Chip
              icon={<CheckCircleIcon fontSize="small" />}
              label="In Stock"
              size="small"
              color="success"
              variant="outlined"
              sx={{ ml: 'auto', height: 24 }}
            />
          ) : (
            <Chip
              label="Out of Stock"
              size="small"
              color="error"
              variant="outlined"
              sx={{ ml: 'auto', height: 24 }}
            />
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard; 