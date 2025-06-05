/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { type ReportDto } from "@/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { ReportStatusBadge } from "./report-status-badge"

interface ReportDetailsProps {
  report: ReportDto | null
  onClose: () => void
  onApprove: (report: ReportDto) => void
  onReject: (report: ReportDto) => void
}

export function ReportDetails({ report, onClose, onApprove, onReject }: ReportDetailsProps) {
  const t = useTranslations();
  
  if (!report) return null
  
  console.log(report)

  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("reports.details.title")}</DialogTitle>
          <DialogDescription>{t("reports.details.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.table.id")}:</div>
                <div className="col-span-3 font-mono text-sm">{report.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.table.priceId")}:</div>
                <div className="col-span-3 font-mono text-sm">{report.price.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.table.product")}:</div>
                <div className="col-span-3">{report.price.product.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.table.market")}:</div>
                <div className="col-span-3">{report.price.market.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.details.price")}:</div>
                <div className="col-span-3">R$ {report.price.price.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">{t("reports.table.status")}:</div>
                <div className="col-span-3">
                  <ReportStatusBadge status={report.status} resolved={report.resolved} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={report.price.imageUrl ?? ""}
                  alt={`${report.price.product.name} at ${report.price.market.name}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {t("reports.details.imageDescription")}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{t("reports.table.reason")}:</div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm">{report.reason}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{t("reports.details.marketDetails")}:</div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm">
                {report.price.market.name} - {report.price.market.address}
                <br />
                {report.price.market.city}, {report.price.market.state}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("common.buttons.cancel")}
          </Button>

          {!report.resolved && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-red-200 bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => onReject(report)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {t("reports.details.reject")}
              </Button>
              <Button
                className="border-green-200 bg-green-100 text-green-800 hover:bg-green-200"
                onClick={() => onApprove(report)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("reports.details.approve")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 