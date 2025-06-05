"use client";

import {
  ChevronDown,
  Copy,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trash
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateMarket,
  useDeleteMarket,
  useReadMarkets,
  useUpdateMarket,
  type MarketCreateDto,
  type MarketDto,
  type MarketUpdateDto
} from "@/api";

import { MarketDetails } from "@/components/markets/market-details";
import { MarketForm } from "@/components/markets/market-form";
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

export default function MarketsPage() {
  const t = useTranslations("markets");
  const notificationT = useTranslations("notifications");
  const buttonT = useTranslations("common.buttons");
  const clipboardT = useTranslations("common.clipboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [selectedMarket, setSelectedMarket] = useState<MarketDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, refetch } = useReadMarkets();
  const createMarketMutation = useCreateMarket({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.created", { entity: t("title") }), {
          description: "The market has been created successfully.",
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

  const updateMarketMutation = useUpdateMarket({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.updated", { entity: t("title") }), {
          description: "The market has been updated successfully.",
        });
        void refetch();
        setIsEditing(false);
        setSelectedMarket(null);
      },
      onError: () => {
        toast.error(notificationT("error.generic"), {
          description: notificationT("error.update", { entity: t("title") }),
        });
      },
    },
  });

  const deleteMarketMutation = useDeleteMarket({
    mutation: {
      onSuccess: () => {
        toast.success(notificationT("success.deleted", { entity: t("title") }), {
          description: "The market has been deleted successfully.",
        });
        void refetch();
        setSelectedMarket(null);
      },
      onError: () => {
        toast.error(notificationT("error.generic"), {
          description: notificationT("error.delete", { entity: t("title") }),
        });
      },
    },
  });

  const markets = data?.records ?? [];

  // Extract unique states for the filter
  const states = [...new Set(markets.map(market => market.state))];

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.state.toLowerCase().includes(searchQuery.toLowerCase());

    if (stateFilter === "all") return matchesSearch;
    return matchesSearch && market.state === stateFilter;
  })
  .sort((b, a) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreateMarket = (marketData: MarketCreateDto) => {
    createMarketMutation.mutate({
      data: {
        ...marketData,
      },
    });
  };

  const handleUpdateMarket = (marketData: MarketUpdateDto) => {
    if (!selectedMarket) return;

    updateMarketMutation.mutate({
      marketId: selectedMarket.id,
      data: {
        ...marketData,
      },
    });
  };

  const handleDeleteMarket = (market: MarketDto) => {
    if (window.confirm(`${buttonT("delete")} ${market.name}?`)) {
      deleteMarketMutation.mutate({
        marketId: market.id,
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(clipboardT("copied"));
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
                  {t("filter.title")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStateFilter("all")}>
                  {t("filter.all")}
                </DropdownMenuItem>
                {states.map((state) => (
                  <DropdownMenuItem 
                    key={state} 
                    onClick={() => setStateFilter(state)}
                  >
                    {state}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={() => setIsCreating(true)} variant="action">
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {filteredMarkets.length}{" "}
              {filteredMarkets.length === 1 ? t("messages.foundSingular") : t("messages.foundPlural")}
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
                    <TableHead>{t("table.address")}</TableHead>
                    <TableHead>{t("table.city")}</TableHead>
                    <TableHead>{t("table.state")}</TableHead>
                    <TableHead>{t("table.id")}</TableHead>
                    <TableHead className="text-right">{t("table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarkets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("messages.noMarketsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMarkets.map((market) => (
                      <TableRow key={market.id}>
                        <TableCell>
                          {market.imageUrl && (
                            <img 
                              src={market.imageUrl} 
                              alt={market.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{market.name}</TableCell>
                        <TableCell>{market.address}</TableCell>
                        <TableCell>{market.city}</TableCell>
                        <TableCell>{market.state}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{market.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(market.id)}
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
                              onClick={() => setSelectedMarket(market)}
                              title={buttonT("view")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedMarket(market);
                                setIsEditing(true);
                              }}
                              title={buttonT("edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMarket(market)}
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

      {selectedMarket && !isEditing && (
        <MarketDetails
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteMarket(selectedMarket)}
        />
      )}

      {isCreating && (
        <MarketForm
          onSubmit={(data) => handleCreateMarket(data as MarketCreateDto)}
          onCancel={() => setIsCreating(false)}
          isSubmitting={createMarketMutation.isPending}
        />
      )}

      {isEditing && selectedMarket && (
        <MarketForm
          market={selectedMarket}
          onSubmit={(data) => handleUpdateMarket(data as MarketUpdateDto)}
          onCancel={() => {
            setIsEditing(false);
            setSelectedMarket(null);
          }}
          isSubmitting={updateMarketMutation.isPending}
        />
      )}
    </>
  );
} 