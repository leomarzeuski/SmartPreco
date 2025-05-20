"use client";

import {
  CheckSquare,
  ChevronDown,
  Copy,
  Edit,
  Eye,
  Filter,
  Merge,
  Plus,
  Search,
  Square,
  Trash
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateProduct,
  useDeleteProduct,
  useMergeProducts,
  useReadProducts,
  useUpdateProduct,
  type ProductCreateDto,
  type ProductDto,
  type ProductUpdateDto
} from "@/api";

import { ProductDetails } from "@/components/products/product-details";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductDto[]>([]);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [targetProductId, setTargetProductId] = useState<string>("");

  const { data, isLoading, refetch } = useReadProducts();
  const createProductMutation = useCreateProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.created", { entity: t("products.title") }), {
          description: t("notifications.success.created-description"),
        });
        void refetch();
        setIsCreating(false);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.creation", { entity: t("products.title") }),
        });
      },
    },
  });

  const updateProductMutation = useUpdateProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.updated", { entity: t("products.title") }), {
          description: t("notifications.success.updated-description"),
        });
        void refetch();
        setIsEditing(false);
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.update", { entity: t("products.title") }),
        });
      },
    },
  });

  const deleteProductMutation = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.deleted", { entity: t("products.title") }), {
          description: t("notifications.success.deleted-description"),
        });
        void refetch();
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.delete", { entity: t("products.title") }),
        });
      },
    },
  });

  const mergeProductsMutation = useMergeProducts({
    mutation: {
      onSuccess: () => {
        toast.success(t("products.merge.success", { fallback: "Products merged successfully" }), {
          description: t("products.merge.successDescription", { fallback: "Selected products have been merged into the target product" }),
        });
        void refetch();
        setSelectedProducts([]);
        setIsMergeMode(false);
        setShowMergeDialog(false);
        setTargetProductId("");
      },
      onError: () => {
        toast.error(t("notifications.error.generic", { fallback: "An error occurred" }), {
          description: t("products.merge.error", { fallback: "Failed to merge products" }),
        });
      },
    },
  });

  const products = data?.records ?? [];

  // Extract unique categories for the filter
  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && product.category === categoryFilter;
  });

  const handleCreateProduct = (productData: ProductCreateDto) => {
    createProductMutation.mutate({
      data: {
        ...productData,
      },
    });
  };

  const handleUpdateProduct = (productData: ProductUpdateDto) => {
    if (!selectedProduct) return;

    updateProductMutation.mutate({
      productId: selectedProduct.id,
      data: {
        ...productData,
      },
    });
  };

  const handleDeleteProduct = (product: ProductDto) => {
    if (window.confirm(t("products.confirmDelete", { name: product.name }))) {
      deleteProductMutation.mutate({
        productId: product.id,
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(t("common.clipboard.copied"));
  };

  const toggleProductSelection = (product: ProductDto) => {
    // Check if product is already selected
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      // If it's the target product and we're removing it, reset target product
      if (product.id === targetProductId && selectedProducts.length > 1) {
        // Find another product to be the target
        const otherProducts = selectedProducts.filter(p => p.id !== product.id);
        setTargetProductId(otherProducts[0]?.id ?? "");
      }
      
      // Remove from selected products
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      // Add to selected products
      setSelectedProducts(prev => [...prev, product]);
      
      // If this is the first product, make it the target
      if (selectedProducts.length === 0) {
        setTargetProductId(product.id);
      }
    }
    
    // Force re-render for UI updates
    forceUpdate();
  };

  const handleMergeProducts = () => {
    if (selectedProducts.length < 2) {
      toast.error(t("products.merge.minimumRequired", { fallback: "Select at least 2 products to merge" }));
      return;
    }
    
    setShowMergeDialog(true);
    // Default to the first product as the target
    if (selectedProducts.length > 0) {
      setTargetProductId(selectedProducts[0]?.id ?? "");
    }
  };

  const confirmMerge = () => {
    if (!targetProductId || selectedProducts.length < 2) return;
    
    const productIds = selectedProducts
      .filter(product => product.id !== targetProductId)
      .map(product => product.id);
    
    try {
      mergeProductsMutation.mutate({
        data: {
          targetProductId,
          productIds
        }
      });
    } catch (error) {
      console.error("Error merging products:", error);
      toast.error(t("products.merge.error", { fallback: "Failed to merge products" }));
    }
  };

  const cancelMergeMode = () => {
    // If products are selected, ask for confirmation
    if (selectedProducts.length > 0) {
      if (window.confirm(t("products.merge.confirmCancel", { 
        fallback: "Are you sure you want to exit merge mode? Your selected products will be cleared."
      }))) {
        setIsMergeMode(false);
        setSelectedProducts([]);
        setTargetProductId("");
      }
    } else {
      setIsMergeMode(false);
      setSelectedProducts([]);
      setTargetProductId("");
    }
  };

  // Safe check for pending state
  const isPendingMerge = Boolean(mergeProductsMutation.isPending);

  // Function to handle dialog closing
  const handleDialogOpenChange = (open: boolean) => {
    setShowMergeDialog(open);
    // If dialog is closing and not completing the merge, reset to the first product
    if (!open && selectedProducts.length > 0) {
      setTargetProductId(selectedProducts[0]?.id ?? "");
    }
  };

// Removed unused forceUpdate function and associated state

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("products.title")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t("products.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("products.search")}
                className="w-[250px] pl-8 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 bg-card">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("products.filter.category")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  {t("products.filter.all")}
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isMergeMode ? (
              <>
                <Button 
                  size="sm" 
                  onClick={handleMergeProducts} 
                  variant="default"
                  disabled={selectedProducts.length < 2}
                >
                  <Merge className="mr-2 h-4 w-4" />
                  {t("products.actions.merge")} ({selectedProducts.length})
                </Button>
                <Button size="sm" onClick={cancelMergeMode} variant="outline">
                  {t("common.buttons.cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => setIsMergeMode(true)} variant="outline">
                  <Merge className="mr-2 h-4 w-4" />
                  {t("products.actions.startMerge")}
                </Button>
                <Button size="sm" onClick={() => setIsCreating(true)} variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("products.actions.add")}
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("products.title")}</CardTitle>
            <CardDescription>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? 
                t("products.foundSingular") : 
                t("products.foundPlural")}
              {isMergeMode && (
                <span className="ml-2 text-primary">
                  {t("products.merge.selectionMode", { 
                    fallback: "Selection mode", 
                    count: selectedProducts.length 
                  })}
                </span>
              )}
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
                    {isMergeMode && <TableHead className="w-[50px]"></TableHead>}
                    <TableHead>{t("products.table.image")}</TableHead>
                    <TableHead>{t("products.table.name")}</TableHead>
                    <TableHead>{t("products.table.category")}</TableHead>
                    <TableHead>{t("products.table.price")}</TableHead>
                    <TableHead>{t("products.table.id")}</TableHead>
                    <TableHead className="text-right">{t("products.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isMergeMode ? 7 : 6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("products.noProductsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      // Check if this product is selected
                      const isSelected = selectedProducts.some(p => p.id === product.id);
                      
                      return (
                        <TableRow 
                          key={product.id}
                          style={{
                            backgroundColor: isSelected && isMergeMode 
                              ? 'rgba(167, 243, 208, 0.5)' 
                              : undefined
                          }}
                        >
                          {isMergeMode && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleProductSelection(product)}
                                title={isSelected 
                                  ? t("products.merge.unselect") 
                                  : t("products.merge.select")
                                }
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                          )}
                          <TableCell>
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.lowestPrice 
                              ? `$${product.lowestPrice.toFixed(2)}` 
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.id.substring(0, 8)}...</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopyToClipboard(product.id)}
                                title={t("common.buttons.copy")}
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
                                onClick={() => setSelectedProduct(product)}
                                title={t("common.buttons.view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsEditing(true);
                                }}
                                title={t("common.buttons.edit")}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product)}
                                title={t("common.buttons.delete")}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedProduct && !isEditing && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteProduct(selectedProduct)}
        />
      )}

      {isCreating && (
        <ProductForm
          onSubmit={(data) => handleCreateProduct(data as ProductCreateDto)}
          onCancel={() => setIsCreating(false)}
          isSubmitting={createProductMutation.isPending}
        />
      )}

      {isEditing && selectedProduct && (
        <ProductForm
          product={selectedProduct}
          onSubmit={(data) => handleUpdateProduct(data as ProductUpdateDto)}
          onCancel={() => {
            setIsEditing(false);
            setSelectedProduct(null);
          }}
          isSubmitting={updateProductMutation.isPending}
        />
      )}

      {/* Merge Dialog */}
      <Dialog open={showMergeDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("products.merge.title")}</DialogTitle>
            <DialogDescription>
              {t("products.merge.description")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">{t("products.merge.selectTarget")}</h3>
              <Select
                value={targetProductId}
                onValueChange={setTargetProductId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("products.merge.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {selectedProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">{t("products.merge.productsToMerge")}</h3>
              <ul className="space-y-1 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {selectedProducts
                  .filter(product => product.id !== targetProductId)
                  .map(product => (
                    <li key={product.id} className="flex justify-between items-center py-1">
                      <span>{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.id.substring(0, 8)}...
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMergeDialog(false)}
            >
              {t("common.buttons.cancel")}
            </Button>
            <Button
              onClick={confirmMerge}
              disabled={!targetProductId || selectedProducts.length < 2 || isPendingMerge}
              className="ml-2"
            >
              {isPendingMerge ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-background"></div>
              ) : (
                <>{t("products.merge.confirm")}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 