/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import type { BenefitDto } from "@/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BenefitDetailsProps {
  benefit: BenefitDto;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BenefitDetails({
  benefit,
  onClose,
  onEdit,
  onDelete,
}: BenefitDetailsProps) {
  const t = useTranslations("benefits");
  const buttonT = useTranslations("common.buttons");

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
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

  const isActive = () => {
    const now = new Date();
    const validFrom = new Date(benefit.validFrom);
    const validTo = new Date(benefit.validTo);
    return now >= validFrom && now <= validTo;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("details.title")}</DialogTitle>
          <DialogDescription>
            {t("details.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with image and basic info */}
          <div className="flex gap-4">
            {benefit.imageUrl && (
              <img
                src={benefit.imageUrl}
                alt={benefit.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{benefit.name}</h3>
                <Badge className={getBenefitTypeColor(benefit.type)}>
                  {t(`form.types.${benefit.type.toLowerCase()}`)}
                </Badge>
                <Badge variant={isActive() ? "default" : "secondary"}>
                  {isActive() ? t("details.active") : t("details.inactive")}
                </Badge>
              </div>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("details.marketId")}
              </p>
              <p className="font-mono text-sm">{benefit.marketId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("details.benefitId")}
              </p>
              <p className="font-mono text-sm">{benefit.id}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("details.validFrom")}
              </p>
              <p>{formatDate(benefit.validFrom)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("details.validTo")}
              </p>
              <p>{formatDate(benefit.validTo)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("details.lastUpdated")}
              </p>
              <p>{formatDate(benefit.updatedAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {buttonT("edit")}
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" />
              {buttonT("delete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 