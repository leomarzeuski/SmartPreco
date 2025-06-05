import {
    type MarketCreateDto,
    type MarketDto,
    type MarketUpdateDto
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
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface MarketFormProps {
  market?: MarketDto;
  onSubmit: (data: MarketCreateDto | MarketUpdateDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function MarketForm({ market, onSubmit, onCancel, isSubmitting }: MarketFormProps) {
  const t = useTranslations("markets");
  const buttonT = useTranslations("common.buttons");
  
  const [formData, setFormData] = useState({
    name: market?.name ?? "",
    address: market?.address ?? "",
    city: market?.city ?? "",
    state: market?.state ?? "",
    imageUrl: market?.imageUrl ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEdit = !!market;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("actions.edit") : t("actions.add")}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? t("form.editDescription")
              : t("form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("form.name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">{t("form.address")}</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder={t("form.addressDescription")}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">{t("form.city")}</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder={t("form.cityDescription")}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="state">{t("form.state")}</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder={t("form.stateDescription")}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">{t("form.imageUrl")}</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder={t("form.imageUrlDescription")}
            />
            {formData.imageUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.imageUrl}
                  alt={t("form.imagePreview")}
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
              {buttonT("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? buttonT("save") : buttonT("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 