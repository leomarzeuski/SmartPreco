import { appColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  infoSection: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColors.primary,
    marginBottom: 16,
  },
  productCategory: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  marketItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 8,
  },
  marketInfo: {
    flex: 1,
  },
  marketNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  marketName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  unmoderatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  unmoderatedText: {
    fontSize: 12,
    color: "#e74c3c",
    fontWeight: "500",
    marginLeft: 4,
  },
  marketDetail: {
    fontSize: 14,
    color: "#666",
  },
  marketPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.primary,
    marginRight: 8,
  },
  unmoderatedPrice: {
    color: "#e74c3c",
    textDecorationLine: "line-through",
  },
  marketArrow: {
    margin: 0,
  },
  compareSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  compareButton: {
    backgroundColor: appColors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  reportButton: {
    padding: 16,
    alignItems: "center",
  },
  reportButtonText: {
    color: "#FF3B30",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 16,
  },
}); 