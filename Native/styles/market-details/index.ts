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
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  starIcon: {
    margin: 0,
    padding: 0,
  },
  distance: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  activeCategoryChip: {
    backgroundColor: "#2e8b57",
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    maxWidth: "47%",
  },
  productImageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  productPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  productInfo: {
    alignItems: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e8b57",
  },
});