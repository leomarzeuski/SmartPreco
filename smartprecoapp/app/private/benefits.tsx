import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReadBenefits, useClaimBenefit } from "../../api/benefit/benefit";
import type { UserBenefitDto } from "../../api/model";
import { benefitsStyles } from "../../styles/benefits";
import { appColors } from "../../constants/theme";
import { Header } from "@/components/Header";
import { BenefitCard, FilterButtons } from "@/components/benefits";

type FilterType = "all" | "available" | "claimed" | "consumed";

const BenefitsScreen = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const {
    data: benefitsResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useReadBenefits();

  const claimBenefitMutation = useClaimBenefit({
    mutation: {
      onSuccess: (data, variables) => {
        Alert.alert(
          "Benefício Resgatado!",
          `Seu código de validação é: ${data.code}\n\nGuarde este código para usar no estabelecimento.`,
          [
            {
              text: "OK",
              onPress: () => refetch(),
            },
          ]
        );
      },
      onError: (error) => {
        Alert.alert(
          "Erro ao Resgatar",
          "Não foi possível resgatar o benefício. Tente novamente.",
          [{ text: "OK" }]
        );
        console.error("Claim benefit error:", error);
      },
    },
  });

  const benefitsData = benefitsResponse?.data;
  const benefits = benefitsData?.records || [];

  const handleClaimBenefit = (benefitId: string, benefitName: string) => {
    Alert.alert(
      "Resgatar Benefício",
      `Deseja resgatar o benefício "${benefitName}"?\n\nApós o resgate, você receberá um código para usar no estabelecimento.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Resgatar",
          onPress: () => {
            claimBenefitMutation.mutate({ benefitId });
          },
        },
      ]
    );
  };

  const copyCodeToClipboard = (code: string) => {
    Clipboard.setString(code);
    Alert.alert(
      "Código Copiado!",
      "O código foi copiado para a área de transferência.",
      [{ text: "OK" }]
    );
  };

  const filterBenefits = (benefits: UserBenefitDto[]) => {
    switch (filter) {
      case "available":
        return benefits.filter((item) => item.status === "ASSIGNED");
      case "claimed":
        return benefits.filter((item) => item.status === "CLAIMED");
      case "consumed":
        return benefits.filter((item) => item.status === "CONSUMED");
      default:
        return benefits;
    }
  };

  const filteredBenefits = filterBenefits(
    benefits.filter(
      (item): item is UserBenefitDto => "userId" in item && "benefitId" in item
    )
  );

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case "available":
        return "disponíveis";
      case "claimed":
        return "resgatados";
      case "consumed":
        return "utilizados";
      default:
        return "";
    }
  };

  const renderBenefitItem = ({ item }: { item: UserBenefitDto }) => {
    const isClaimingThis =
      claimBenefitMutation.isPending &&
      claimBenefitMutation.variables?.benefitId === item.benefit?.id;

    return (
      <BenefitCard
        item={item}
        onClaim={handleClaimBenefit}
        onCopyCode={copyCodeToClipboard}
        isClaimingThis={isClaimingThis}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={benefitsStyles.emptyState}>
      <Text style={benefitsStyles.emptyStateTitle}>
        {filter === "all"
          ? "Nenhum benefício encontrado"
          : `Nenhum benefício ${getFilterLabel(filter)} encontrado`}
      </Text>
      <Text style={benefitsStyles.emptyStateText}>
        {filter === "all"
          ? "Você ainda não possui benefícios disponíveis."
          : `Você não possui benefícios ${getFilterLabel(filter)}.`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={benefitsStyles.errorState}>
      <Text style={benefitsStyles.errorTitle}>Erro ao carregar benefícios</Text>
      <Text style={benefitsStyles.errorText}>
        Ocorreu um erro ao buscar seus benefícios. Tente novamente.
      </Text>
      <TouchableOpacity
        style={benefitsStyles.retryButton}
        onPress={() => refetch()}
      >
        <Text style={benefitsStyles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={benefitsStyles.container}>
        <View style={benefitsStyles.header}>
          <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        </View>
        <View style={benefitsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={benefitsStyles.loadingText}>
            Carregando benefícios...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={benefitsStyles.container}>
        <Header />
        <View style={benefitsStyles.header}>
          <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        </View>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={benefitsStyles.container}>
      <Header />
      <View style={benefitsStyles.header}>
        <Text style={benefitsStyles.headerTitle}>Meus Benefícios</Text>
        <Text style={benefitsStyles.headerSubtitle}>
          {benefits.length || 0} benefício(s) disponível(is)
        </Text>
      </View>

      <FilterButtons
        filter={filter}
        setFilter={setFilter}
        benefits={benefits.filter(
          (item): item is UserBenefitDto =>
            "userId" in item && "benefitId" in item
        )}
      />

      <FlatList
        data={filteredBenefits}
        renderItem={renderBenefitItem}
        keyExtractor={(item) => item.benefitId}
        contentContainerStyle={[
          benefitsStyles.listContainer,
          filteredBenefits.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[appColors.primary]}
            tintColor={appColors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default BenefitsScreen;
