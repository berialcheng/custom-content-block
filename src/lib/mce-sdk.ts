// Salesforce Marketing Cloud Engagement SDK Types and Utilities

export interface ContentBlockData {
  customText: string;
  products: Product[];
  layout: 'grid' | 'list' | 'carousel';
  maxProducts: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
}

export interface MCESdk {
  getData: (callback: (data: ContentBlockData) => void) => void;
  setData: (data: ContentBlockData) => void;
  setSuperContent: (html: string) => void;
  setContent: (html: string) => void;
  triggerAuth: (appId: string) => void;
  getContent: (callback: (content: string) => void) => void;
}

declare global {
  interface Window {
    postmonger?: {
      on: (event: string, callback: (data: unknown) => void) => void;
      trigger: (event: string, data?: unknown) => void;
    };
  }
}

// Default content block data
export const defaultBlockData: ContentBlockData = {
  customText: '为你推荐',
  products: [],
  layout: 'grid',
  maxProducts: 4,
};

// Sample products for demo/preview
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: '经典白色T恤',
    description: '100%纯棉，舒适透气',
    price: 99,
    currency: 'CNY',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    productUrl: '#',
  },
  {
    id: '2',
    name: '休闲牛仔裤',
    description: '经典版型，百搭款式',
    price: 299,
    currency: 'CNY',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
    productUrl: '#',
  },
  {
    id: '3',
    name: '运动跑鞋',
    description: '轻便舒适，适合日常运动',
    price: 459,
    currency: 'CNY',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    productUrl: '#',
  },
  {
    id: '4',
    name: '时尚背包',
    description: '大容量，多功能收纳',
    price: 199,
    currency: 'CNY',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    productUrl: '#',
  },
];

// MCE SDK wrapper for use in components
export class MCEBlockSDK {
  private isSDKReady = false;
  private pendingCallbacks: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSDK();
    }
  }

  private initSDK() {
    // Wait for postmonger to be available
    if (window.postmonger) {
      this.setupEventListeners();
      this.isSDKReady = true;
      this.pendingCallbacks.forEach(cb => cb());
      this.pendingCallbacks = [];
    } else {
      // Retry after a short delay
      setTimeout(() => this.initSDK(), 100);
    }
  }

  private setupEventListeners() {
    if (!window.postmonger) return;

    window.postmonger.on('initActivity', () => {
      window.postmonger?.trigger('ready');
    });

    window.postmonger.on('requestedTokens', (tokens: unknown) => {
      console.log('Received tokens:', tokens);
    });

    window.postmonger.on('requestedEndpoints', (endpoints: unknown) => {
      console.log('Received endpoints:', endpoints);
    });
  }

  onReady(callback: () => void) {
    if (this.isSDKReady) {
      callback();
    } else {
      this.pendingCallbacks.push(callback);
    }
  }

  getData(callback: (data: ContentBlockData) => void) {
    if (!window.postmonger) {
      // Return default data when SDK is not available (preview mode)
      callback({ ...defaultBlockData, products: sampleProducts });
      return;
    }

    window.postmonger.on('initActivity', (data: unknown) => {
      const blockData = data as { arguments?: { execute?: { inArguments?: ContentBlockData[] } } };
      const savedData = blockData?.arguments?.execute?.inArguments?.[0];
      callback(savedData || { ...defaultBlockData, products: sampleProducts });
    });
  }

  setData(data: ContentBlockData) {
    if (!window.postmonger) {
      console.log('Preview mode - data would be saved:', data);
      return;
    }

    window.postmonger.trigger('updateActivity', {
      arguments: {
        execute: {
          inArguments: [data],
        },
      },
    });
  }

  setSuperContent(html: string) {
    if (!window.postmonger) {
      console.log('Preview mode - super content:', html);
      return;
    }

    window.postmonger.trigger('updateSuperContent', html);
  }

  setContent(html: string) {
    if (!window.postmonger) {
      console.log('Preview mode - content:', html);
      return;
    }

    window.postmonger.trigger('updateContent', html);
  }
}
