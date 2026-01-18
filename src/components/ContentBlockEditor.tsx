'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentBlockData, Product, sampleProducts, defaultBlockData, MCEBlockSDK } from '@/lib/mce-sdk';
import ProductPreview from './ProductPreview';

export default function ContentBlockEditor() {
  const [data, setData] = useState<ContentBlockData>(defaultBlockData);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [sdk, setSDK] = useState<MCEBlockSDK | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Initialize SDK
  useEffect(() => {
    const mceSDK = new MCEBlockSDK();
    setSDK(mceSDK);

    mceSDK.getData((savedData) => {
      setData(savedData);
      if (savedData.products && savedData.products.length > 0) {
        setProducts(savedData.products);
      }
    });
  }, []);

  // Generate HTML for email
  const generateEmailHTML = useCallback(() => {
    const displayProducts = products.slice(0, data.maxProducts);

    const productCards = displayProducts.map((product) => `
      <tr>
        <td style="padding: 10px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 0;">
                <a href="${product.productUrl}" style="text-decoration: none;">
                  <img src="${product.imageUrl}" alt="${product.name}" width="100%" style="display: block; max-width: 100%;">
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px;">
                <a href="${product.productUrl}" style="text-decoration: none; color: #1a1a1a; font-weight: 600; font-size: 14px;">${product.name}</a>
                <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">${product.description}</p>
                <p style="margin: 8px 0 0 0; color: #e53935; font-weight: bold; font-size: 16px;">¥${product.price}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <tr>
          <td style="padding: 20px; background-color: #f5f5f5;">
            ${data.customText ? `<h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${data.customText}</h2>` : ''}
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              ${productCards}
            </table>
          </td>
        </tr>
      </table>
    `;
  }, [data, products]);

  // Save data to MCE
  const saveData = useCallback(() => {
    const newData = { ...data, products };
    if (sdk) {
      sdk.setData(newData);
      sdk.setContent(generateEmailHTML());
    }
  }, [sdk, data, products, generateEmailHTML]);

  // Auto-save on data change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveData();
    }, 500);
    return () => clearTimeout(timer);
  }, [saveData]);

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, customText: e.target.value });
  };

  const handleLayoutChange = (layout: ContentBlockData['layout']) => {
    setData({ ...data, layout });
  };

  const handleMaxProductsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData({ ...data, maxProducts: parseInt(e.target.value, 10) });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">产品推荐模块</h1>
        <p className="text-sm text-gray-500">自定义您的产品推荐内容</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            编辑
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            预览
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'edit' ? (
          <div className="space-y-6">
            {/* Custom Text */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自定义标题文字
              </label>
              <input
                type="text"
                value={data.customText}
                onChange={handleCustomTextChange}
                placeholder="例如：为你推荐"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Layout Selection */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                布局方式
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'grid', label: '网格', icon: '▦' },
                  { value: 'list', label: '列表', icon: '☰' },
                  { value: 'carousel', label: '轮播', icon: '⟷' },
                ].map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => handleLayoutChange(layout.value as ContentBlockData['layout'])}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      data.layout === layout.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{layout.icon}</div>
                    <div className="text-xs font-medium">{layout.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Products */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示产品数量
              </label>
              <select
                value={data.maxProducts}
                onChange={handleMaxProductsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 6, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} 个产品
                  </option>
                ))}
              </select>
            </div>

            {/* Product List Info */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  产品列表
                </label>
                <span className="text-xs text-gray-500">
                  共 {products.length} 个产品
                </span>
              </div>
              <p className="text-xs text-gray-500">
                产品数据将从您的产品目录或 API 中自动获取。
                当前显示示例产品数据。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Email Preview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-xs text-gray-500">邮件预览</span>
              </div>
              <div className="p-4">
                <ProductPreview data={data} products={products} />
              </div>
            </div>

            {/* HTML Preview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-xs text-gray-500">HTML 代码预览</span>
              </div>
              <div className="p-4">
                <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-60">
                  {generateEmailHTML()}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
