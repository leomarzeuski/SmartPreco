import {
    type ProductCreateDto,
    type ProductDto,
    type ProductUpdateDto
} from "@/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ProductFormProps {
  product?: ProductDto;
  onSubmit: (data: ProductCreateDto | ProductUpdateDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    imageUrl: product?.imageUrl ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format data before submission
    const submissionData = {
      ...formData,
    };
    
    onSubmit(submissionData);
  };

  const isEdit = !!product;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("products.form.editTitle") : t("products.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? t("products.form.editDescription")
              : t("products.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("products.form.name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">{t("products.form.description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder={t("products.form.descriptionPlaceholder")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">{t("products.form.category")}</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder={t("products.form.categoryDescription")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">{t("products.form.imageUrl")}</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.imageUrl}
                  alt={t("products.form.imagePreview")}
                  className="h-24 w-24 rounded-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Invalid+URL";
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? t("products.actions.edit") : t("products.actions.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 