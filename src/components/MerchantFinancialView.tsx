import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SubscriptionManagementView } from './SubscriptionManagementView';
import { DigitalWalletView } from './DigitalWalletView';

interface MerchantFinancialViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const MerchantFinancialView: React.FC<MerchantFinancialViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [activeTab, setActiveTab] = useState('subscription');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription">إدارة الاشتراك</TabsTrigger>
          <TabsTrigger value="wallet">المحفظة الرقمية</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionManagementView
            storeData={storeData}
            setStoreData={setStoreData}
            onSave={onSave}
          />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <DigitalWalletView
            storeData={storeData}
            setStoreData={setStoreData}
            onSave={onSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { MerchantFinancialView };
