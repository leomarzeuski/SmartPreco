/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import { useReadBenefits, useReadMarkets, useReadProducts, useReadReports } from "@/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, Gift, Package, Store } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AdminDashboard() {
  const t = useTranslations("dashboard");
  const { data: reportsData } = useReadReports()
  const { data: productsData } = useReadProducts()
  const { data: marketsData } = useReadMarkets()
  const { data: benefitsData } = useReadBenefits()
  
  // Reports stats
  const reports = reportsData?.records ?? []
  const totalReports = reports.length
  const resolvedReports = reports.filter((report) => report.resolved).length
  const pendingReports = totalReports - resolvedReports
  const approvedReports = reports.filter((report) => report.status === "APPROVED").length
  const rejectedReports = reports.filter((report) => report.status === "REJECTED").length

  // Products and Markets stats
  const products = productsData?.records ?? []
  const markets = marketsData?.records ?? []
  const totalProducts = products.length
  const totalMarkets = markets.length

  // Benefits stats
  const benefits = benefitsData?.records ?? []
  const totalBenefits = benefits.length
  const now = new Date()
  const activeBenefits = benefits.filter(benefit => {
    const validFrom = new Date(benefit.validFrom)
    const validTo = new Date(benefit.validTo)
    return now >= validFrom && now <= validTo
  }).length
  const expiredBenefits = totalBenefits - activeBenefits
  const benefitsByType = benefits.reduce((acc, benefit) => {
    acc[benefit.type] = (acc[benefit.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('overview')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('cards.products.title')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{t('cards.products.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('cards.markets.title')}</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMarkets}</div>
              <p className="text-xs text-muted-foreground">{t('cards.markets.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('cards.benefits.title')}</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBenefits}</div>
              <p className="text-xs text-muted-foreground">
                {activeBenefits} {t('cards.benefits.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('cards.reports.title')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
              <p className="text-xs text-muted-foreground">
                {pendingReports} {t('reportsOverview.pendingReports.description').toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mt-2">{t('benefitsOverview.title')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('benefitsOverview.activeBenefits.title')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBenefits}</div>
              <p className="text-xs text-muted-foreground">
                {totalBenefits > 0 ? ((activeBenefits / totalBenefits) * 100).toFixed(1) : "0"}% {t('benefitsOverview.activeBenefits.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('benefitsOverview.expiredBenefits.title')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredBenefits}</div>
              <p className="text-xs text-muted-foreground">{t('benefitsOverview.expiredBenefits.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('benefitsOverview.mostPopular.title')}</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(benefitsByType).length > 0
                  ? Object.entries(benefitsByType).sort(([,a], [,b]) => b - a)[0]?.[0] ?? "N/A"
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(benefitsByType).length > 0
                  ? `${Object.entries(benefitsByType).sort(([,a], [,b]) => b - a)[0]?.[1] ?? 0} ${t('benefitsOverview.mostPopular.description')}`
                  : t('benefitsOverview.mostPopular.noBenefits')}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mt-2">{t('reportsOverview.title')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reportsOverview.resolvedReports.title')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedReports}</div>
              <p className="text-xs text-muted-foreground">
                {((resolvedReports / totalReports) * 100).toFixed(1)}% {t('reportsOverview.resolvedReports.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reportsOverview.pendingReports.title')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReports}</div>
              <p className="text-xs text-muted-foreground">{t('reportsOverview.pendingReports.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reportsOverview.approvalRate.title')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalReports > 0
                  ? ((approvedReports / totalReports) * 100).toFixed(1)
                  : "0"}%
              </div>
              <p className="text-xs text-muted-foreground">
                {approvedReports} {t('reportsOverview.approvalRate.description')} {rejectedReports}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
            <CardDescription>{t('quickActions.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('quickActions.products.title')}</CardTitle>
                  <CardDescription>{t('quickActions.products.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/admin/products"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80"
                  >
                    {t('quickActions.products.link')}
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('quickActions.markets.title')}</CardTitle>
                  <CardDescription>{t('quickActions.markets.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/admin/markets"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80"
                  >
                    {t('quickActions.markets.link')}
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('quickActions.benefits.title')}</CardTitle>
                  <CardDescription>{t('quickActions.benefits.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/admin/benefits"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80"
                  >
                    {t('quickActions.benefits.link')}
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('quickActions.reports.title')}</CardTitle>
                  <CardDescription>{t('quickActions.reports.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/admin/reports"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80"
                  >
                    {t('quickActions.reports.link')}
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
