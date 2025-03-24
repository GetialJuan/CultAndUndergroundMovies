'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ControlledTabsProps {
  reviewsContent: React.ReactNode;
  writeContent: React.ReactNode;
  isDisabled?: boolean;
}

export default function ControlledTabs({
  reviewsContent,
  writeContent,
  isDisabled = false,
}: ControlledTabsProps) {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="reviews">Ver reseñas</TabsTrigger>
        <TabsTrigger 
          value="write" 
          disabled={isDisabled}
          title={isDisabled ? "Ya has escrito una reseña o necesitas iniciar sesión" : ""}
        >
          Escribir reseña
        </TabsTrigger>
      </TabsList>
      <TabsContent value="reviews" className="mt-0">
        {reviewsContent}
      </TabsContent>
      <TabsContent value="write" className="mt-0">
        {writeContent}
      </TabsContent>
    </Tabs>
  );
}
