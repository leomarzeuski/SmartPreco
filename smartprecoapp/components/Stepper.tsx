import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";

interface StepData {
  id: string | number;
  title: string;
}

interface StepperProps {
  steps: StepData[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <View style={styles.stepperHeader}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <View
                style={[
                  styles.stepperLine,
                  isCompleted && styles.stepperLineCompleted,
                ]}
              />
            )}
            <View style={[styles.stepContainer, isActive && styles.stepActive]}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isCompleted) && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  (isActive || isCompleted) && styles.stepTextActive,
                ]}
              >
                {step.title}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stepperHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  stepContainer: {
    alignItems: "center",
    maxWidth: 100,
  },
  stepActive: {
    opacity: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  stepCircleActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  stepNumber: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepText: {
    fontSize: 11,
    color: "#777777",
    textAlign: "center",
  },
  stepTextActive: {
    color: appColors.primary,
    fontWeight: "500",
  },
  stepperLine: {
    width: 30,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 2,
  },
  stepperLineCompleted: {
    backgroundColor: appColors.primary,
  },
});

export default Stepper;
