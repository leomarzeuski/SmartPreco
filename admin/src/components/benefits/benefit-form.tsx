/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    BenefitCreateDtoType,
    useReadMarkets,
    type BenefitCreateDto,
    type BenefitDto,
    type BenefitUpdateDto,
    type MarketDto,
} from "@/api";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BenefitFormProps {
  benefit?: BenefitDto;
  onSubmit: (data: BenefitCreateDto | BenefitUpdateDto) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BenefitForm({
  benefit,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BenefitFormProps) {
  const t = useTranslations("benefits");
  const buttonT = useTranslations("common.buttons");
  const validationT = useTranslations("common.validation");

  const { data: marketsData } = useReadMarkets();
  const markets = marketsData?.records ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BenefitCreateDto>({
    defaultValues: {
      marketId: benefit?.marketId ?? "",
      type: benefit?.type ?? "VOUCHER",
      name: benefit?.name ?? "",
      description: benefit?.description ?? "",
      validFrom: benefit?.validFrom ? benefit.validFrom.split('T')[0] : "",
      validTo: benefit?.validTo ? benefit.validTo.split('T')[0] : "",
      imageUrl: benefit?.imageUrl ?? "",
    },
  });

  const watchedImageUrl = watch("imageUrl");
  const watchedType = watch("type");

  useEffect(() => {
    if (benefit) {
      reset({
        marketId: benefit.marketId,
        type: benefit.type,
        name: benefit.name,
        description: benefit.description,
        validFrom: benefit.validFrom.split('T')[0],
        validTo: benefit.validTo.split('T')[0],
        imageUrl: benefit.imageUrl ?? "",
      });
    }
  }, [benefit, reset]);

  const handleFormSubmit = (data: BenefitCreateDto) => {
    const submitData = {
      ...data,
      validFrom: `${data.validFrom}T00:00:00.000Z`,
      validTo: `${data.validTo}T23:59:59.999Z`,
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {benefit ? t("form.editTitle") : t("form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {benefit ? t("form.editDescription") : t("form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marketId">{t("form.market")}</Label>
              <Select
                value={watch("marketId")}
                onValueChange={(value) => setValue("marketId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.marketPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market: MarketDto) => (
                    <SelectItem key={market.id} value={market.id}>
                      {market.name} - {market.city}, {market.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marketId && (
                <p className="text-sm text-destructive">{validationT("required")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t("form.type")}</Label>
              <Select
                value={watchedType}
                onValueChange={(value) => setValue("type", value as BenefitCreateDto["type"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BenefitCreateDtoType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`form.types.${type.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{validationT("required")}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t("form.name")}</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder={t("form.namePlaceholder")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{validationT("required")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("form.description")}</Label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder={t("form.descriptionPlaceholder")}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{validationT("required")}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">{t("form.validFrom")}</Label>
              <Input
                id="validFrom"
                type="date"
                {...register("validFrom", { required: true })}
              />
              {errors.validFrom && (
                <p className="text-sm text-destructive">{validationT("required")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="validTo">{t("form.validTo")}</Label>
              <Input
                id="validTo"
                type="date"
                {...register("validTo", { required: true })}
              />
              {errors.validTo && (
                <p className="text-sm text-destructive">{validationT("required")}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">
              {t("form.imageUrl")} <span className="text-sm text-muted-foreground">({t("form.optional")})</span>
            </Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder={t("form.imageUrlPlaceholder")}
            />
            {watchedImageUrl && (
              <div className="mt-2">
                <img
                  src={watchedImageUrl}
                  alt={t("messages.imagePreview")}
                  className="h-20 w-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              {buttonT("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="action">
              {buttonT("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 