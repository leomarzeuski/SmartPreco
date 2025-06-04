import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  productCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,

    elevation: 2,
    backgroundColor: "#fff",
    position: "relative",
  },
  typeBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#3498db",
    width: 24,
    height: 24,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  typeBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  warningBadge: {
    position: "absolute",
    top: 0,
    right: 30,
    backgroundColor: "#e74c3c",
    width: 20,
    height: 20,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  productContent: {
    flexDirection: "row",
    padding: 12,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#f5f5f5",
  },
  productImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  productPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
    lineHeight: 16,
  },
  productLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  favoriteButton: {
    alignSelf: "center",
    margin: 0,
  },
});
