"use client";

import { Building2, Users } from "lucide-react";
import { useState } from "react";
import { DiscoverGallery } from "@/components/discover/discover-gallery";
import { OrganizationDiscoverGallery } from "@/components/discover/organization-discover-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DiscoverTab = "portfolios" | "organizations";

export function DiscoverTabs() {
  const [tab, setTab] = useState<DiscoverTab>("portfolios");

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as DiscoverTab)}
      className="space-y-8"
    >
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="portfolios" className="gap-2">
            <Users className="h-4 w-4" />
            Portfolios
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organizations
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="portfolios" className="mt-0 outline-none">
        <DiscoverGallery />
      </TabsContent>
      <TabsContent value="organizations" className="mt-0 outline-none">
        <OrganizationDiscoverGallery />
      </TabsContent>
    </Tabs>
  );
}
