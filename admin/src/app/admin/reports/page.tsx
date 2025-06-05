/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  type ReportDto,
  ReportUpdateDtoStatus,
  useReadReports,
  useUpdateReport
} from "@/api";
import { ReportDetails } from "@/components/reports/report-details";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
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
import { ChevronDown, Copy, Eye, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<ReportDto | null>(null);

  const { data, isLoading, refetch } = useReadReports();
  const updateReportMutation = useUpdateReport({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.updated", { entity: t("reports.title") }), {
          description: t("notifications.success.updated-description"),
        });
        void refetch();
        setSelectedReport(null);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.update", { entity: t("reports.title") }),
        });
      },
    },
  });

  const reports = data?.records ?? [];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      report.price?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      report.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "resolved") return matchesSearch && report.resolved;
    if (statusFilter === "unresolved") return matchesSearch && !report.resolved;

    return matchesSearch;
  }).sort((b, a) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleApproveReport = (report: ReportDto) => {
    updateReportMutation.mutate({
      reportId: report.id,
      data: {
        resolved: true,
        status: ReportUpdateDtoStatus.APPROVED,
      },
    });
  };

  const handleRejectReport = (report: ReportDto) => {
    updateReportMutation.mutate({
      reportId: report.id,
      data: {
        resolved: true,
        status: ReportUpdateDtoStatus.REJECTED,
      },
    });
  };

  const handleCopyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(t("common.clipboard.copied"));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("reports.title")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t("reports.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("reports.search")}
                className="w-[250px] pl-8 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 bg-card">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("reports.filter.title")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  {t("reports.filter.all")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                  {t("reports.filter.resolved")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("unresolved")}>
                  {t("reports.filter.unresolved")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("reports.title")}</CardTitle>
            <CardDescription>
              {filteredReports.length}{" "}
              {filteredReports.length === 1 
                ? t("reports.foundSingular") 
                : t("reports.foundPlural")}
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
                    <TableHead>{t("reports.table.id")}</TableHead>
                    <TableHead>{t("reports.table.priceId")}</TableHead>
                    <TableHead>{t("reports.table.product")}</TableHead>
                    <TableHead>{t("reports.table.market")}</TableHead>
                    <TableHead>{t("reports.table.reason")}</TableHead>
                    <TableHead>{t("reports.table.status")}</TableHead>
                    <TableHead className="text-right">{t("reports.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("reports.noReportsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{report.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(report.id)}
                              title={t("common.buttons.copy")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{report.price.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(report.price.id)}
                              title={t("common.buttons.copy")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{report.price.product.name}</TableCell>
                        <TableCell>{report.price.market.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {report.reason}
                        </TableCell>
                        <TableCell>
                          <ReportStatusBadge status={report.status} resolved={report.resolved} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedReport(report)}
                            title={t("common.buttons.view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      <ReportDetails
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
      />
    </>
  );
}
