import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  favoriteItem: {
    width: 150,
    marginRight: 10,
  },
  card: {
    borderRadius: 8,
    elevation: 2,
    height: 160,
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
  imageContainer: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 12,
    height: 80,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: "#999",
  },
});
