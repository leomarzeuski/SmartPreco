import { type ProductDto } from "@/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductDetailsProps {
  product: ProductDto;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductDetails({ product, onClose, onEdit, onDelete }: ProductDetailsProps) {
  const t = useTranslations();
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("products.details.title")}</DialogTitle>
          <DialogDescription>
            {t("products.details.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {product.imageUrl && (
            <div className="flex justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="font-semibold">{t("products.form.name")}:</div>
            <div>{product.name}</div>
            
            <div className="font-semibold">{t("products.form.description")}:</div>
            <div>{product.description}</div>
            
            <div className="font-semibold">{t("products.form.category")}:</div>
            <div>{product.category}</div>
            
            <div className="font-semibold">{t("products.details.lowestPrice")}:</div>
            <div>{product.lowestPrice ? `R$${product.lowestPrice.toFixed(2)}` : t("products.details.notAvailable")}</div>
            
            <div className="font-semibold">{t("products.table.id")}:</div>
            <div className="break-all">{product.id}</div>
            
            <div className="font-semibold">{t("products.details.lastUpdated")}:</div>
            <div>{new Date(product.updatedAt).toLocaleString()}</div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.buttons.cancel")}
          </Button>
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" /> {t("common.buttons.edit")}
          </Button>
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash className="h-4 w-4" /> {t("common.buttons.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 