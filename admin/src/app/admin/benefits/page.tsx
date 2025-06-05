/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
    ChevronDown,
    Copy,
    Edit,
    Eye,
    Filter,
    Plus,
    QrCode,
    Search,
    Trash
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
    BenefitDtoType,
    useCreateBenefit,
    useDeleteBenefit,
    useReadBenefits,
    useReadMarkets,
    useUpdateBenefit,
    type BenefitCreateDto,
    type BenefitDto,
    type BenefitUpdateDto
} from "@/api";

import { BenefitDetails } from "@/components/benefits/benefit-details";
import { BenefitForm } from "@/components/benefits/benefit-form";
import { ConsumeBenefitForm } from "@/components/benefits/consume-benefit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function BenefitsPage() {
  const t = useTranslations("benefits");
  const notificationT = useTranslations("notifications");
  const buttonT = useTranslations("common.buttons");
  const clipboardT = useTranslations("common.clipboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);

  const { data, isLoading, refetch } = useReadBenefits();
  const { data: marketsData } = useReadMarkets();
  const markets = marketsData?.records ?? [];

  const createBenefitMutation = useCreateBenefit({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.created", { entity: t("title") }), {
          description: "The benefit has been created successfully.",
        });
        void refetch();
        setIsCreating(false);
      },
      onError: () => {
        toast.error(notificationT("error.generic"), {
          description: notificationT("error.creation", { entity: t("title") }),
        });
      },
    },
  });

  const updateBenefitMutation = useUpdateBenefit({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.updated", { entity: t("title") }), {
          description: "The benefit has been updated successfully.",
        });
        void refetch();
        setIsEditing(false);
        setSelectedBenefit(null);
      },
      onError: () => {
        toast.error(notificationT("error.generic"), {
          description: notificationT("error.update", { entity: t("title") }),
        });
      },
    },
  });

  const deleteBenefitMutation = useDeleteBenefit({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.deleted", { entity: t("title") }), {
          description: "The benefit has been deleted successfully.",
        });
        void refetch();
        setSelectedBenefit(null);
      },
      onError: () => {
        toast.error(notificationT("error.generic"), {
          description: notificationT("error.delete", { entity: t("title") }),
        });
      },
    },
  });

  const benefits = data?.records ?? [];

  const getMarketName = (marketId: string) => {
    const market = markets.find(m => m.id === marketId);
    return market ? `${market.name} - ${market.city}` : marketId.substring(0, 8) + "...";
  };

  const isActive = (benefit: BenefitDto) => {
    const now = new Date();
    const validFrom = new Date(benefit.validFrom);
    const validTo = new Date(benefit.validTo);
    return now >= validFrom && now <= validTo;
  };

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
      benefit.description.toLowerCase().includes(searchQuery.toLowerCase()) ??
      getMarketName(benefit.marketId).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || benefit.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && isActive(benefit)) ||
      (statusFilter === "inactive" && !isActive(benefit));

    return matchesSearch && matchesType && matchesStatus;
  })
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreateBenefit = (benefitData: BenefitCreateDto) => {
    createBenefitMutation.mutate({
      data: {
        ...benefitData,
      },
    });
  };

  const handleUpdateBenefit = (benefitData: BenefitUpdateDto) => {
    if (!selectedBenefit) return;

    updateBenefitMutation.mutate({
      benefitId: selectedBenefit.id,
      data: {
        ...benefitData,
      },
    });
  };

  const handleDeleteBenefit = (benefit: BenefitDto) => {
    if (window.confirm(`${buttonT("delete")} ${benefit.name}?`)) {
      deleteBenefitMutation.mutate({
        benefitId: benefit.id,
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(clipboardT("copied"));
  };

  const getBenefitTypeColor = (type: string) => {
    switch (type) {
      case "VOUCHER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "GIFT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "DISCOUNT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "CASHBACK":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "FREEBIE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search")}
                className="w-[250px] pl-8 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 bg-card">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("filter.type")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  {t("filter.all")}
                </DropdownMenuItem>
                {Object.values(BenefitDtoType).map((type) => (
                  <DropdownMenuItem 
                    key={type} 
                    onClick={() => setTypeFilter(type)}
                  >
                    {t(`form.types.${type.toLowerCase()}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-card">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("filter.status")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  {t("filter.all")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  {t("filter.active")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  {t("filter.inactive")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={() => setIsCreating(true)} variant="action">
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.add")}
            </Button>
            <Button size="sm" onClick={() => setIsConsuming(true)} variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              {t("actions.consume")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {filteredBenefits.length}{" "}
              {filteredBenefits.length === 1 ? t("messages.foundSingular") : t("messages.foundPlural")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.image")}</TableHead>
                    <TableHead>{t("table.name")}</TableHead>
                    <TableHead>{t("table.type")}</TableHead>
                    <TableHead>{t("table.market")}</TableHead>
                    <TableHead>{t("table.status")}</TableHead>
                    <TableHead>{t("table.validTo")}</TableHead>
                    <TableHead>{t("table.id")}</TableHead>
                    <TableHead className="text-right">{t("table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBenefits.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("messages.noBenefitsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBenefits.map((benefit) => (
                      <TableRow key={benefit.id}>
                        <TableCell>
                          {benefit.imageUrl && (
                            <img 
                              src={benefit.imageUrl} 
                              alt={benefit.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{benefit.name}</TableCell>
                        <TableCell>
                          <Badge className={getBenefitTypeColor(benefit.type)}>
                            {t(`form.types.${benefit.type.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getMarketName(benefit.marketId)}</TableCell>
                        <TableCell>
                          <Badge variant={isActive(benefit) ? "default" : "secondary"}>
                            {isActive(benefit) ? t("filter.active") : t("filter.inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(benefit.validTo).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{benefit.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(benefit.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBenefit(benefit)}
                              title={buttonT("view")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedBenefit(benefit);
                                setIsEditing(true);
                              }}
                              title={buttonT("edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBenefit(benefit)}
                              title={buttonT("delete")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedBenefit && !isEditing && (
        <BenefitDetails
          benefit={selectedBenefit}
          onClose={() => setSelectedBenefit(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteBenefit(selectedBenefit)}
        />
      )}

      {isCreating && (
        <BenefitForm
          onSubmit={(data) => handleCreateBenefit(data as BenefitCreateDto)}
          onCancel={() => setIsCreating(false)}
          isSubmitting={createBenefitMutation.isPending}
        />
      )}

      {isEditing && selectedBenefit && (
        <BenefitForm
          benefit={selectedBenefit}
          onSubmit={(data) => handleUpdateBenefit(data as BenefitUpdateDto)}
          onCancel={() => {
            setIsEditing(false);
            setSelectedBenefit(null);
          }}
          isSubmitting={updateBenefitMutation.isPending}
        />
      )}

      {isConsuming && (
        <ConsumeBenefitForm
          onClose={() => setIsConsuming(false)}
        />
      )}
    </>
  );
} 