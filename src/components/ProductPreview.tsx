'use client';

import { ContentBlockData, Product } from '@/lib/mce-sdk';

interface ProductPreviewProps {
  data: ContentBlockData;
  products: Product[];
}

export default function ProductPreview({ data, products }: ProductPreviewProps) {
  const displayProducts = products.slice(0, data.maxProducts);

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'CNY') {
      return `¥${price}`;
    }
    return `${currency} ${price}`;
  };

  const renderGridLayout = () => (
    <div className="grid grid-cols-2 gap-4">
      {displayProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-square relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            <p className="text-red-600 font-semibold mt-2">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-3">
      {displayProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex"
        >
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            <p className="text-red-600 font-semibold mt-1">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow w-40 flex-shrink-0"
          >
            <div className="aspect-square relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-gray-900 text-xs truncate">
                {product.name}
              </h3>
              <p className="text-red-600 font-semibold text-sm mt-1">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Custom Text Header */}
      {data.customText && (
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {data.customText}
        </h2>
      )}

      {/* Products Display */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无产品数据
        </div>
      ) : (
        <>
          {data.layout === 'grid' && renderGridLayout()}
          {data.layout === 'list' && renderListLayout()}
          {data.layout === 'carousel' && renderCarouselLayout()}
        </>
      )}
    </div>
  );
}
