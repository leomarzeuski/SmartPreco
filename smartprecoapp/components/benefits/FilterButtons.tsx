import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { UserBenefitDto } from "../../api/model";
import { benefitsStyles } from "../../styles/benefits";

type FilterType = "all" | "available" | "claimed" | "consumed";

interface FilterButtonsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  benefits: UserBenefitDto[];
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  filter,
  setFilter,
  benefits,
}) => {
  return (
    <View style={benefitsStyles.filterContainer}>
      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "all" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("all")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "all" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          {`Todos \n (${benefits.length})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "available" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("available")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "available" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          {`Disponíveis \n (${
            benefits.filter((b) => b.status === "ASSIGNED").length
          })`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "claimed" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("claimed")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "claimed" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          {`Resgatados \n (${
            benefits.filter((b) => b.status === "CLAIMED").length
          })`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          benefitsStyles.filterButton,
          filter === "consumed" && benefitsStyles.filterButtonActive,
        ]}
        onPress={() => setFilter("consumed")}
      >
        <Text
          style={[
            benefitsStyles.filterButtonText,
            filter === "consumed" && benefitsStyles.filterButtonTextActive,
          ]}
        >
          {`Utilizados \n (${
            benefits.filter((b) => b.status === "CONSUMED").length
          })`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterButtons;
