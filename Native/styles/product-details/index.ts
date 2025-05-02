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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  marketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  marketInfo: {
    flex: 1,
  },
  marketName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
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
    color: "#2e8b57",
  },
  marketArrow: {
    margin: 0,
    padding: 0,
  },
  compareSection: {
    padding: 20,
    alignItems: "center",
  },
  compareButton: {
    backgroundColor: "#2e8b57",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});