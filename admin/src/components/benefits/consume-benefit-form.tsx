/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    useConsumeBenefit,
    type BenefitConsumeResponseDto,
    type UserBenefitConsumeDto,
} from "@/api";

import { Badge } from "@/components/ui/badge";
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
import { AlertCircle, CheckCircle } from "lucide-react";

interface ConsumeBenefitFormProps {
  onClose: () => void;
}

export function ConsumeBenefitForm({ onClose }: ConsumeBenefitFormProps) {
  const t = useTranslations("benefits");
  const buttonT = useTranslations("common.buttons");
  const validationT = useTranslations("common.validation");

  const [consumeResult, setConsumeResult] = useState<BenefitConsumeResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserBenefitConsumeDto>();

  const consumeBenefitMutation = useConsumeBenefit({
    mutation: {
      onSuccess: (data) => {
        console.log("Response from Consume Benefit", data);
        setConsumeResult(data.data);
        setError(null);
        reset();
      },
      onError: (error: any) => {
        setError(error?.response?.data?.message ?? t("consume.error.generic"));
        setConsumeResult(null);
      },
    },
  });

  const handleFormSubmit = (data: UserBenefitConsumeDto) => {
    if (!data.code?.trim()) {
      setError(validationT("required"));
      return;
    }
    
    setError(null);
    setConsumeResult(null);
    
    consumeBenefitMutation.mutate({
      data: {
        code: data.code.trim().toUpperCase(),
      },
    });
  };

  const handleClose = () => {
    setConsumeResult(null);
    setError(null);
    reset();
    onClose();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{t("consume.title")}</DialogTitle>
          <DialogDescription>
            {t("consume.description")}
          </DialogDescription>
        </DialogHeader>

        {!consumeResult && !error && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t("consume.code")}</Label>
              <Input
                id="code"
                {...register("code", { required: true })}
                placeholder={t("consume.codePlaceholder")}
                className="uppercase"
                maxLength={8}
                autoComplete="off"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{validationT("required")}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {buttonT("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={consumeBenefitMutation.isPending}
                variant="action"
              >
                {consumeBenefitMutation.isPending ? t("consume.validating") : t("consume.validate")}
              </Button>
            </div>
          </form>
        )}

        {error && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">{t("consume.error.title")}</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setError(null)}>
                {t("consume.tryAgain")}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                {buttonT("cancel")}
              </Button>
            </div>
          </div>
        )}

        {consumeResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-800 dark:text-green-200">
                  {t("consume.success.title")}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {consumeResult.message}
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("consume.consumedAt")}
                </span>
                <Badge variant="outline">
                  {formatDate(consumeResult.consumedAt)}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConsumeResult(null)}>
                {t("consume.validateAnother")}
              </Button>
              <Button variant="default" onClick={handleClose}>
                {buttonT("close")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 